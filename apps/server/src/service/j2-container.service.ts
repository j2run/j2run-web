import { Injectable, Logger } from '@nestjs/common';
import { J2Docker } from '../utils/docker';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DockerNode, DockerNodeDocument } from 'src/schema/docker-node.schema';
import {
  DockerContainer,
  DockerContainerDocument,
  DockerContainerState,
} from 'src/schema/docker-container.schema';
import { benchmarkRuntime } from 'src/utils/time';
import * as Dockerode from 'dockerode';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import { Pack, pack } from 'tar-stream';

import { spawn } from 'child_process';
import { UserDocument } from 'src/schema/user.schema';
import { Game, GameDocument } from 'src/schema/game.schema';
import { Plan, PlanDocument } from 'src/schema/plan.schema';
import { generatePassword } from 'src/utils/password';
import { CONTAINER_DATA_PATH, CONTAINER_GAME_FILE, CONTAINER_PASSWORD_FILE } from 'src/constants/docker-node.constant';

@Injectable()
export class J2ContainerService {
  private readonly logger = new Logger('J2ContainerService');

  constructor(
    @InjectModel(DockerNode.name)
    private dockerNodeModel: Model<DockerNodeDocument>,
    @InjectModel(DockerContainer.name)
    private dockerContainerModel: Model<DockerContainerDocument>,
    @InjectModel(Game.name)
    private gameModel: Model<GameDocument>,
    @InjectModel(Plan.name)
    private planModel: Model<PlanDocument>,
  ) {}

  private async sync() {
    await this.syncNodes();
    await this.syncContainers();
  }

  private async syncNodes() {
    const bmr = benchmarkRuntime('syncNodes');
    const nodes = await this.dockerNodeModel.find({});
    for (const node of nodes) {
      const docker = new J2Docker(node.ip, node.port);
      const info = await docker.info().catch((err) => {
        this.logger.error(err);
        return Promise.resolve(null);
      });
      if (!info) {
        continue;
      }
      node.dockerRawId = info.ID;
      node.ncpu = info.NCPU;
      node.memTotal = info.MemTotal;
      node.containersRunning = info.ContainersRunning;
      node.containersPaused = info.ContainersPaused;
      node.containersStopped = info.ContainersStopped;
      node.images = info.Images;
      node.operatingSystem = info.OperatingSystem;
    }
    this.dockerNodeModel.bulkSave(nodes);
    bmr();
  }

  private async syncContainers() {
    const bmr = benchmarkRuntime('syncContainer');

    // get plan to hashmap
    const plans = await this.planModel.find({});
    const hashmapPlans = plans.reduce((val, item) => {
      val[item._id.toString()] = item;
      return val;
    }, {} as { [key: string]: PlanDocument });

    // sync containers
    const nodes = await this.dockerNodeModel.find({});
    for (const nodeIndex in nodes) {
      const node = nodes[nodeIndex];
      node.computeCurrentCpu = 0;

      const docker = new J2Docker(node.ip, node.port);
      const containers: Dockerode.ContainerInfo[] | null = await docker
        .containers()
        .catch((err) => {
          this.logger.error(err);
          return Promise.resolve(null);
        });
      if (!containers) {
        continue;
      }

      // get containers to hashmap
      const hashmapRowContainers: { [key: string]: DockerContainerDocument } =
        {};
      const containerRows = await this.dockerContainerModel.find({
        dockerNodeId: new Types.ObjectId(node._id),
        deleteAt: {
          $exists: false,
        },
      });
      for (const containerRow of containerRows) {
        const k = nodeIndex + node._id + containerRow.containerRawId;
        hashmapRowContainers[k] = containerRow;
      }

      // update
      for (const container of containers) {
        const k = nodeIndex + node._id + container.Id;
        let containerRow = hashmapRowContainers[k];
        if (!containerRow) {
          containerRow = await this.dockerContainerModel.create({
            dockerNodeId: new Types.ObjectId(node._id),
            containerRawId: container.Id,
          });
          containerRows.push(containerRow);
        }
        containerRow.stage = container.State as DockerContainerState;
        containerRow.status = container.Status;
        containerRow.created = container.Created;
        for (const port of container.Ports) {
          if (
            (port.IP === '0.0.0.0' || port.IP === '::') &&
            port.PrivatePort === 5900
          ) {
            containerRow.forwardIp = node.ip;
            containerRow.forwardPort = port.PublicPort;
          }
        }
        delete containerRow.deleteAt;
        delete hashmapRowContainers[k];
        if (containerRow.planId) {
          node.computeCurrentCpu +=
            hashmapPlans[containerRow.planId.toString()].cpu || 0;
        }
      }

      // remove
      for (const containerRowKey in hashmapRowContainers) {
        const containerRow = hashmapRowContainers[containerRowKey];
        containerRow.deleteAt = new Date();
      }

      this.dockerContainerModel.bulkSave(containerRows);
      this.dockerNodeModel.bulkSave(nodes);
    }
    bmr();
  }

  async newContainer(
    user: UserDocument,
    game: GameDocument,
    plan: PlanDocument,
    progress: (val: number) => void,
  ) {
    // sync
    await this.syncNodes();
    await this.syncContainers();
    progress(10);

    const bmr = benchmarkRuntime('newContainer');

    // match node with game labels
    let nodes = await this.dockerNodeModel.find({
      dockerLabelIds: {
        $in: game.dockerLabelIds.map((id) => new Types.ObjectId(id)),
      },
    });

    // match node with plan labels
    const hashmapPlanLabels = plan.dockerLabelIds.reduce((val, item) => {
      val[item.toString()] = true;
      return val;
    }, {} as { [key: string]: boolean });
    nodes = nodes.filter((node) =>
      node.dockerLabelIds.some((label) => hashmapPlanLabels[label.toString()]),
    );

    if (nodes.length === 0) {
      return Promise.reject('No resource');
    }

    // find best node
    let nodeCurrent: DockerNodeDocument | undefined;
    for (const node of nodes) {
      if (
        node.maxContainers > 0 &&
        node.containersRunning >= node.maxContainers
      ) {
        continue;
      }
      if (!nodeCurrent) {
        nodeCurrent = node;
      } else {
        const percentNew = node.ncpu - node.computeCurrentCpu;
        const percentOld = nodeCurrent.ncpu - nodeCurrent.computeCurrentCpu;
        if (percentNew > percentOld) {
          nodeCurrent = node;
        }
      }
      if (
        nodeCurrent.computeCurrentCpu >
        nodeCurrent.ncpu * (1 + (nodeCurrent.overCpu || 0))
      ) {
        nodeCurrent = null;
      }
    }
    if (!nodeCurrent) {
      return Promise.reject('No resource');
    }

    // create node
    progress(30);
    this.logger.warn('use docker: ' + nodeCurrent.ip);
    const docker = new J2Docker(nodeCurrent.ip, nodeCurrent.port);
    if (!(await docker.existsImage(plan.image))) {
      this.logger.warn('pull: ' + plan.image);
      await docker.pullImage(plan.image);
    }
    const dockerContainer = await docker.createContainer({
      Image: plan.image,
      HostConfig: {
        Binds: [`${game.diskPath}:/data/game.jar`],
        PublishAllPorts: true,
      },
    });

    // create password
    progress(50);
    const password = generatePassword();
    const passwordFile = await this.createPasswordFile(password);
    const tarStream = pack();
    tarStream.entry(
      { name: CONTAINER_PASSWORD_FILE },
      fs.readFileSync(passwordFile),
    );
    tarStream.entry(
      { name: CONTAINER_GAME_FILE },
      fs.readFileSync(passwordFile),
    );
    tarStream.finalize();
    await this.copyFileToContainer(
      dockerContainer,
      tarStream,
      CONTAINER_DATA_PATH,
    );

    // start
    progress(60);
    await dockerContainer.start();

    // save
    progress(70);
    const result = await this.dockerContainerModel.create({
      dockerNodeId: new Types.ObjectId(nodeCurrent._id),
      containerRawId: dockerContainer.id,
      userId: new Types.ObjectId(user._id),
      planId: new Types.ObjectId(plan._id),
    });

    bmr();
    // sync
    await this.syncNodes();
    await this.syncContainers();
    progress(100);

    return result;
  }

  private async createPasswordFile(password: string) {
    const tmpDir = os.tmpdir();
    const tmpFile = path.join(tmpDir, new Types.ObjectId().toString());
    const proc = spawn('storepasswd', [password, tmpFile]);
    return new Promise<string>((resolve, reject) => {
      proc.once('error', (error) => {
        this.logger.error(error);
        reject(error);
      });
      proc.once('close', () => {
        resolve(tmpFile);
      });
    });
  }

  private async copyFileToContainer(
    container: Dockerode.Container,
    stream: Pack,
    pathHost: string,
  ) {
    this.logger.warn('moving... ' + pathHost);
    return new Promise<void>((resolve, reject) => {
      container.putArchive(
        stream,
        {
          path: pathHost,
          noOverwriteDirNonDir: 'false',
        },
        (err) => {
          if (err) {
            this.logger.error(err);
            reject(err);
          } else {
            this.logger.warn('moved: ' + pathHost);
            resolve();
          }
        },
      );
    });
  }
}

import { Injectable, Logger } from '@nestjs/common';
import { J2Docker } from '../utils/docker';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { DockerNode, DockerNodeDocument } from 'src/schema/docker-node.schema';
import {
  DockerContainer,
  DockerContainerDocument,
  DockerContainerStage,
} from 'src/schema/docker-container.schema';
import { benchmarkRuntime } from 'src/utils/time';
import * as Dockerode from 'dockerode';
import * as os from 'os';
import * as fs from 'fs';
import * as path from 'path';
import * as moment from 'moment';
import { Pack, pack } from 'tar-stream';

import { spawn } from 'child_process';
import { UserDocument } from 'src/schema/user.schema';
import { Game, GameDocument } from 'src/schema/game.schema';
import { Plan, PlanDocument } from 'src/schema/plan.schema';
import { generatePassword } from 'src/utils/password';
import {
  CONTAINER_DATA_PATH,
  CONTAINER_GAME_FILE,
  CONTAINER_GAME_FILE_TMP,
  CONTAINER_PASSWORD_FILE,
} from 'src/constants/docker-node.constant';
import { PlanService } from './plan.service';
import { PlanHashmap } from 'src/dtos/plan.dto';
import { QueueSubscriptionService } from './queue-subscription.service';

@Injectable()
export class J2ContainerService {
  private readonly logger = new Logger('J2ContainerService');

  constructor(
    @InjectModel(DockerNode.name)
    private readonly dockerNodeModel: Model<DockerNodeDocument>,
    @InjectModel(DockerContainer.name)
    private readonly dockerContainerModel: Model<DockerContainerDocument>,
    @InjectModel(Game.name)
    private readonly gameModel: Model<GameDocument>,
    @InjectModel(Plan.name)
    private readonly planModel: Model<PlanDocument>,
    private readonly planService: PlanService,
    private readonly queueSubscriptionService: QueueSubscriptionService,
  ) {
    this.syncContainers();
  }

  async sync() {
    await this.syncNodes();
    await this.syncContainers();
  }

  private async syncNodes() {
    const bmr = benchmarkRuntime('syncNodes');
    const nodes = await this.dockerNodeModel.find({});
    for (const node of nodes) {
      await this.syncNode(node);
    }
    this.dockerNodeModel.bulkSave(nodes);
    bmr();
  }

  private async syncNode(node: DockerNodeDocument, isSave?: boolean) {
    const docker = new J2Docker(node.ip, node.port);
    const info = await docker.info().catch((err) => {
      this.logger.error(err);
      return Promise.resolve(null);
    });
    if (!info) {
      node.isActive = false;
      if (isSave) {
        await this.dockerNodeModel.bulkSave([node]);
      }
      return false;
    }
    node.dockerRawId = info.ID;
    node.ncpu = info.NCPU;
    node.memTotal = info.MemTotal;
    node.containersRunning = info.ContainersRunning;
    node.containersPaused = info.ContainersPaused;
    node.containersStopped = info.ContainersStopped;
    node.images = info.Images;
    node.operatingSystem = info.OperatingSystem;
    node.isActive = true;
    if (isSave) {
      await this.dockerNodeModel.bulkSave([node]);
    }
    return node;
  }

  private async syncContainers() {
    const bmr = benchmarkRuntime('syncContainer');
    const hashmapPlans = await this.planService.allHashmap();
    // sync containers
    const nodes = await this.dockerNodeModel.find({});
    for (const node of nodes) {
      await this.syncContainer(node, false, hashmapPlans);
    }
    await this.dockerNodeModel.bulkSave(nodes);

    bmr();
  }

  private async syncContainer(
    node: DockerNodeDocument,
    isNodeSave?: boolean,
    hashmapPlans?: PlanHashmap,
  ) {
    if (!hashmapPlans) {
      hashmapPlans = await this.planService.allHashmap();
    }

    node.computeCurrentCpu = 0;

    const docker = new J2Docker(node.ip, node.port);
    const containers: Dockerode.ContainerInfo[] | null = await docker
      .containers()
      .catch((err) => {
        this.logger.error(err);
        return Promise.resolve(null);
      });
    if (!containers) {
      return false;
    }

    // get containers to hashmap
    const hashmapRowContainers: { [key: string]: DockerContainerDocument } = {};
    const containerRows = await this.dockerContainerModel.find({
      dockerNodeId: new Types.ObjectId(node._id),
      $or: [
        {
          deleteAt: {
            $eq: null,
          },
        },
        {
          deleteAt: {
            $exists: false,
          },
        },
        {
          containerRawId: {
            $in: containers.map((container) => container.Id),
          },
        },
      ],
    });
    for (const containerRow of containerRows) {
      const k = node._id + containerRow.containerRawId;
      hashmapRowContainers[k] = containerRow;
    }

    // update
    for (const container of containers) {
      const k = node._id + container.Id;
      let containerRow = hashmapRowContainers[k];
      if (!containerRow) {
        containerRow = await this.dockerContainerModel.create({
          dockerNodeId: new Types.ObjectId(node._id),
          containerRawId: container.Id,
        });
        containerRows.push(containerRow);
      }
      containerRow.stage = container.State as DockerContainerStage;
      containerRow.status = container.Status;
      containerRow.created = container.Created;
      // for (const port of container.Ports) {
      //   if (
      //     (port.IP === '0.0.0.0' ||
      //       port.IP === '127.0.0.1' ||
      //       port.IP === '::') &&
      //     port.PrivatePort === 5900
      //   ) {
      //     if (node.originUrl) {
      //       containerRow.connectionUrl =
      //         node.originUrl + port.PublicPort.toString();
      //     } else {
      //       containerRow.connectionUrl = `${node.ip}:${port.PublicPort}`;
      //     }
      //   }
      // }
      if (container.NetworkSettings?.Networks?.bridge) {
        const ip =
          container.NetworkSettings.Networks.bridge.IPAddress.split('.');
        containerRow.connectionUrl = node.originUrl + ip[2] + '.' + ip[3];
      }
      containerRow.deleteAt = null;
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

    await this.dockerContainerModel.bulkSave(containerRows);
    if (isNodeSave) {
      await this.dockerNodeModel.bulkSave([node]);
    }
  }

  async newContainer(
    name: string,
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
      return Promise.reject(new Error('No resource'));
    }

    // find best node
    let nodeCurrent: DockerNodeDocument | undefined;
    for (const node of nodes) {
      if (!node.isActive) {
        continue;
      }
      if (
        node.maxContainers > 0 &&
        node.containersRunning >= node.maxContainers
      ) {
        continue;
      }
      if (!nodeCurrent) {
        nodeCurrent = node;
      } else {
        const percentNew =
          node.ncpu * (node.overCpu || 1) - node.computeCurrentCpu;
        const percentOld =
          nodeCurrent.ncpu * (nodeCurrent.overCpu || 1) -
          nodeCurrent.computeCurrentCpu;
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
      return Promise.reject(new Error('No resource'));
    }

    // create node
    progress(30);
    this.logger.warn('use docker: ' + nodeCurrent.ip);
    const docker = new J2Docker(nodeCurrent.ip, nodeCurrent.port);
    if (!(await docker.existsImage(plan.image))) {
      if (!plan.imagePath) {
        this.logger.warn('pull: ' + plan.image);
        await docker.pullImage(plan.image);
      } else {
        this.logger.warn('load: ' + plan.image + ' ' + plan.imagePath);
        await docker.loadImage(plan.image, plan.imagePath);
      }
    }
    const dockerContainer = await docker.createContainer({
      Image: plan.image,
      HostConfig: {
        // PublishAllPorts: true,
        Memory: plan.ram * 1024 * 1024,
        NanoCpus: !plan.cpu || plan.cpu < 0 ? undefined : plan.cpu * 10 ** 9,
        // PortBindings: {
        //   '5900/tcp': [{ HostIp: '127.0.0.1', HostPort: '0' }],
        // },
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
      { name: CONTAINER_GAME_FILE_TMP },
      fs.readFileSync(game.diskPath),
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

    // change game -> game.jar
    progress(65);
    await this.command(dockerContainer, [
      'mv',
      path.join(CONTAINER_DATA_PATH, CONTAINER_GAME_FILE_TMP),
      path.join(CONTAINER_DATA_PATH, CONTAINER_GAME_FILE),
    ]);

    // save
    progress(70);
    const usageSecond = plan.usageSecond;
    const expirationDate = moment().add(usageSecond, 'second').toDate();
    const result = await this.dockerContainerModel.create({
      dockerNodeId: new Types.ObjectId(nodeCurrent._id),
      containerRawId: dockerContainer.id,
      userId: new Types.ObjectId(user._id),
      planId: new Types.ObjectId(plan._id),
      gameId: new Types.ObjectId(game._id),
      isAutoRenew: !plan.notRenew,
      password,
      expirationDate,
      name,
    });

    // create subscription
    progress(80);
    const subscriptionJob = await this.queueSubscriptionService.addSubscription(
      {
        dockerContainerId: result._id,
        userId: user._id,
        usageSecond,
        expirationDate,
      },
    );

    // update subscription id
    progress(85);
    result.expirationJobId = subscriptionJob.id.toString();
    await this.dockerContainerModel.bulkSave([result]);

    bmr();
    // sync
    await this.syncNode(nodeCurrent, true);
    await this.syncContainer(nodeCurrent, true);
    progress(100);

    return await this.dockerContainerModel.findById(result._id);
  }

  startContainer(
    containerRow: DockerContainerDocument,
    progress: (val: number) => void,
  ) {
    return this.queryContainer(containerRow, progress, (container) =>
      container.start(),
    );
  }

  stopContainer(
    containerRow: DockerContainerDocument,
    progress: (val: number) => void,
  ) {
    return this.queryContainer(containerRow, progress, (container) =>
      container.stop(),
    );
  }

  restartContainer(
    containerRow: DockerContainerDocument,
    progress: (val: number) => void,
  ) {
    return this.queryContainer(containerRow, progress, (container) =>
      container.restart(),
    );
  }

  restartGameContainer(
    containerRow: DockerContainerDocument,
    progress: (val: number) => void,
  ) {
    return this.queryContainer(containerRow, progress, (container) => {
      return this.command(container, [
        'bash',
        '-c',
        "kill -15 $(ps | grep 'java -jar' | awk '{print $1}')",
      ]);
    });
  }

  resetContainer(
    containerRow: DockerContainerDocument,
    progress: (val: number) => void,
  ) {
    return this.queryContainer(containerRow, progress, async (container) => {
      await this.command(container, [
        'bash',
        '-c',
        "find /root/.microemulator/ -mindepth 1 ! -name 'config2.xml' -exec rm -rf {} +",
      ]);
      return this.command(container, [
        'bash',
        '-c',
        "kill -15 $(ps | grep 'java -jar' | awk '{print $1}')",
      ]);
    });
  }

  removeContainer(
    containerRow: DockerContainerDocument,
    progress: (val: number) => void,
  ) {
    return this.queryContainer(containerRow, progress, (container) =>
      container.remove({ force: true }),
    );
  }

  private async queryContainer(
    containerRow: DockerContainerDocument,
    progress: (val: number) => void,
    callback: (container: Dockerode.Container) => Promise<void>,
  ) {
    progress(10);
    const node = await this.dockerNodeModel.findById(containerRow.dockerNodeId);
    if (!node) {
      return Promise.reject(new Error('not exists node'));
    }

    progress(40);
    const docker = new J2Docker(node.ip, node.port);

    progress(50);
    await callback(docker.getContainer(containerRow.containerRawId));

    progress(70);
    await this.syncNode(node);
    await this.syncContainer(node);
    progress(100);
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

  private command(container: Dockerode.Container, cmd: string[]) {
    return new Promise<void>((res, rej) => {
      container.exec(
        {
          Cmd: cmd,
        },
        (err, exec) => {
          if (err) {
            rej(err);
            return;
          }

          exec.start({}, (err) => {
            if (err) {
              rej(err);
              return;
            }
            res();
          });
        },
      );
    });
  }
}

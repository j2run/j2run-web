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
import { UserDocument } from 'src/schema/user.schema';
import { Game, GameDocument } from 'src/schema/game.schema';

@Injectable()
export class J2ContainerService {
  private readonly logger = new Logger('J2ContainerService');

  constructor(
    @InjectModel(DockerNode.name)
    private dockerNodeModel: Model<DockerNodeDocument>,
    @InjectModel(DockerContainer.name)
    private dockerContainerModel: Model<DockerContainerDocument>,
    @InjectModel(Game.name)
    private GameModel: Model<GameDocument>,
  ) {
    // (async () => {
    //   await this.newContainer(
    //     { userId: new Types.ObjectId() } as any,
    //     await this.GameModel.findOne({}),
    //   );
    // })();
  }

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
    const nodes = await this.dockerNodeModel.find({});
    for (const nodeIndex in nodes) {
      const node = nodes[nodeIndex];
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
      }

      // remove
      for (const containerRowKey in hashmapRowContainers) {
        const containerRow = hashmapRowContainers[containerRowKey];
        containerRow.deleteAt = new Date();
      }

      this.dockerContainerModel.bulkSave(containerRows);
    }
    bmr();
  }

  async newContainer(user: UserDocument, game: GameDocument) {
    // sync
    await this.syncNodes();
    const bmr = benchmarkRuntime('newContainer');

    // match node with labels
    const nodes = await this.dockerNodeModel.find({
      dockerLabelIds: {
        $in: game.dockerLabelIds.map((id) => new Types.ObjectId(id)),
      },
    });
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
        const percentNew = node.ncpu - node.containersRunning * 0.3;
        const percentOld =
          nodeCurrent.ncpu - nodeCurrent.containersRunning * 0.3;
        if (percentNew > percentOld) {
          nodeCurrent = node;
        }
      }
    }
    if (!nodeCurrent) {
      return Promise.reject('No resource');
    }

    // create node
    this.logger.warn('use docker: ' + nodeCurrent.ip);
    const docker = new J2Docker(nodeCurrent.ip, nodeCurrent.port);
    if (!(await docker.existsImage(game.image))) {
      this.logger.warn('pull: ' + game.image);
      await docker.pullImage(game.image);
    }
    const dockerContainer = await docker.createContainer({
      Image: game.image,
      HostConfig: {
        Binds: [`${game.diskPath}:/data/game.jar`],
        PublishAllPorts: true,
      },
    });

    await this.dockerContainerModel.create({
      dockerNodeId: new Types.ObjectId(nodeCurrent._id),
      containerRawId: dockerContainer.id,
      userId: new Types.ObjectId(user._id),
    });

    await dockerContainer.start();
    bmr();

    // sync
    await this.syncNodes();
    await this.syncContainers();
    return true;
  }
}

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

@Injectable()
export class J2ContainerService {
  private readonly logger = new Logger('J2ContainerService');

  constructor(
    @InjectModel(DockerNode.name)
    private dockerNodeModel: Model<DockerNodeDocument>,
    @InjectModel(DockerContainer.name)
    private dockerContainerModel: Model<DockerContainerDocument>,
  ) {
    this.sync();
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
      const containerIds = containers.map((container) => container.Id);
      const containerRows = await this.dockerContainerModel.find({
        dockerNodeId: new Types.ObjectId(node._id),
        containerRawId: {
          $in: containerIds,
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
      }
      this.dockerContainerModel.bulkSave(containerRows);
    }
    bmr();
  }
}

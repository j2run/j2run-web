import { Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import { DockerInfo, DockerNodeInfo } from 'src/dtos/docker.dto';

export class J2Docker {
  docker: Docker;
  logger: Logger;

  constructor(
    private readonly host: string,
    private readonly port: number | string,
  ) {
    this.logger = new Logger('ContainerService');
    this.logger.log(`Docker: ${host}:${port}`);
    this.docker = new Docker({
      host,
      port,
    });
  }

  ping() {
    return new Promise((resolve, reject) => {
      this.docker.ping((err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  }

  info() {
    return new Promise<DockerInfo>((resolve, reject) => {
      this.docker.info((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  containers() {
    return new Promise<Docker.ContainerInfo[]>((resolve, reject) => {
      this.docker.listContainers((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  nodes() {
    return new Promise<DockerNodeInfo[]>((resolve, reject) => {
      this.docker.listNodes((err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  nodeInfo(nodeId: string): Promise<DockerNodeInfo> {
    return this.docker.getNode(nodeId).inspect();
  }

  updateNodeLabels(
    nodeInfo: DockerNodeInfo,
    labels: { [key: string]: string },
  ) {
    return this.docker.getNode(nodeInfo.ID).update({
      ...nodeInfo.Spec,
      version: nodeInfo.Version.Index,
      Labels: labels,
    });
  }
}

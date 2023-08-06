import { Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import * as fs from 'fs';
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
      timeout: 10000,
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

  existsImage(image: string) {
    return new Promise<boolean>((resolve, reject) => {
      this.docker.listImages(
        { filters: JSON.stringify({ reference: [image] }) },
        (err, images) => {
          if (err) {
            reject(err);
          }
          const isImageExists = images && images.length > 0;
          resolve(isImageExists);
        },
      );
    });
  }

  pullImage(image: string) {
    return new Promise<any[]>((resolve, reject) => {
      this.docker.pull(
        image,
        {},
        (err, result) => {
          if (err) {
            reject(err);
            return;
          }
          this.docker.modem.followProgress(result, (err, output) => {
            if (err) {
              reject(err);
              return;
            }
            this.logger.warn('Image pulled successfully. ' + image);
            resolve(output);
          });
        },
        {},
      );
    });
  }

  async loadImage(image: string, path: string) {
    const stream = fs.createReadStream(path);
    await this.docker.loadImage(stream);
  }

  containers() {
    return new Promise<Docker.ContainerInfo[]>((resolve, reject) => {
      this.docker.listContainers({ all: true }, (err, result) => {
        if (err) {
          reject(err);
          return;
        }
        resolve(result);
      });
    });
  }

  createContainer(options: Docker.ContainerCreateOptions) {
    return this.docker.createContainer(options);
  }

  getContainer(id: string) {
    return this.docker.getContainer(id);
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

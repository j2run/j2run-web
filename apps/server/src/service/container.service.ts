import { Injectable, Logger } from '@nestjs/common';
import * as Docker from 'dockerode';
import * as fs from 'fs';

@Injectable()
export class ContainerService {
  docker: Docker;
  logger: Logger;

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  constructor() {
    this.logger = new Logger('ContainerService');
    this.logger.log('Let go!');
    this.connectDockerSwarm();
  }

  connectDockerSwarm() {
    this.docker = new Docker({
      host: 'j2.master',
      port: 2376,
    });
    this.docker.listNodes().then((r) => console.log(r));
  }
}

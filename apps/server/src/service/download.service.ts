import { ForbiddenException, Injectable, NotFoundException, StreamableFile } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import * as express from 'express';
import {
  DownloadDockerContainerLogPayload,
  DownloadPayload,
  DownloadType,
} from 'src/dtos/download.dto';
import { J2ContainerService } from './j2-container.service';
import { Duplex } from 'stream';

@Injectable()
export class DownloadService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly j2ContainerService: J2ContainerService,
  ) {}

  async download(token: string, res: express.Response) {
    token = atob(token);
    const payload = (await this.verifyAccess(token).catch(
      () => null,
    )) as DownloadPayload<any>;
    if (!payload) {
      return Promise.reject(new ForbiddenException());
    }

    let file: WritableStream | Duplex;
    switch (payload.type) {
      case DownloadType.DockerLog:
        const data = payload.data as DownloadDockerContainerLogPayload;
        file = await this.j2ContainerService.readLogByDockerContainterId(
          data.dockerContainerId,
        );
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${data.dockerContainerId}.json"`,
        });
        break;
      default:
        return Promise.reject(new NotFoundException());
    }

    if (file) {
      return new StreamableFile(file);
    }
  }

  async createLinkCloudLog(dockerContainerId: string) {
    const token = await this.signAccess<DownloadDockerContainerLogPayload>({
      type: DownloadType.DockerLog,
      data: {
        dockerContainerId,
      },
    });
    console.log(token);
    return this.createLink(token);
  }

  createLink(token: string) {
    return `${this.configService.get('J2_DOWNLOAD_LINK')}${btoa(token)}`;
  }

  signAccess<T>(data: DownloadPayload<T>) {
    return this.jwtService.signAsync(data, {
      secret: this.configService.get('J2_JWT_DOWNLOAD_SECRET'),
      expiresIn: this.configService.get('J2_JWT_DOWNLOAD_EXPIRED'),
    });
  }

  verifyAccess(data: string): Promise<DownloadPayload<any>> {
    return this.jwtService.verifyAsync(data, {
      secret: this.configService.get('J2_JWT_DOWNLOAD_SECRET'),
    });
  }
}

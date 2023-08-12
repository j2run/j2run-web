import { Controller, Get, Param, Res } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { DownloadService } from 'src/service/download.service';

@ApiTags('download')
@Controller('download')
export class DownloadController {
  constructor(private readonly downloadService: DownloadService) {}

  @Get(':token')
  async list(
    @Res({ passthrough: true }) res: express.Response,
    @Param('token') token: string,
  ) {
    return await this.downloadService.download(token, res);
  }
}

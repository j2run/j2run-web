import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { CloudActionRequest, CloudCreateRequest, GetCloudLogRequest } from 'src/dtos/cloud.dto';
import { JobDockerType } from 'src/dtos/job.dto';
import { UserDocument } from 'src/schema/user.schema';
import { CloudService } from 'src/service/cloud.service';

@ApiBearerAuth()
@ApiTags('cloud')
@UseGuards(AuthGuard('jwt-access'))
@Controller('cloud')
export class CloudController {
  constructor(private readonly cloudService: CloudService) {}

  @Get('list')
  list(@Req() request: express.Request) {
    const user = request.user as UserDocument;
    return this.cloudService.getAllView(user);
  }

  @Post('create')
  create(@Req() request: express.Request, @Body() dto: CloudCreateRequest) {
    const user = request.user as UserDocument;
    return this.cloudService.create(dto, user);
  }

  @Post('remove')
  remove(@Req() request: express.Request, @Body() dto: CloudActionRequest) {
    const user = request.user as UserDocument;
    return this.cloudService.action(JobDockerType.Remove, dto, user);
  }

  @Post('stop')
  stop(@Req() request: express.Request, @Body() dto: CloudActionRequest) {
    const user = request.user as UserDocument;
    return this.cloudService.action(JobDockerType.Stop, dto, user);
  }

  @Post('start')
  start(@Req() request: express.Request, @Body() dto: CloudActionRequest) {
    const user = request.user as UserDocument;
    return this.cloudService.action(JobDockerType.Start, dto, user);
  }

  @Post('restart')
  restart(@Req() request: express.Request, @Body() dto: CloudActionRequest) {
    const user = request.user as UserDocument;
    return this.cloudService.action(JobDockerType.Restart, dto, user);
  }

  @Post('restart-game')
  restartGame(
    @Req() request: express.Request,
    @Body() dto: CloudActionRequest,
  ) {
    const user = request.user as UserDocument;
    return this.cloudService.action(JobDockerType.RestartGame, dto, user);
  }

  @Post('reset')
  reset(@Req() request: express.Request, @Body() dto: CloudActionRequest) {
    const user = request.user as UserDocument;
    return this.cloudService.action(JobDockerType.Reset, dto, user);
  }

  @Post('log')
  getLog(@Req() request: express.Request, @Body() dto: GetCloudLogRequest) {
    const user = request.user as UserDocument;
    return this.cloudService.createLinkLog(dto, user);
  }
}

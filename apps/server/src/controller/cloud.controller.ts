import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { CloudCreateRequest } from 'src/dtos/cloud.dto';
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
  remove() {
    return 1;
  }

  @Post('stop')
  stop() {
    return 1;
  }

  @Post('start')
  start() {
    return 1;
  }

  @Post('restart')
  restart() {
    return 1;
  }
}

import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { UserDocument } from 'src/schema/user.schema';
import { DockerActionService } from 'src/service/docker-action.service';

@ApiBearerAuth()
@ApiTags('cloud-action')
@UseGuards(AuthGuard('jwt-access'))
@Controller('cloud-action')
export class DockerActionController {
  constructor(private readonly dockerActionService: DockerActionService) {}

  @Get('list')
  list(@Req() request: express.Request) {
    const user = request.user as UserDocument;
    return this.dockerActionService.list(user);
  }
}

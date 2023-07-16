import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { J2ContainerService } from './j2-container.service';
import { DockerNodeService } from './docker-node.service';
import { DockerContainerService } from './docker-container.service';
import { GameService } from './game.service';
import { UserService } from './user.service';
import { DockerLabelService } from './docker-label.service';
import { PlanService } from './plan.service';

const services = [
  J2ContainerService,
  DockerNodeService,
  DockerContainerService,
  GameService,
  UserService,
  DockerLabelService,
  PlanService,
];

@Module({
  imports: [SchemaModule],
  providers: [...services],
  exports: services,
})
export class ServicesModule {}

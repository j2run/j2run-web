import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { J2ContainerService } from './j2-container.service';
import { DockerNodeService } from './docker-node.service';
import { DockerContainerService } from './docker-container.service';
import { GameService } from './game.service';
import { UserService } from './user.service';
import { DockerLabelService } from './docker-label.service';
import { PlanService } from './plan.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/configs/jwt.config';

const services = [
  J2ContainerService,
  DockerNodeService,
  DockerContainerService,
  GameService,
  UserService,
  DockerLabelService,
  PlanService,
  AuthService,
];

@Module({
  imports: [SchemaModule, JwtModule.registerAsync({ useClass: JwtConfig })],
  providers: [...services],
  exports: services,
})
export class ServicesModule {}

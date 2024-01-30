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
import { CloudService } from './cloud.service';
import { BullModule } from '@nestjs/bull';
import { BullConfig } from 'src/configs/bull.config';
import {
  JOB_NAME_DOCKER,
  JOB_NAME_SUBSCRIPTION,
} from 'src/constants/job.constant';
import { QueueDockerService } from './queue-docker.service';
import { QueueDockerProcessor } from './queue-docker.processor';
import { QueueSubscriptionService } from './queue-subscription.service';
import { QueueSubscriptionProcessor } from './queue-subscription.processor';
import { InvoiceCloudService } from './invoice-cloud.service';
import { DockerActionService } from './docker-action.service';
import { SIBService } from './sib.service';
import { EmailService } from './email.service';
import { DownloadService } from './download.service';
import { CloudflareService } from './web-builder/cloudflare.service';

const services = [
  J2ContainerService,
  DockerNodeService,
  DockerContainerService,
  GameService,
  UserService,
  DockerLabelService,
  PlanService,
  AuthService,
  CloudService,
  QueueDockerService,
  QueueDockerProcessor,
  QueueSubscriptionService,
  QueueSubscriptionProcessor,
  InvoiceCloudService,
  DockerActionService,
  SIBService,
  EmailService,
  DownloadService,

  //
  CloudflareService,
];

@Module({
  imports: [
    SchemaModule,
    JwtModule.registerAsync({ useClass: JwtConfig }),
    BullModule.forRootAsync({ useClass: BullConfig }),
    BullModule.registerQueue(
      { name: JOB_NAME_DOCKER },
      { name: JOB_NAME_SUBSCRIPTION },
    ),
  ],
  providers: [...services],
  exports: services,
})
export class ServicesModule {}

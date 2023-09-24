import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServicesModule } from 'src/service/services.module';
import { PlanController } from './plan.controller';
import { GameController } from './game.controller';
import { CloudController } from './cloud.controller';
import { InvoiceCloudController } from './invoice-cloud.controller';
import { DockerActionController } from './cloud-action.controller';
import { DownloadController } from './download.controller';
import { UserController } from './user.controller';

@Module({
  controllers: [
    AuthController,
    PlanController,
    GameController,
    CloudController,
    InvoiceCloudController,
    DockerActionController,
    DownloadController,
    UserController,
  ],
  imports: [ServicesModule],
})
export class ControllerModule {}

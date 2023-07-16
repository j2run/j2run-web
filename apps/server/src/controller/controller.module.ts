import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServicesModule } from 'src/service/services.module';
import { PlanController } from './plan.controller';
import { GameController } from './game.controller';
import { CloudController } from './cloud.controller';

@Module({
  controllers: [
    AuthController,
    PlanController,
    GameController,
    CloudController,
  ],
  imports: [ServicesModule],
})
export class ControllerModule {}

import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServicesModule } from 'src/service/services.module';
import { UserController } from './user.controller';

@Module({
  controllers: [AuthController, UserController],
  imports: [ServicesModule],
})
export class ControllerModule {}

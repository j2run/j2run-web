import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServicesModule } from 'src/service/services.module';

@Module({
  controllers: [AuthController],
  imports: [ServicesModule],
})
export class ControllerModule {}

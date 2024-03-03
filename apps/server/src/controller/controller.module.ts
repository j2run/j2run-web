import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/service/services.module';

@Module({
  controllers: [],
  imports: [ServicesModule],
})
export class ControllerModule {}

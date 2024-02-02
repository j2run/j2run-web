import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/service/services.module';

export const WbPrefix = '/wb';

@Module({
  controllers: [],
  imports: [ServicesModule],
})
export class WbModule {}

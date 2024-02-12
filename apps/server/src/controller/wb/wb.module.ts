import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/service/services.module';
import { WbDomainController } from './wb-domain.controller';
import { WbWebsiteController } from './wb-website.controller';

export const WbPrefix = '/wb';

@Module({
  controllers: [WbDomainController, WbWebsiteController],
  imports: [ServicesModule],
})
export class WbModule {}

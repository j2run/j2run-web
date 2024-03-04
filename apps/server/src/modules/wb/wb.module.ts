import { Module } from '@nestjs/common';
import { WbDomainModule } from './wb-domain/wb-domain.module';
import { WbWebsiteModule } from './wb-website/wb-website.module';
import { WbDomainExcludeModule } from './wb-domain-exclude/wb-domain-exclude.module';

@Module({
  controllers: [],
  imports: [WbDomainModule, WbWebsiteModule, WbDomainExcludeModule],
})
export class WbModule {}

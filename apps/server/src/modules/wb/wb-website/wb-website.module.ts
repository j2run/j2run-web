import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { WbWebsiteController } from './wb-website.controller';
import { WbWebsiteService } from './wb-website.service';
import { WbDomainExcludeModule } from '../wb-domain-exclude/wb-domain-exclude.module';

@Module({
  imports: [ServicesModule, SchemaModule, WbDomainExcludeModule],
  controllers: [WbWebsiteController],
  providers: [WbWebsiteService],
  exports: [WbWebsiteService],
})
export class WbWebsiteModule {}

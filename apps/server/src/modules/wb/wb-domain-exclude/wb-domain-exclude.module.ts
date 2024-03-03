import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { WbSubdomainExcludeService } from './wb-subdomain-exclude.service';

@Module({
  imports: [ServicesModule, SchemaModule],
  controllers: [],
  providers: [WbSubdomainExcludeService],
  exports: [WbSubdomainExcludeService],
})
export class WbDomainExcludeModule {}

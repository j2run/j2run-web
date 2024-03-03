import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { WbDomainController } from './wb-domain.controller';
import { WbDomainService } from './wb-domain.service';

@Module({
  imports: [ServicesModule, SchemaModule],
  controllers: [WbDomainController],
  providers: [WbDomainService],
  exports: [WbDomainService],
})
export class WbDomainModule {}

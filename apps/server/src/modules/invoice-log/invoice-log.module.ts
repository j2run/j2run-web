import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { InvoiceLogController } from './invoice-log.controller';
import { InvoiceLogService } from './invoice-log.service';

@Module({
  imports: [ServicesModule, SchemaModule],
  controllers: [InvoiceLogController],
  providers: [InvoiceLogService],
  exports: [InvoiceLogService],
})
export class InvoiceLogModule {}

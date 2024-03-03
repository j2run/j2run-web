import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { UserModule } from '../user/user.module';

@Module({
  imports: [ServicesModule, SchemaModule, UserModule],
  controllers: [InvoiceController],
  providers: [InvoiceService],
  exports: [InvoiceService],
})
export class InvoiceModule {}

import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { InvoiceModule } from '../invoice/invoice.module';

@Module({
  imports: [ServicesModule, SchemaModule, InvoiceModule],
  controllers: [OrderController],
  providers: [OrderService],
  exports: [OrderService],
})
export class OrderModule {}

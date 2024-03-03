import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/service/services.module';
import { ProductController } from './product.controller';
import { OrderController } from './order.controller';
import { InvoiceController } from './invoice.controller';

export const PaymentPrefix = '/payment';

@Module({
  controllers: [ProductController, OrderController, InvoiceController],
  imports: [ServicesModule],
})
export class PaymentModule {}

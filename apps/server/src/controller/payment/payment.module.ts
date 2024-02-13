import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/service/services.module';
import { ProductController } from './product.controller';
import { OrderController } from './order.controller';

export const PaymentPrefix = '/payment';

@Module({
  controllers: [ProductController, OrderController],
  imports: [ServicesModule],
})
export class PaymentModule {}

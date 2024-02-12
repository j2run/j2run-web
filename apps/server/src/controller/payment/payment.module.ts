import { Module } from '@nestjs/common';
import { ServicesModule } from 'src/service/services.module';
import { ProductController } from './product.controller';

export const PaymentPrefix = '/pay';

@Module({
  controllers: [ProductController],
  imports: [ServicesModule],
})
export class PaymentModule {}

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from 'src/configs/postgres.config';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { OrderDetailEntity } from './order-detail.entity';
import { ProductRetalOptionEntity } from './product-retal-option.entity';
import { OrderDetailWebsiteEntity } from './order-detail-website.entity';
import { InvoiceEntity } from './invoice.entity';

export const paymentOrmFeatures = [
  CategoryEntity,
  ProductEntity,
  ProductRetalOptionEntity,
  OrderEntity,
  OrderDetailEntity,
  OrderDetailWebsiteEntity,
  InvoiceEntity,
];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      extraProviders: [{ provide: 'POSTGRES_ENTITIES', useValue: paymentOrmFeatures }],
      useClass: PostgresConfig,
    }),
  ],
  exports: [TypeOrmModule.forFeature(paymentOrmFeatures)],
})
export class PaymentSchemaModule {}

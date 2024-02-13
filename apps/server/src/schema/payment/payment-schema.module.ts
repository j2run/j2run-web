import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from '../../configs/mongo.config';
import { Category, CategorySchema } from './category.schema';
import { Product, ProductSchema } from './product.schema';
import { Order, OrderSchema } from './order.schema';
import { Invoice, InvoiceSchema } from './invoice.schema';
import { Subscription, SubscriptionSchema } from './subscription.schema';
import {
  ProductRetalOption,
  ProductRetalOptionSchema,
} from './product-retal-option.schema';
import { Test } from './test.schema';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from 'src/configs/postgres.config';

export const features: ModelDefinition[] = [
  {
    name: Category.name,
    schema: CategorySchema,
  },
  {
    name: Product.name,
    schema: ProductSchema,
  },
  {
    name: ProductRetalOption.name,
    schema: ProductRetalOptionSchema,
  },
  {
    name: Order.name,
    schema: OrderSchema,
  },
  {
    name: Invoice.name,
    schema: InvoiceSchema,
  },
  {
    name: Subscription.name,
    schema: SubscriptionSchema,
  },
];

export const ormFeatures = [Test];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    MongooseModule.forFeature(features),
    TypeOrmModule.forRootAsync({
      extraProviders: [{ provide: 'POSTGRES_ENTITIES', useValue: ormFeatures }],
      useClass: PostgresConfig,
    }),
  ],
  exports: [
    MongooseModule.forFeature(features),
    TypeOrmModule.forFeature(ormFeatures),
  ],
})
export class PaymentSchemaModule {}

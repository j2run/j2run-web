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
import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from 'src/configs/postgres.config';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { OrderDetailEntity } from './order-detail.entity';
import { ProductRetalOptionEntity } from './product-retal-option.entity';
import { OrderDetailWebsiteEntity } from './order-detail-website.entity';
import { InvoiceEntity } from './invoice.entity';

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

export const ormFeatures = [
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

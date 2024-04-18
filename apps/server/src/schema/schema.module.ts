import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from '../configs/mongo.config';
import { WebBuilderSchemaModule } from './web-builder/web-builder-schema.module';

import { TypeOrmModule } from '@nestjs/typeorm';
import { PostgresConfig } from 'src/configs/postgres.config';
import { CategoryEntity } from './category.entity';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { OrderDetailEntity } from './order-detail.entity';
import { ProductRetalOptionEntity } from './product-retal-option.entity';
import { OrderDetailWebsiteEntity } from './order-detail-website.entity';
import { InvoiceEntity } from './invoice.entity';
import { UserEntity } from './user.entity';
import { InvoiceLogEntity } from './invoice-log.entity';

export const paymentOrmFeatures = [
  UserEntity,
  CategoryEntity,
  ProductEntity,
  ProductRetalOptionEntity,
  OrderEntity,
  OrderDetailEntity,
  OrderDetailWebsiteEntity,
  InvoiceEntity,
  InvoiceLogEntity,
];

export const features: ModelDefinition[] = [];

@Module({
  imports: [
    // no-sql
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    MongooseModule.forFeature(features),

    // sql
    TypeOrmModule.forRootAsync({
      extraProviders: [
        { provide: 'POSTGRES_ENTITIES', useValue: paymentOrmFeatures },
      ],
      useClass: PostgresConfig,
    }),
    TypeOrmModule.forFeature(paymentOrmFeatures),

    // diff
    WebBuilderSchemaModule,
  ],
  exports: [
    MongooseModule.forFeature(features),
    TypeOrmModule.forFeature(paymentOrmFeatures),
    WebBuilderSchemaModule,
  ],
})
export class SchemaModule {}

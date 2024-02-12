import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from '../../configs/mongo.config';
import { WbDomain, WbDomainSchema } from './wb-domain.schema';
import {
  WbSubdomainExclude,
  WbSubdomainExcludeSchema,
} from './wb-subdomain-exclude.schema';
import { WbWebsite, WbWebsiteSchema } from './wb-website.schema';

export const features: ModelDefinition[] = [
  {
    name: WbDomain.name,
    schema: WbDomainSchema,
  },
  {
    name: WbSubdomainExclude.name,
    schema: WbSubdomainExcludeSchema,
  },
  {
    name: WbWebsite.name,
    schema: WbWebsiteSchema,
  },
];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    MongooseModule.forFeature(features),
  ],
  exports: [MongooseModule.forFeature(features)],
})
export class WebBuilderSchemaModule {}

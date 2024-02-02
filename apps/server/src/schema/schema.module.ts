import { Module } from '@nestjs/common';
import { ModelDefinition, MongooseModule } from '@nestjs/mongoose';
import { MongoConfig } from '../configs/mongo.config';
import { User, UserSchema } from './user.schema';
import { DockerNode, DockerNodeSchema } from './docker-node.schema';
import {
  DockerContainer,
  DockerContainerSchema,
} from './docker-container.schema';
import { DockerLabel, DockerLabelSchema } from './docker-label.schema';
import { Game, GameSchema } from './game.schema';
import { Plan, PlanSchema } from './plan.schema';
import { InvoiceCloud, InvoiceCloudSchema } from './invoice-cloud.schema';
import { DockerAction, DockerActionSchema } from './docker-action.schema';
import { WbWebsite, WbWebsiteSchema } from './wb-website.schema';
import { WbDomain, WbDomainSchema } from './wb-domain.schema';
import {
  WbSubdomainExclude,
  WbSubdomainExcludeSchema,
} from './wb-subdomain-exclude.schema';

export const features: ModelDefinition[] = [
  {
    name: User.name,
    schema: UserSchema,
  },
  {
    name: Game.name,
    schema: GameSchema,
  },
  {
    name: DockerNode.name,
    schema: DockerNodeSchema,
  },
  {
    name: DockerContainer.name,
    schema: DockerContainerSchema,
  },
  {
    name: DockerLabel.name,
    schema: DockerLabelSchema,
  },
  {
    name: Plan.name,
    schema: PlanSchema,
  },
  {
    name: InvoiceCloud.name,
    schema: InvoiceCloudSchema,
  },
  {
    name: DockerAction.name,
    schema: DockerActionSchema,
  },
  {
    name: WbWebsite.name,
    schema: WbWebsiteSchema,
  },
  {
    name: WbDomain.name,
    schema: WbDomainSchema,
  },
  {
    name: WbSubdomainExclude.name,
    schema: WbSubdomainExcludeSchema,
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
export class SchemaModule {}

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
import { PaymentSchemaModule } from './payment/payment-schema.module';
import { WebBuilderSchemaModule } from './web-builder/payment-schema.module';

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
];

@Module({
  imports: [
    MongooseModule.forRootAsync({
      useClass: MongoConfig,
    }),
    MongooseModule.forFeature(features),
    PaymentSchemaModule,
    WebBuilderSchemaModule,
  ],
  exports: [MongooseModule.forFeature(features), WebBuilderSchemaModule],
})
export class SchemaModule {}

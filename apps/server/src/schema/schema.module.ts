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

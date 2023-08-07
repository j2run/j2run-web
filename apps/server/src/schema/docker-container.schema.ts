import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type DockerContainerDocument = HydratedDocument<DockerContainer>;

export type DockerContainerStage =
  | 'created'
  | 'restarting'
  | 'running'
  | 'removing'
  | 'paused'
  | 'exited'
  | 'dead';

@Schema({
  timestamps: true,
})
export class DockerContainer extends SchemaDto {
  @ApiProperty()
  @Prop({ index: true })
  userId: Types.ObjectId;

  @ApiProperty()
  @Prop({ index: true })
  dockerNodeId: Types.ObjectId;

  @ApiProperty()
  @Prop({ index: true })
  planId: Types.ObjectId;

  @ApiProperty()
  @Prop({ index: true })
  containerRawId: string;

  @ApiProperty()
  @Prop({ index: true })
  gameId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  connectionUrl: string;

  @ApiProperty()
  @Prop()
  stage: DockerContainerStage;

  @ApiProperty()
  @Prop()
  status: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty()
  @Prop()
  expirationHandleTime: Date;

  @ApiProperty()
  @Prop()
  expirationJobId: string;

  @ApiProperty()
  @Prop()
  expirationDate: Date;

  @ApiProperty({ default: true })
  @Prop()
  isAutoRenew: boolean;

  @ApiProperty()
  @Prop()
  created: number;

  @ApiProperty()
  @Prop()
  deleteAt: Date;
}

export const DockerContainerSchema =
  SchemaFactory.createForClass(DockerContainer);

DockerContainerSchema.index(
  { dockerNodeId: 1, containerRawId: 1 },
  { unique: true },
);

DockerContainerSchema.index({ userId: 1, deleteAt: 1 });

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type DockerContainerDocument = HydratedDocument<DockerContainer>;

export type DockerContainerState =
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
  containerRawId: string;

  @ApiProperty()
  @Prop({ index: true })
  gameId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  forwardIp: string;

  @ApiProperty()
  @Prop()
  forwardPort: number;

  @ApiProperty()
  @Prop()
  stage: DockerContainerState;

  @ApiProperty()
  @Prop()
  status: string;

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

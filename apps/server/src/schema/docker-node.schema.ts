import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type DockerNodeDocument = HydratedDocument<DockerNode>;

@Schema({
  timestamps: true,
})
export class DockerNode extends SchemaDto {
  @ApiProperty()
  @Prop({ unique: true })
  dockerRawId: string;

  @ApiProperty()
  @Prop({ unique: true })
  ip: string;

  @ApiProperty()
  @Prop()
  port: number;

  @ApiProperty()
  @Prop({ index: true })
  dockerLabelIds: Types.ObjectId[];

  @ApiProperty()
  @Prop()
  computeCurrentCpu: number;

  @ApiProperty()
  @Prop()
  overCpu: number;

  @ApiProperty()
  @Prop()
  maxContainers: number;

  @ApiProperty()
  @Prop()
  ncpu: number;

  @ApiProperty()
  @Prop({ type: Types.Decimal128 })
  memTotal: number;

  @ApiProperty()
  @Prop()
  containersRunning: number;

  @ApiProperty()
  @Prop()
  containersPaused: number;

  @ApiProperty()
  @Prop()
  containersStopped: number;

  @ApiProperty()
  @Prop()
  images: number;

  @ApiProperty()
  @Prop()
  operatingSystem: string;
}

export const DockerNodeSchema = SchemaFactory.createForClass(DockerNode);

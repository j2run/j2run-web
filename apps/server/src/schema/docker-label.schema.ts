import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type DockerLabelDocument = HydratedDocument<DockerLabel>;

@Schema({
  timestamps: true,
})
export class DockerLabel extends SchemaDto {
  @ApiProperty()
  @Prop({ unique: true })
  name: string;
}

export const DockerLabelSchema = SchemaFactory.createForClass(DockerLabel);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type PlanDocument = HydratedDocument<Plan>;

@Schema({
  timestamps: true,
})
export class Plan extends SchemaDto {
  @ApiProperty()
  @Prop({ unique: true })
  name: string;

  @ApiProperty()
  @Prop()
  image: string;

  @ApiProperty()
  @Prop()
  cpu: number;

  @ApiProperty()
  @Prop()
  ram: number;

  @ApiProperty()
  @Prop()
  fps: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  dockerLabelIds: Types.ObjectId[];
}

export const PlanSchema = SchemaFactory.createForClass(Plan);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

export type CategoryDocument = HydratedDocument<Category>;

export enum ECategoryType {
  CloudJ2ME = 1,
  CloudAndroid = 2,
  WebBuilder = 3,
}

@Schema({
  timestamps: true,
  _id: false,
})
export class Category extends SchemaDto {
  @ApiProperty({ enum: ECategoryType })
  @Prop({ enum: ECategoryType, index: true })
  id: ECategoryType;

  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  description: string;
}

export const CategorySchema = SchemaFactory.createForClass(Category);

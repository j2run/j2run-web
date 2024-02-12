import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';
import { ECategoryType } from './category.schema';
import { ProductRetalOption } from './product-retal-option.schema';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product extends SchemaDto {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  description: string;

  @ApiProperty()
  @Prop()
  categoryId: ECategoryType;

  @ApiProperty()
  retalOptions: ProductRetalOption[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);

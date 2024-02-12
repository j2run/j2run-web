import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

export type ProductRetalOptionDocument = HydratedDocument<ProductRetalOption>;

@Schema({
  timestamps: true,
})
export class ProductRetalOption extends SchemaDto {
  @ApiProperty()
  @Prop()
  productId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  price: number;

  @ApiProperty()
  @Prop()
  usageTime: number;
}

export const ProductRetalOptionSchema =
  SchemaFactory.createForClass(ProductRetalOption);

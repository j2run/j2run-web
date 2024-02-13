import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';
import {
  OrderDetailWebsite,
  OrderDetailWebsiteSchema,
} from './order-detail-website.schema';

export type OrderDetailDocument = HydratedDocument<OrderDetail>;

@Schema({
  _id: false,
})
export class OrderDetail extends SchemaDto {
  @ApiProperty()
  @Prop()
  productId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  productRetalOptionId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  price: number;

  @ApiProperty()
  @Prop({ type: OrderDetailWebsiteSchema })
  website: OrderDetailWebsite;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);

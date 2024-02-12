import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

/**
 * ----------------------
 * Order Detail
 * ----------------------
 */
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
  price: number;
}

export const OrderDetailSchema = SchemaFactory.createForClass(OrderDetail);

/**
 * ----------------------
 * Order
 * ----------------------
 */
export type OrderDocument = HydratedDocument<Order>;

@Schema({
  timestamps: true,
})
export class Order extends SchemaDto {
  @ApiProperty()
  @Prop({ type: [OrderDetailSchema] })
  details: OrderDetail[];

  @ApiProperty()
  @Prop()
  totalPrice: number;
}

export const OrderSchema = SchemaFactory.createForClass(Order);

import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';
import { OrderDetail, OrderDetailSchema } from './order-detail.schema';

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

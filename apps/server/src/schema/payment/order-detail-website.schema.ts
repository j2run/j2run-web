import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

export type OrderDetailWebsiteDocument = HydratedDocument<OrderDetailWebsite>;

@Schema({
  _id: false,
})
export class OrderDetailWebsite extends SchemaDto {
  @ApiProperty()
  @Prop()
  wbDomainId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  subdomain: Types.ObjectId;
}

export const OrderDetailWebsiteSchema =
  SchemaFactory.createForClass(OrderDetailWebsite);

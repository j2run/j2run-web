import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

export type SubscriptionDocument = HydratedDocument<Subscription>;

@Schema({
  timestamps: true,
})
export class Subscription extends SchemaDto {
  @ApiProperty()
  @Prop()
  invoiceId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  timeRenew: Date;
}

export const SubscriptionSchema = SchemaFactory.createForClass(Subscription);

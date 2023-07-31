import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type InvoiceCloudStatus = 'waiting' | 'creating' | 'created' | 'error';

export type InvoiceCloudDocument = HydratedDocument<InvoiceCloud>;

@Schema({
  timestamps: true,
})
export class InvoiceCloud extends SchemaDto {
  @ApiProperty()
  @Prop()
  planId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  gameId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  userId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  money: number;

  @ApiProperty()
  @Prop()
  status: InvoiceCloudStatus;

  @ApiProperty()
  @Prop()
  isViewed: boolean;
}

export const InvoiceCloudSchema = SchemaFactory.createForClass(InvoiceCloud);

InvoiceCloudSchema.index({
  status: 1,
  userId: 1,
});

InvoiceCloudSchema.index({
  status: 1,
  userId: 1,
  isViewed: 1,
});

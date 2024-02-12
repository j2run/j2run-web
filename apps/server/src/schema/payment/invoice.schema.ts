import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

export type InvoiceDocument = HydratedDocument<Invoice>;

@Schema({
  timestamps: true,
})
export class Invoice extends SchemaDto {
  @ApiProperty()
  @Prop()
  orderId: Types.ObjectId;

  @ApiProperty()
  @Prop()
  price: number;
}

export const InvoiceSchema = SchemaFactory.createForClass(Invoice);

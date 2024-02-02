import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type WbWebsiteDocument = HydratedDocument<WbWebsite>;

@Schema({
  timestamps: true,
})
export class WbWebsite extends SchemaDto {
  @ApiProperty()
  @Prop()
  subdomain: string;

  @ApiProperty()
  @Prop()
  wbDomainId: Types.ObjectId;
}

export const WbWebsiteSchema = SchemaFactory.createForClass(WbWebsite);

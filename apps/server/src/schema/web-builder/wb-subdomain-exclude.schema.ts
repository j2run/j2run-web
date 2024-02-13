import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

export type WbSubdomainExcludeDocument = HydratedDocument<WbSubdomainExclude>;

@Schema({
  timestamps: true,
})
export class WbSubdomainExclude extends SchemaDto {
  @ApiProperty()
  @Prop()
  subdomain: string;
}

export const WbSubdomainExcludeSchema =
  SchemaFactory.createForClass(WbSubdomainExclude);

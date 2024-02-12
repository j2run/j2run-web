import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../../dtos/schema.dto';

export type WbDomainDocument = HydratedDocument<WbDomain>;

@Schema({
  timestamps: true,
})
export class WbDomain extends SchemaDto {
  @ApiProperty()
  @Prop()
  domain: string;
}

export const WbDomainSchema = SchemaFactory.createForClass(WbDomain);

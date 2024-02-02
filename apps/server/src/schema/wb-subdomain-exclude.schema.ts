import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type WbSubdomainExcludeDocument = HydratedDocument<WbSubdomainExclude>;

@Schema({
  timestamps: true,
})
export class WbSubdomainExclude extends SchemaDto {
  @ApiProperty()
  @Prop()
  SubdomainExclude: string;

  @ApiProperty()
  @Prop()
  wbDomainId: Types.ObjectId;
}

export const WbSubdomainExcludeSchema =
  SchemaFactory.createForClass(WbSubdomainExclude);

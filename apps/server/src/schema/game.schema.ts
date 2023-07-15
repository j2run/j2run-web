import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type GameDocument = HydratedDocument<Game>;

@Schema({
  timestamps: true,
})
export class Game extends SchemaDto {
  @ApiProperty()
  @Prop()
  name: string;

  @ApiProperty()
  @Prop()
  image: string;

  @ApiProperty()
  @Prop()
  dockerLabelIds: Types.ObjectId[];

  @ApiProperty()
  @Prop()
  diskPath: string;
}

export const GameSchema = SchemaFactory.createForClass(Game);

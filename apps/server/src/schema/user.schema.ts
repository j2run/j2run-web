import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { SchemaDto } from '../dtos/schema.dto';

export type UserDocument = HydratedDocument<User>;

@Schema({
  timestamps: true,
})
export class User extends SchemaDto {
  @ApiProperty()
  @Prop()
  email: string;

  @ApiProperty()
  @Prop()
  password: string;

  @ApiProperty({ default: 0 })
  @Prop()
  balance: number;
}

export const UserSchema = SchemaFactory.createForClass(User);

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
}

export const UserSchema = SchemaFactory.createForClass(User);

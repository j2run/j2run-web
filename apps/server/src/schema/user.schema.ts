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

  @ApiProperty({ default: 1000 })
  @Prop()
  balance: number;

  @ApiProperty()
  @Prop()
  verifyToken: string;

  @ApiProperty({ default: false })
  @Prop()
  isVerified: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);

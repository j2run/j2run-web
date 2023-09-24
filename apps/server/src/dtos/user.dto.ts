import { ApiProperty } from '@nestjs/swagger';
import { MinLength, MaxLength, IsString } from 'class-validator';

export class ResetPasswordRequest {
  @ApiProperty()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password: string;
}

export class ResetPasswordResponse {
  @ApiProperty()
  status: boolean;
}

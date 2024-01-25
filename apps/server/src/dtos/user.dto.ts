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

export class ChangePasswordRequest {
  @ApiProperty()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  oldPassword: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  newPassword: string;
}

export class ChangePasswordResponse {
  @ApiProperty()
  status: boolean;
}

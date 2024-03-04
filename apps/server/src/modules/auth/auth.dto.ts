import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import { UserEntity } from 'src/schema/user.entity';

export class JwtPayload {
  id: number;
}

export class LoginRequest {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password: string;
}

export class LoginResponse {
  @ApiProperty({ type: UserEntity })
  user: UserEntity;

  @ApiProperty()
  refreshToken: string;

  @ApiProperty()
  accessToken: string;
}

export class RegisterRequest {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @MaxLength(32)
  @IsString()
  password: string;
}

export class RegisterResponse {
  status: boolean;
}

export class GetAccessTokenRequest {
  @ApiProperty()
  @IsString()
  refreshToken: string;
}

export class GetAccessTokenResponse {
  @ApiProperty()
  @IsString()
  accessToken: string;
}

export class VerifyRequest {
  @ApiProperty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsString()
  code: string;
}

export class ForgotPasswordRequest {
  @ApiProperty()
  @IsEmail()
  email: string;
}

export class ForgotPasswordResponse {
  @ApiProperty()
  status: boolean;
}

export class VerifyForgotPasswordRequest {
  @ApiProperty()
  @IsString()
  code: string;

  @ApiProperty()
  @IsEmail()
  email: string;
}

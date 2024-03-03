import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetAccessTokenRequest,
  GetAccessTokenResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyRequest,
  VerifyForgotPasswordRequest,
} from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() dto: LoginRequest): Promise<LoginResponse> {
    return this.authService.login(dto);
  }

  @Post('register')
  register(@Body() dto: RegisterRequest): Promise<RegisterResponse> {
    return this.authService.register(dto);
  }

  @Post('access')
  access(@Body() dto: GetAccessTokenRequest): Promise<GetAccessTokenResponse> {
    return this.authService.generationAccessToken(dto);
  }

  @Post('verify')
  verify(@Body() dto: VerifyRequest) {
    return this.authService.verifyAccount(dto);
  }

  @Post('forgot-password')
  forgotPassword(
    @Body() dto: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    return this.authService.forgotPassword(dto);
  }

  @Post('verify-forgot-password')
  verifyForgotPassword(
    @Body() dto: VerifyForgotPasswordRequest,
  ): Promise<LoginResponse> {
    return this.authService.verifyForgotPassword(dto);
  }
}

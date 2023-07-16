import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import {
  GetAccessTokenRequest,
  GetAccessTokenResponse,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/dtos/auth.dto';
import { AuthService } from 'src/service/auth.service';

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
}

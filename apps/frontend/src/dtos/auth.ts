import { UserDto } from "./user"

export class LoginResponseDto {
  user: UserDto;
  accessToken: string;
  refreshToken: string;
}

export class ForgotPasswordResponse {
  status: boolean;
}
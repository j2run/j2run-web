import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { v4 } from 'uuid';
import {
  GetAccessTokenRequest,
  GetAccessTokenResponse,
  JwtPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  ForgotPasswordRequest,
  ForgotPasswordResponse,
  VerifyRequest,
  VerifyForgotPasswordRequest,
} from './auth.dto';
import { UserService } from 'src/modules/user/user.service';
import { EmailService } from 'src/service/email.service';
import { emailAllows } from 'src/utils/constants/email.constant';
import {
  MSG_ACCOUNT_UNVERIFIED,
  MSG_EMAIL_DOMAIN_SUPPORT,
  MSG_EMAIL_EXISTS,
  MSG_EMAIL_NOT_EXISTS,
  MSG_VERIFY_CODE_ILEGAL,
} from 'src/utils/constants/message.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(dto: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByEmailWithPassword(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatches = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatches) {
      throw new UnauthorizedException();
    }

    if (!user.isVerified) {
      throw new UnauthorizedException(MSG_ACCOUNT_UNVERIFIED);
    }

    this.userService.hideField(user);
    const response: LoginResponse = {
      user,
      accessToken: await this.signAccess(user.id),
      refreshToken: await this.signRefresh(user.id),
    };
    return response;
  }

  async register(dto: RegisterRequest): Promise<RegisterResponse> {
    let user = await this.userService.findByEmail(dto.email, {
      id: true,
      email: true,
      isVerified: true,
    });
    if (!!user?.isVerified) {
      throw new ConflictException(MSG_EMAIL_EXISTS);
    }

    if (!emailAllows.includes(dto.email.split('@')[1])) {
      throw new ConflictException(
        MSG_EMAIL_DOMAIN_SUPPORT + emailAllows.join(', '),
      );
    }

    if (!user) {
      user = this.userService.create();
    }
    const token = v4();
    user.email = dto.email;
    user.password = await bcrypt.hash(dto.password, 12);
    user.verifyToken = token;
    user.isVerified = false;

    const isCreated = await this.userService.save(user);
    if (!isCreated?.id) {
      throw new InternalServerErrorException();
    }

    await this.emailService.sendVerifyEmail(user.email, token);

    const response: RegisterResponse = {
      status: true,
    };
    return response;
  }

  async generationAccessToken(
    dto: GetAccessTokenRequest,
  ): Promise<GetAccessTokenResponse> {
    const id = await this.verifyRefresh(dto.refreshToken).catch(() =>
      Promise.resolve(null),
    );
    if (!id) {
      throw new UnauthorizedException();
    }

    const user = await this.userService.findById(id);
    if (!user) {
      throw new UnauthorizedException();
    }
    return {
      accessToken: await this.signAccess(user.id),
    };
  }

  async verifyAccount(dto: VerifyRequest) {
    const user = await this.userService.findByEmail(dto.email, {
      id: true,
      verifyToken: true,
      email: true,
    });
    if (!user) {
      throw new NotFoundException(MSG_VERIFY_CODE_ILEGAL);
    }
    if (user.verifyToken !== dto.code) {
      throw new NotFoundException(MSG_VERIFY_CODE_ILEGAL);
    }
    await this.userService.changeAccountToVerify(user.id);
    await this.userService.removeAllAccountWithoutUserId(user.email, user.id);
  }

  async forgotPassword(
    dto: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.userService.findByEmailVerified(dto.email, {
      id: true,
      email: true,
    });
    if (!user) {
      throw new ConflictException(MSG_EMAIL_NOT_EXISTS);
    }
    const token = v4();
    await this.userService.updateForgotPasswordToken(token, user.id);
    await this.emailService.sendForgotPasswordEmail(user.email, token);
    return {
      status: true,
    };
  }

  async verifyForgotPassword(
    dto: VerifyForgotPasswordRequest,
  ): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(dto.email, {
      id: true,
      email: true,
      forgotPasswordToken: true,
    });
    if (!user) {
      throw new NotFoundException(MSG_VERIFY_CODE_ILEGAL);
    }
    if (user.forgotPasswordToken !== dto.code) {
      throw new NotFoundException(MSG_VERIFY_CODE_ILEGAL);
    }
    await this.userService.changeAccountToResetPassword(user.id);

    // send data as login
    this.userService.hideField(user);
    const response: LoginResponse = {
      user,
      accessToken: await this.signAccess(user.id),
      refreshToken: await this.signRefresh(user.id),
    };
    return response;
  }

  signAccess(id: number) {
    return this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get('J2_JWT_ACCESS_SECRET'),
        expiresIn: this.configService.get('J2_JWT_ACCESS_EXPIRED'),
      },
    );
  }

  verifyAccess(data: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(data, {
      secret: this.configService.get('J2_JWT_ACCESS_SECRET'),
    });
  }

  signRefresh(id: number) {
    return this.jwtService.signAsync(
      { id },
      {
        secret: this.configService.get('J2_JWT_REFRESH_SECRET'),
        expiresIn: this.configService.get('J2_JWT_REFRESH_EXPIRED'),
      },
    );
  }

  verifyRefresh(data: string): Promise<JwtPayload> {
    return this.jwtService.verifyAsync(data, {
      secret: this.configService.get('J2_JWT_REFRESH_SECRET'),
    });
  }
}

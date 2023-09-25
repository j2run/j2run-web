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
} from 'src/dtos/auth.dto';
import { UserService } from './user.service';
import { UserDocument } from 'src/schema/user.schema';
import { EmailService } from './email.service';
import { emailAllows } from 'src/constants/email.constant';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService,
  ) {}

  async login(dto: LoginRequest): Promise<LoginResponse> {
    const user = await this.userService.findByEmail(dto.email);
    if (!user) {
      throw new UnauthorizedException();
    }

    const isPasswordMatches = await bcrypt.compare(dto.password, user.password);
    if (!isPasswordMatches) {
      throw new UnauthorizedException();
    }

    if (!user.isVerified) {
      throw new UnauthorizedException('Tài khoản chưa được xác minh');
    }

    this.userService.hideField(user);
    const response: LoginResponse = {
      user,
      accessToken: await this.signAccess(user._id),
      refreshToken: await this.signRefresh(user._id),
    };
    return response;
  }

  async register(dto: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.userService.findByEmailVerified(dto.email);
    if (!!user) {
      throw new ConflictException('Email tồn tại');
    }

    if (!emailAllows.includes(dto.email.split('@')[1])) {
      throw new ConflictException(
        'Chỉ hổ trợ cái email sau: ' + emailAllows.join(', '),
      );
    }

    const newUser = {} as UserDocument;
    newUser.email = dto.email;
    newUser.password = await bcrypt.hash(dto.password, 12);
    newUser.verifyToken = v4();
    newUser.isVerified = false;

    const isCreated = await this.userService.insert(newUser);
    if (!isCreated?._id) {
      throw new InternalServerErrorException();
    }

    await this.emailService.sendVerifyEmail(newUser.email, newUser.verifyToken);

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
      accessToken: await this.signAccess(user._id.toString()),
    };
  }

  async verifyAccount(dto: VerifyRequest) {
    const user = await this.userService.findByVerifyCode(dto.code);
    if (!user) {
      throw new NotFoundException('Mã xác thực không hợp lệ');
    }
    user.verifyToken = null;
    user.isVerified = true;
    await this.userService.save(user);
    await this.userService.removeAllAccountWithoutUserId(user.email, user._id);
  }

  async forgotPassword(
    dto: ForgotPasswordRequest,
  ): Promise<ForgotPasswordResponse> {
    const user = await this.userService.findByEmailVerified(dto.email);
    if (!user) {
      throw new ConflictException('Email không tồn tại');
    }
    user.forgotPasswordToken = v4();
    await this.userService.save(user);
    await this.emailService.sendForgotPasswordEmail(
      user.email,
      user.forgotPasswordToken,
    );
    return {
      status: true,
    };
  }

  async verifyForgotPassword(
    dto: VerifyForgotPasswordRequest,
  ): Promise<LoginResponse> {
    const user = await this.userService.findByForgotPasswordCode(
      dto.email,
      dto.code,
    );
    if (!user) {
      throw new NotFoundException('Mã không hợp lệ');
    }
    user.forgotPasswordToken = null;
    user.isResetPassword = true;
    await this.userService.save(user);

    // send data as login
    this.userService.hideField(user);
    const response: LoginResponse = {
      user,
      accessToken: await this.signAccess(user._id),
      refreshToken: await this.signRefresh(user._id),
    };
    return response;
  }

  signAccess(id: string) {
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

  signRefresh(id: string) {
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

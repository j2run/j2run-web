import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import {
  GetAccessTokenRequest,
  GetAccessTokenResponse,
  JwtPayload,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
} from 'src/dtos/auth.dto';
import { UserService } from './user.service';
import { UserDocument } from 'src/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

    delete user.password;
    const response: LoginResponse = {
      user,
      accessToken: await this.signAccess(user._id),
      refreshToken: await this.signRefresh(user._id),
    };
    return response;
  }

  async register(dto: RegisterRequest): Promise<RegisterResponse> {
    const user = await this.userService.findByEmail(dto.email);
    if (!!user) {
      throw new ConflictException('User existed');
    }

    const newUser = {} as UserDocument;
    newUser.email = dto.email;
    newUser.password = await bcrypt.hash(dto.password, 12);

    const isCreated = await this.userService.insert(newUser);
    if (!isCreated?._id) {
      throw new InternalServerErrorException();
    }

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

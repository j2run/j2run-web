import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { ExtractJwt } from 'passport-jwt';
import { JwtPayload } from 'src/dtos/auth.dto';
import { UserService } from 'src/service/user.service';

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor(
    private configService: ConfigService,
    private userService: UserService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get('J2_JWT_REFRESH_SECRET'),
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.userService.findById(payload.id);
    if (user == null) {
      return new UnauthorizedException();
    }
    return user;
  }
}

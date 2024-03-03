import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { ServicesModule } from 'src/service/services.module';
import { AuthService } from './auth.service';
import { UserModule } from '../user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/configs/jwt.config';

@Module({
  imports: [
    JwtModule.registerAsync({ useClass: JwtConfig }),
    ServicesModule,
    UserModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}

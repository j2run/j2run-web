import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './service/services.module';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ServicesModule],
  controllers: [],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}

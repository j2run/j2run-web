import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './service/services.module';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { ControllerModule } from './controller/controller.module';
import { RouterModule } from '@nestjs/core';
import { WbClientModule } from './controller/wb-client/wb-client.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServicesModule,
    ControllerModule,
    WbClientModule,
    RouterModule.register([
      {
        path: '/wb-client',
        module: WbClientModule,
      },
    ]),
  ],
  controllers: [],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}

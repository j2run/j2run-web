import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './service/services.module';
import { JwtAccessStrategy } from './strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategy/jwt-refresh.strategy';
import { ControllerModule } from './controller/controller.module';
import { RouterModule } from '@nestjs/core';
import {
  WbClientModule,
  WbClientPrefix,
} from './controller/wb-client/wb-client.module';
import { WbModule, WbPrefix } from './controller/wb/wb.module';
import {
  PaymentModule,
  PaymentPrefix,
} from './controller/payment/payment.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServicesModule,
    ControllerModule,

    // Web Builder Module
    WbClientModule,
    WbModule,
    PaymentModule,
    RouterModule.register([
      {
        path: WbClientPrefix,
        module: WbClientModule,
      },
      {
        path: WbPrefix,
        module: WbModule,
      },
      {
        path: PaymentPrefix,
        module: PaymentModule,
      },
    ]),
  ],
  controllers: [],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}

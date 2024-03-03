import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './service/services.module';
import { JwtAccessStrategy } from './utils/strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './utils/strategy/jwt-refresh.strategy';
import { ControllerModule } from './controller/controller.module';
import { RouterModule } from '@nestjs/core';
import {
  WbClientModule,
  WbClientPrefix,
} from './controller/wb-client/wb-client.module';
import { WbModule, WbPrefix } from './controller/wb/wb.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServicesModule,
    ControllerModule,

    // // Web Builder Module
    // WbClientModule,
    // WbModule,
    // RouterModule.register([
    //   {
    //     path: WbClientPrefix,
    //     module: WbClientModule,
    //   },
    //   {
    //     path: WbPrefix,
    //     module: WbModule,
    //   },
    // ]),
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    InvoiceModule,
  ],
  controllers: [],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}

import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './service/services.module';
import { JwtAccessStrategy } from './utils/strategy/jwt-access.strategy';
import { JwtRefreshStrategy } from './utils/strategy/jwt-refresh.strategy';
import { WbClientModule } from './modules/wb-client/wb-client.module';
import { WbModule } from './modules/wb/wb.module';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { InvoiceModule } from './modules/invoice/invoice.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ServicesModule,
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    InvoiceModule,

    // Web Builder Module
    WbClientModule,
    WbModule,
  ],
  controllers: [],
  providers: [JwtAccessStrategy, JwtRefreshStrategy],
})
export class AppModule {}

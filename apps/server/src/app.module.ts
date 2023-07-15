import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ServicesModule } from './service/services.module';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ServicesModule],
  controllers: [],
  providers: [],
})
export class AppModule {}

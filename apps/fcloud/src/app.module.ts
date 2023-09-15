import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SeleniumService } from './services/selenium.service';
import { PwdService } from './services/pwd.service';

@Module({
  imports: [],
  controllers: [AppController],
  providers: [AppService, SeleniumService, PwdService],
})
export class AppModule {}

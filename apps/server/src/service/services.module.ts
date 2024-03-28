import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { SIBService } from './sib.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';

const services = [SIBService, EmailService, LoggerService];

@Module({
  imports: [SchemaModule],
  providers: [...services],
  exports: [...services],
})
export class ServicesModule {}

import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { BullModule } from '@nestjs/bull';
import { BullConfig } from 'src/configs/bull.config';
import { JOB_NAME_SUBSCRIPTION } from 'src/utils/constants/job.constant';
import { SIBService } from './sib.service';
import { EmailService } from './email.service';
import { LoggerService } from './logger.service';

const services = [SIBService, EmailService, LoggerService];

@Module({
  imports: [
    SchemaModule,
    BullModule.forRootAsync({ useClass: BullConfig }),
    BullModule.registerQueue({ name: JOB_NAME_SUBSCRIPTION }),
  ],
  providers: [...services],
  exports: [...services],
})
export class ServicesModule {}

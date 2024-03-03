import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/configs/jwt.config';
import { BullModule } from '@nestjs/bull';
import { BullConfig } from 'src/configs/bull.config';
import { JOB_NAME_SUBSCRIPTION } from 'src/utils/constants/job.constant';
import { SIBService } from './sib.service';
import { EmailService } from './email.service';
import { WbWebsiteService } from './web-builder/wb-website.service';
import { WbDomainService } from './web-builder/wb-domain.service';
import { WbSubdomainExcludeService } from './web-builder/wb-subdomain-exclude.service';
import { LoggerService } from './logger.service';
import { InvoiceService } from '../modules/invoice/invoice.service';

const services = [
  SIBService,
  EmailService,
  LoggerService,

  // // Payment
  // OrderService,
  // InvoiceService,

  // // Web Builder Service
  // WbWebsiteService,
  // WbDomainService,
  // WbSubdomainExcludeService,
];

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

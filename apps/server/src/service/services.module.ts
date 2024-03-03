import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { UserService } from './user.service';
import { AuthService } from './auth.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtConfig } from 'src/configs/jwt.config';
import { BullModule } from '@nestjs/bull';
import { BullConfig } from 'src/configs/bull.config';
import { JOB_NAME_SUBSCRIPTION } from 'src/constants/job.constant';
import { SIBService } from './sib.service';
import { EmailService } from './email.service';
import { WbWebsiteService } from './web-builder/wb-website.service';
import { WbDomainService } from './web-builder/wb-domain.service';
import { WbSubdomainExcludeService } from './web-builder/wb-subdomain-exclude.service';
import { ProductService } from './payment/product.service';
import { OrderService } from './payment/order.service';
import { LoggerService } from './logger.service';
import { InvoiceService } from './payment/invoice.service';

const services = [
  UserService,
  AuthService,
  SIBService,
  EmailService,
  LoggerService,

  // Payment
  ProductService,
  OrderService,
  InvoiceService,

  // Web Builder Service
  WbWebsiteService,
  WbDomainService,
  WbSubdomainExcludeService,
];

@Module({
  imports: [
    SchemaModule,
    JwtModule.registerAsync({ useClass: JwtConfig }),
    BullModule.forRootAsync({ useClass: BullConfig }),
    BullModule.registerQueue({ name: JOB_NAME_SUBSCRIPTION }),
  ],
  providers: [...services],
  exports: services,
})
export class ServicesModule {}

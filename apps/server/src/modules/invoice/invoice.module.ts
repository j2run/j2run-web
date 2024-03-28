import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { InvoiceController } from './invoice.controller';
import { InvoiceService } from './invoice.service';
import { UserModule } from '../user/user.module';
import { BullModule } from '@nestjs/bull';
import { BullConfig } from 'src/configs/bull.config';
import { QUEUE_INVOICE } from 'src/utils/constants/queue.constant';
import { InvoiceConsumer } from './invoice.processor';

@Module({
  imports: [
    ServicesModule,
    SchemaModule,
    UserModule,
    BullModule.forRootAsync({ useClass: BullConfig }),
    BullModule.registerQueue({ name: QUEUE_INVOICE }),
  ],
  controllers: [InvoiceController],
  providers: [InvoiceService, InvoiceConsumer],
  exports: [InvoiceService],
})
export class InvoiceModule {}

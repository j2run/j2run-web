import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { LoggerService } from 'src/service/logger.service';
import { InvoiceLogEntity } from 'src/schema/invoice-log.entity';
import { UserEntity } from 'src/schema/user.entity';
import { InvoiceLogGetByInvoiceId } from './invoice-log.dto';

@Injectable()
export class InvoiceLogService {
  constructor(
    @InjectRepository(InvoiceLogEntity)
    private readonly invoiceLogRepository: Repository<InvoiceLogEntity>,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(InvoiceLogService.name);
  }

  getByInvoiceId(params: InvoiceLogGetByInvoiceId, user: UserEntity) {
    throw new Error('Method not implemented.');
  }
}

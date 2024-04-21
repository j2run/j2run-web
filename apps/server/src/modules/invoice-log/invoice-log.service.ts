import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { LoggerService } from 'src/service/logger.service';
import {
  InvoiceLogEntity,
  InvoiceLogStatus,
} from 'src/schema/invoice-log.entity';
import { UserEntity } from 'src/schema/user.entity';
import { InvoiceLogGetByInvoiceId } from './invoice-log.dto';
import { InvoiceEntity } from 'src/schema/invoice.entity';
import { invoiceLogDefineAbilityFor } from './invoice-log.ability';
import { MSG_INVOICE_FORBIDDEN } from 'src/utils/constants/message.constant';

@Injectable()
export class InvoiceLogService {
  constructor(
    @InjectRepository(InvoiceLogEntity)
    private readonly invoiceLogRepository: Repository<InvoiceLogEntity>,
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(InvoiceLogService.name);
  }

  async getByInvoiceId(params: InvoiceLogGetByInvoiceId, userAuth: UserEntity) {
    const invoice = await this.invoiceRepository.findOneBy({
      id: params.invoiceId,
    });
    const ability = invoiceLogDefineAbilityFor(userAuth);
    if (!ability.can('read', invoice)) {
      throw new ForbiddenException(MSG_INVOICE_FORBIDDEN);
    }
    return this.invoiceLogRepository.find({
      where: {
        invoice: {
          id: params.invoiceId,
        } as unknown as InvoiceEntity,
      },
    });
  }

  addLog(
    status: InvoiceLogStatus,
    message: string,
    invoiceId: number,
    manager?: EntityManager,
  ) {
    const m = this.invoiceLogRepository.create();
    m.status = status;
    m.message = message;
    m.invoice = {
      id: invoiceId,
    } as InvoiceEntity;
    if (manager) {
      return manager.save(InvoiceLogEntity, m);
    }
    return this.invoiceLogRepository.save([m]);
  }
}

import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicePayRequest } from './invoice.dto';
import { InvoiceEntity, InvoiceStatus } from 'src/schema/invoice.entity';
import { OrderEntity } from 'src/schema/order.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { LoggerService } from 'src/service/logger.service';
import { UserService } from '../user/user.service';
import { JobInvoicePay } from 'src/dtos/job.dto';
import {
  MSG_ACCOUNT_NOT_SUFFICENT_FUNDS,
  MSG_INVOICE_ILEGAL,
  MSG_INVOICE_STATUS_NOT_OPEN,
  MSG_INVOICE_STATUS_NOT_WAIT,
} from 'src/utils/constants/message.constant';
import { QUEUE_INVOICE } from 'src/utils/constants/queue.constant';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectQueue(QUEUE_INVOICE)
    private readonly invoiceQueue: Queue<JobInvoicePay>,
    private readonly userService: UserService,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(InvoiceService.name);
  }

  async createInvoice(order: OrderEntity, manager: EntityManager) {
    const invoice = this.invoiceRepository.create();
    invoice.order = order;
    invoice.price = order.totalPrice;
    invoice.user = order.user;
    invoice.status = InvoiceStatus.open;
    return await manager.save(invoice);
  }

  async pay(data: InvoicePayRequest) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: data.invoiceId },
      relations: {
        user: true,
      },
      select: {
        user: {
          id: true,
          balance: true,
        },
      },
    });
    const user = invoice.user;
    if (!user) {
      throw new BadRequestException(MSG_INVOICE_ILEGAL);
    }
    if (invoice.status !== InvoiceStatus.open) {
      throw new BadRequestException(MSG_INVOICE_STATUS_NOT_OPEN);
    }
    if (user.balance < invoice.price) {
      throw new BadRequestException(MSG_ACCOUNT_NOT_SUFFICENT_FUNDS);
    }
    await this.invoiceRepository
      .createQueryBuilder()
      .update(InvoiceEntity)
      .set({
        status: InvoiceStatus.wait,
      })
      .where('id = :id')
      .setParameter('id', invoice.id)
      .execute();
    return await this.invoiceQueue.add({
      invoiceId: invoice.id,
    });
  }

  async payProcess(data: JobInvoicePay) {
    const invoice = await this.invoiceRepository.findOne({
      where: { id: data.invoiceId },
      relations: {
        order: {
          orderDetails: {
            orderDetailWebsite: true,
          },
        },
        user: true,
      },
      select: {
        user: {
          id: true,
          balance: true,
        },
      },
    });
    const user = invoice.user;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();
      const manager = queryRunner.manager;

      // check status
      if (invoice.status !== InvoiceStatus.wait) {
        throw new Error(MSG_INVOICE_STATUS_NOT_WAIT);
      }

      // check balance
      if (user.balance < invoice.price) {
        throw new Error(MSG_ACCOUNT_NOT_SUFFICENT_FUNDS);
      }

      // update balance
      await this.userService.minusBalance(invoice.price, user.id, manager);
      await manager
        .createQueryBuilder()
        .update(InvoiceEntity)
        .set({
          status: InvoiceStatus.paid,
        })
        .where({
          id: data.invoiceId,
        })
        .execute();

      // handle product

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }
}

import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoicePayRequest } from 'src/dtos/payment/invoice.dto';
import { InvoiceEntity, InvoiceStatus } from 'src/schema/invoice.entity';
import { OrderEntity } from 'src/schema/order.entity';
import { DataSource, EntityManager, Repository } from 'typeorm';
import { LoggerService } from '../logger.service';
import { UserService } from '../user.service';
import { JobInvoicePay } from 'src/dtos/job.dto';
import { MSG_ACCOUNT_NOT_SUFFICENT_FUNDS } from 'src/constants/message.constant';
import { Types } from 'mongoose';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
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
    invoice.userId = order.userId;
    return await manager.save(invoice);
  }

  async pay(payData: InvoicePayRequest) {
    return payData;
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
      },
    });
    const user = await this.userService.findById(invoice.userId);

    // check balance
    if (user.balance < invoice.price) {
      throw new Error(MSG_ACCOUNT_NOT_SUFFICENT_FUNDS);
    }

    // update balance
    await this.userService.minusBalance(
      invoice.price,
      user._id as unknown as Types.ObjectId,
    );
    await this.invoiceRepository
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
  }
}

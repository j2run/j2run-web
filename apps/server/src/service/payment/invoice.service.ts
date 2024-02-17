import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InvoiceEntity } from 'src/schema/payment/invoice.entity';
import { OrderEntity } from 'src/schema/payment/order.entity';
import { EntityManager, Repository } from 'typeorm';

@Injectable()
export class InvoiceService {
  constructor(
    @InjectRepository(InvoiceEntity)
    private readonly invoiceRepository: Repository<InvoiceEntity>,
  ) {}

  async createInvoice(order: OrderEntity, manager: EntityManager) {
    const invoice = this.invoiceRepository.create();
    invoice.order = order;
    invoice.price = order.totalPrice;
    return await manager.save(invoice);
  }
}

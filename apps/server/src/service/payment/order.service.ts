import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { OrderRequest, OrderRsponse } from 'src/dtos/payment/order.dto';
import { OrderEntity } from 'src/schema/order.entity';
import { DataSource, Repository } from 'typeorm';
import { LoggerService } from '../logger.service';
import { OrderDetailEntity } from 'src/schema/order-detail.entity';
import { InvoiceEntity } from 'src/schema/invoice.entity';
import { OrderDetailWebsiteEntity } from 'src/schema/order-detail-website.entity';
import { ProductEntity } from 'src/schema/product.entity';
import { ProductRetalOptionEntity } from 'src/schema/product-retal-option.entity';
import { InvoiceService } from './invoice.service';

@Injectable()
export class OrderService {
  constructor(
    @InjectRepository(OrderEntity)
    private readonly orderRepository: Repository<OrderEntity>,
    @InjectRepository(OrderDetailEntity)
    private readonly orderDetailRepository: Repository<OrderDetailEntity>,
    @InjectRepository(OrderDetailWebsiteEntity)
    private readonly orderDetailWebsiteEntity: Repository<OrderDetailWebsiteEntity>,
    @InjectRepository(ProductEntity)
    private readonly productEntity: Repository<ProductEntity>,
    @InjectRepository(ProductRetalOptionEntity)
    private readonly productRetalOptionEntity: Repository<ProductRetalOptionEntity>,
    private readonly invoiceSerivce: InvoiceService,
    private readonly dataSource: DataSource,
    private readonly logger: LoggerService,
  ) {
    this.logger.setContext(OrderService.name);
  }

  async order(orderData: OrderRequest): Promise<OrderRsponse> {
    let invoice: InvoiceEntity;
    let status = true;
    const queryRunner = this.dataSource.createQueryRunner();
    try {
      await queryRunner.connect();
      await queryRunner.startTransaction();

      // Create order
      const order = this.orderRepository.create();
      order.totalPrice = 0;
      await queryRunner.manager.save(order);

      // Save order details
      for (const item of orderData.items) {
        const product = await this.productEntity.findOne({
          where: {
            id: item.productId,
          },
        });
        if (!product) {
          throw new NotFoundException('Product not found');
        }

        const productRetalOption = await this.productRetalOptionEntity.findOne({
          where: {
            id: item.productId,
            product: {
              id: product.id,
            },
          },
        });
        if (!productRetalOption) {
          throw new NotFoundException('Product retal option not found');
        }

        const orderDetail = this.orderDetailRepository.create();
        orderDetail.price = productRetalOption.price;
        orderDetail.product = product;
        orderDetail.productRetalOption = productRetalOption;
        orderDetail.order = order;
        order.totalPrice += orderDetail.price;

        // Website detail
        // TODO: Validate wbDomainId
        const website = item.website;
        if (website) {
          const orderDetailWebsite = this.orderDetailWebsiteEntity.create();
          orderDetailWebsite.subdomain = website.subdomain;
          orderDetailWebsite.wbDomainId = website.wbDomainId;
          await queryRunner.manager.save(orderDetailWebsite);

          // Save orderDetailWebsite to orderDetail
          orderDetail.orderDetailWebsite = orderDetailWebsite;
        }

        await queryRunner.manager.save(orderDetail);
      }

      // Update total price
      await queryRunner.manager.save(order);

      // Create invoice
      invoice = await this.invoiceSerivce.createInvoice(
        order,
        queryRunner.manager,
      );

      await queryRunner.commitTransaction();
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error(err);
      status = false;
      // Response error
      if (err instanceof HttpException) {
        throw err;
      }
    } finally {
      await queryRunner.release();
    }

    return {
      status,
      invoice,
    };
  }
}

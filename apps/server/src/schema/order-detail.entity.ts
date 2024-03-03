import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderEntity } from './order.entity';
import { ProductRetalOptionEntity } from './product-retal-option.entity';
import { OrderDetailWebsiteEntity } from './order-detail-website.entity';

@Entity()
export class OrderDetailEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.orderDetails)
  @JoinColumn()
  order: OrderEntity;

  @ManyToOne(() => ProductEntity, (product) => product.orderDetails)
  @JoinColumn()
  product: ProductEntity;

  @ManyToOne(
    () => ProductRetalOptionEntity,
    (productRetailOption) => productRetailOption.orderDetails,
  )
  @JoinColumn()
  productRetalOption: ProductRetalOptionEntity;

  @OneToOne(() => OrderDetailWebsiteEntity, { nullable: true })
  @JoinColumn()
  orderDetailWebsite: OrderDetailWebsiteEntity;

  @ApiProperty()
  @Column()
  price: number;
}

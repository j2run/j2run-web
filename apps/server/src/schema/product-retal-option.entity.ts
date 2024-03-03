import { ApiProperty } from '@nestjs/swagger';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { ProductEntity } from './product.entity';
import { OrderDetailEntity } from './order-detail.entity';

@Entity()
export class ProductRetalOptionEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(
    () => OrderDetailEntity,
    (orderDetail) => orderDetail.productRetalOption,
  )
  orderDetails: OrderDetailEntity[];

  @ManyToOne(() => ProductEntity, (product) => product.productRetalOptions)
  @JoinColumn()
  product: ProductEntity;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column()
  usageTime: number;

  @ApiProperty()
  @CreateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
  })
  createdAt: Date;

  @ApiProperty()
  @UpdateDateColumn({
    type: 'timestamp',
    default: () => 'CURRENT_TIMESTAMP(6)',
    onUpdate: 'CURRENT_TIMESTAMP(6)',
  })
  updatedAt: Date;
}

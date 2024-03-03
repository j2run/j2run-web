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
  Index,
} from 'typeorm';
import { CategoryEntity } from './category.entity';
import { OrderDetailEntity } from './order-detail.entity';
import { InvoiceEntity } from './invoice.entity';

@Entity()
export class OrderEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Index()
  userId: string;

  @ApiProperty()
  @Column()
  totalPrice: number;

  @ManyToOne(() => CategoryEntity, (category) => category.products)
  @JoinColumn()
  category: CategoryEntity;

  @OneToMany(() => OrderDetailEntity, (orderDetail) => orderDetail.order)
  orderDetails: OrderDetailEntity[];

  @OneToMany(() => InvoiceEntity, (invoice) => invoice.order)
  invoices: InvoiceEntity[];

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

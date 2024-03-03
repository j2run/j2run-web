import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  Index,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';

export enum InvoiceStatus {
  draft = 1,
  open = 2,
  paid = 3,
  void = 4,
}

@Entity()
export class InvoiceEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty()
  @Column()
  @Index()
  userId: string;

  @ManyToOne(() => OrderEntity, (order) => order.invoices)
  order: OrderEntity;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column({ enum: InvoiceStatus, default: InvoiceStatus.open })
  status: InvoiceStatus;
}

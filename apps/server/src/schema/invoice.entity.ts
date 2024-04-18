import { ApiProperty } from '@nestjs/swagger';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { OrderEntity } from './order.entity';
import { UserEntity } from './user.entity';
import { InvoiceLogEntity } from './invoice-log.entity';

export enum InvoiceStatus {
  draft = 1,
  open = 2,
  wait = 3,
  paid = 4,
  void = 5,
}

@Entity()
export class InvoiceEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => OrderEntity, (order) => order.invoices)
  order: OrderEntity;

  @ApiProperty()
  @Column()
  price: number;

  @ApiProperty()
  @Column({ enum: InvoiceStatus, default: InvoiceStatus.open })
  status: InvoiceStatus;

  @ManyToOne(() => UserEntity, (user) => user.orders)
  @JoinColumn()
  user: UserEntity;

  @OneToMany(() => InvoiceLogEntity, (invoiceLog) => invoiceLog.invoice)
  @JoinColumn()
  invoiceLogs: InvoiceLogEntity[];
}

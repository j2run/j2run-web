import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { InvoiceEntity } from './invoice.entity';

export enum InvoiceLogStatus {
  error = 1,
  warning = 2,
  success = 3,
  info = 4,
}

@Entity()
export class InvoiceLogEntity {
  @ApiProperty()
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => InvoiceEntity, (order) => order.invoiceLogs)
  invoice: InvoiceEntity;

  @ApiProperty()
  @Column()
  message: string;

  @ApiProperty()
  @Column({ enum: InvoiceLogStatus })
  status: InvoiceLogStatus;
}

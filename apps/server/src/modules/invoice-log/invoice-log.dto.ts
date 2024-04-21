import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class InvoiceLogGetByInvoiceId {
  @ApiProperty()
  @IsInt()
  @Min(1)
  invoiceId: number;
}

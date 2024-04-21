import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt, Min } from 'class-validator';

export class InvoiceLogGetByInvoiceId {
  @ApiProperty()
  @Transform((value) => Number.parseInt(value.value))
  @IsInt()
  @Min(1)
  invoiceId: number;
}

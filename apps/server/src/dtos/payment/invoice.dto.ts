import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Min } from 'class-validator';

export class InvoicePayRequest {
  @ApiProperty()
  @IsInt()
  @Min(1)
  invoiceId: number;
}

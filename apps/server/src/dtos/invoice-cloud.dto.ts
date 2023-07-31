import { ApiProperty } from '@nestjs/swagger';
import { IsArray, IsIn, IsOptional } from 'class-validator';
import { InvoiceCloudStatus } from 'src/schema/invoice-cloud.schema';
import { IsObjectId } from 'src/validators/is-object-id.validate';

export class InvoiceCloudSearchRequest {
  @ApiProperty()
  @IsOptional()
  @IsArray()
  @IsIn(['created', 'waiting', 'creating', 'error'] as InvoiceCloudStatus[], {
    each: true,
  })
  status: InvoiceCloudStatus[];

  @ApiProperty()
  @IsOptional()
  notViewed: boolean;
}

export class InvoiceCloudViewedRequest {
  @ApiProperty()
  @IsObjectId()
  invoiceCloudId: string;
}

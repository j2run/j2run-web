import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { InvoiceEntity } from 'src/schema/invoice.entity';
import { IsObjectId } from 'src/utils/validators/is-object-id.validate';

export class WebsiteOrderItem {
  @ApiProperty()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  subdomain: string;

  @ApiProperty()
  @IsObjectId()
  wbDomainId: string;
}

export class OrderItem {
  @ApiProperty()
  @Min(1)
  @IsInt()
  productId: number;

  @ApiProperty()
  @Min(1)
  @IsInt()
  productRetalId: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  amount: number;

  @ApiProperty({ type: WebsiteOrderItem })
  @IsOptional()
  @ValidateNested()
  @Type(() => WebsiteOrderItem)
  website: WebsiteOrderItem;
}

export class OrderRequest {
  @ApiProperty({ isArray: true, type: OrderItem })
  @ArrayNotEmpty()
  @ValidateNested()
  @Type(() => OrderItem)
  items: OrderItem[];
}

export class OrderRsponse {
  @ApiProperty()
  status: boolean;

  @ApiProperty({ type: InvoiceEntity })
  invoice!: InvoiceEntity;
}

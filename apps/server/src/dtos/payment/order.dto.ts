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
import { IsObjectId } from 'src/validators/is-object-id.validate';

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
  @IsObjectId()
  productId: string;

  @ApiProperty()
  @IsObjectId()
  productRetalId: string;

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

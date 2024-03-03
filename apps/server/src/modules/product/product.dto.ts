import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsInt } from 'class-validator';

export class ProductSearchRequest {
  @ApiProperty()
  @Transform((value) => Number.parseInt(value.value))
  @IsInt()
  categoryId: number;
}

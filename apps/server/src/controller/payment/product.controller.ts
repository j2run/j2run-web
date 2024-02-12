import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ProductSearchRequest } from 'src/dtos/payment/product.dto';
import { ProductService } from 'src/service/payment/product.service';

@ApiTags('product')
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('search')
  search(@Query() dto: ProductSearchRequest) {
    return this.productService.search(dto);
  }
}

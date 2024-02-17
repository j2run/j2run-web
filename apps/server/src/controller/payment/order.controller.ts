import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderRequest } from 'src/dtos/payment/order.dto';
import { OrderService } from 'src/service/payment/order.service';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  order(@Body() body: OrderRequest) {
    return this.orderService.order(body);
  }
}

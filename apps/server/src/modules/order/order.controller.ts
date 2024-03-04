import { Body, Controller, Post, Req } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { OrderRequest } from './order.dto';
import { OrderService } from './order.service';
import { UserEntity } from 'src/schema/user.entity';

@ApiTags('order')
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  order(@Body() body: OrderRequest, @Req() request: express.Request) {
    const user = request.user as UserEntity;
    return this.orderService.order(body, user);
  }
}

import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { OrderRequest } from './order.dto';
import { OrderService } from './order.service';
import { UserEntity } from 'src/schema/user.entity';
import { AuthGuard } from '@nestjs/passport';

@ApiBearerAuth()
@ApiTags('order')
@UseGuards(AuthGuard('jwt-access'))
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  order(@Body() body: OrderRequest, @Req() request: express.Request) {
    const user = request.user as UserEntity;
    return this.orderService.order(body, user);
  }
}

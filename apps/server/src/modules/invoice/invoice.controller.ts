import { Body, Controller, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import * as express from 'express';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvoicePayRequest } from './invoice.dto';
import { InvoiceService } from './invoice.service';
import { UserEntity } from 'src/schema/user.entity';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt-access'))
@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('pay')
  pay(@Body() payData: InvoicePayRequest, @Req() request: express.Request) {
    const user = request.user as UserEntity;
    return this.invoiceService.pay(payData, user);
  }
}

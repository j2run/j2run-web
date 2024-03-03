import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { InvoicePayRequest } from './invoice.dto';
import { InvoiceService } from './invoice.service';

@ApiBearerAuth()
@UseGuards(AuthGuard('jwt-access'))
@ApiTags('invoice')
@Controller('invoice')
export class InvoiceController {
  constructor(private readonly invoiceService: InvoiceService) {}

  @Post('pay')
  pay(@Body() payData: InvoicePayRequest) {
    return this.invoiceService.pay(payData);
  }
}

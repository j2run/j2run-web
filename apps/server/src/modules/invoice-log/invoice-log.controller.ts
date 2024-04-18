import { Controller, Get, Param, Req, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { InvoiceLogService } from './invoice-log.service';
import { UserEntity } from 'src/schema/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { InvoiceLogGetByInvoiceId } from './invoice-log.dto';

@ApiBearerAuth()
@ApiTags('invoice-log')
@UseGuards(AuthGuard('jwt-access'))
@Controller('invoice-log')
export class InvoiceLogController {
  constructor(private readonly invoiceLogService: InvoiceLogService) {}

  @Get('get-by-invoice-id/:invoiceId')
  getByInvoiceId(
    @Param() params: InvoiceLogGetByInvoiceId,
    @Req() request: express.Request,
  ) {
    const user = request.user as UserEntity;
    return this.invoiceLogService.getByInvoiceId(params, user);
  }
}

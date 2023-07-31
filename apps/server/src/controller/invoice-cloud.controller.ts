import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import * as express from 'express';
import { InvoiceCloudSearchRequest, InvoiceCloudViewedRequest } from 'src/dtos/invoice-cloud.dto';
import { UserDocument } from 'src/schema/user.schema';
import { InvoiceCloudService } from 'src/service/invoice-cloud.service';

@ApiBearerAuth()
@ApiTags('invoice-cloud')
@UseGuards(AuthGuard('jwt-access'))
@Controller('invoice-cloud')
export class InvoiceCloudController {
  constructor(private readonly invoiceCloudService: InvoiceCloudService) {}

  @Post('search')
  list(
    @Req() request: express.Request,
    @Body() dto: InvoiceCloudSearchRequest,
  ) {
    const user = request.user as UserDocument;
    return this.invoiceCloudService.search(dto, user);
  }

  @Post('viewed')
  viewed(
    @Req() request: express.Request,
    @Body() dto: InvoiceCloudViewedRequest,
  ) {
    const user = request.user as UserDocument;
    return this.invoiceCloudService.viewed(dto, user);
  }
}

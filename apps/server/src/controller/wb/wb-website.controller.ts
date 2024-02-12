import { Body, Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewSubdomainValidRequest } from 'src/dtos/wb/wb-website.dto';
import { WbWebsiteService } from 'src/service/web-builder/wb-website.service';

@ApiTags('wb-website')
@Controller('wb-website')
export class WbWebsiteController {
  constructor(private readonly wbWebsiteService: WbWebsiteService) {}

  @Get('new-subdomain-valid')
  newSubdomainValid(@Query() dto: NewSubdomainValidRequest) {
    return this.wbWebsiteService.newSubdomainValid(dto);
  }
}

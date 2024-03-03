import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { NewSubdomainValidRequest } from './wb-website.dto';
import { WbWebsiteService } from './wb-website.service';

@ApiTags('wb-website')
@Controller('wb-website')
export class WbWebsiteController {
  constructor(private readonly wbWebsiteService: WbWebsiteService) {}

  @Get('new-subdomain-valid')
  newSubdomainValid(@Query() dto: NewSubdomainValidRequest) {
    return this.wbWebsiteService.newSubdomainValid(dto);
  }
}

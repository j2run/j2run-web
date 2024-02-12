import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { WbDomainService } from 'src/service/web-builder/wb-domain.service';

@ApiTags('wb-domain')
@Controller('wb-domain')
export class WbDomainController {
  constructor(private readonly wbDomainService: WbDomainService) {}

  @Get('/get-all')
  test() {
    return this.wbDomainService.getAll();
  }
}

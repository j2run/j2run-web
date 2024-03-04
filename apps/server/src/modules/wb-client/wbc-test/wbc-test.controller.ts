import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('wbc-test')
@Controller('wbc-test')
export class WbcTestController {
  @Get('a')
  newSubdomainValid() {
    return 'a';
  }
}

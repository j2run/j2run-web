import { Controller, Get } from '@nestjs/common';

@Controller('test')
export class TestController {
  constructor() {
    //
  }

  @Get('test')
  test() {
    return 1;
  }
}

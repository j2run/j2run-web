import { Module } from '@nestjs/common';
import { SchemaModule } from 'src/schema/schema.module';
import { ServicesModule } from 'src/service/services.module';
import { WbcTestController } from './wbc-test.controller';

@Module({
  imports: [ServicesModule, SchemaModule],
  controllers: [WbcTestController],
  providers: [],
  exports: [],
})
export class WbcTestModule {}

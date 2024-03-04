import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WbClientMiddleware } from 'src/utils/middlewares/wb-client.middleware';
import { ServicesModule } from 'src/service/services.module';
import { WbcTestModule } from './wbc-test/wbc-test.module';

export const WbClientPrefix = '/wbc-';

@Module({
  controllers: [],
  imports: [ServicesModule, WbcTestModule],
})
export class WbClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WbClientMiddleware)
      .forRoutes({ path: WbClientPrefix + '*', method: RequestMethod.ALL });
  }
}

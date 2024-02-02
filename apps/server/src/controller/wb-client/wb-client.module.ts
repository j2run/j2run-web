import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TestController } from './test.controller';
import { WbClientMiddleware } from 'src/middlewares/wb-client.middleware';
import { ServicesModule } from 'src/service/services.module';

export const WbClientPrefix = '/wb-client';

@Module({
  controllers: [TestController],
  imports: [ServicesModule],
})
export class WbClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WbClientMiddleware)
      .forRoutes({ path: WbClientPrefix + '/*', method: RequestMethod.ALL });
  }
}

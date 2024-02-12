import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { WbClientMiddleware } from 'src/middlewares/wb-client.middleware';
import { ServicesModule } from 'src/service/services.module';

export const WbClientPrefix = '/wb-client';

@Module({
  controllers: [],
  imports: [ServicesModule],
})
export class WbClientModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(WbClientMiddleware)
      .forRoutes({ path: WbClientPrefix + '/*', method: RequestMethod.ALL });
  }
}

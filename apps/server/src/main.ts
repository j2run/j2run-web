import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { cors } from './configs/cors.config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: cors,
  });
  await app.listen(3000);
}
bootstrap();

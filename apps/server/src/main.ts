import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { createBullBoard } from '@bull-board/api';
import { BullAdapter } from '@bull-board/api/bullAdapter';
import { Queue } from 'bull';
import * as expressBasicAuth from 'express-basic-auth';
import * as bcrypt from 'bcrypt';
import * as express from 'express';
import { ExpressAdapter } from '@bull-board/express';

import { AppModule } from './app.module';
import { cors } from './configs/cors.config';
import { ConfigService } from '@nestjs/config';
import { JOB_NAME_DOCKER, JOB_NAME_SUBSCRIPTION } from './constants/job.constant';

let timeSuperLoginError = new Date().getTime();

function factorySuperAuthorizer(configService: ConfigService) {
  return (username: string, password: string) => {
    const userMatches = expressBasicAuth.safeCompare(
      username,
      configService.get('J2_SUPER_USER'),
    );
    const passwordMatches = bcrypt.compareSync(
      password,
      configService.get('J2_SUPER_PWD'),
    );
    const isMatches = userMatches && passwordMatches;
    if (!isMatches) {
      timeSuperLoginError = new Date().getTime();
    } else {
      timeSuperLoginError = 0;
    }
    return isMatches;
  };
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const superAuthorizer = factorySuperAuthorizer(configService);
  app.enableCors({
    origin: cors,
  });

  app.use(
    '/mana',
    (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction,
    ) => {
      if (new Date().getTime() - timeSuperLoginError < 5000) {
        res.status(403).send();
      } else {
        next();
      }
    },
    expressBasicAuth({
      authorizer: superAuthorizer,
      challenge: true,
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('J2Run')
    .setDescription('The J2Run API description')
    .setVersion('1.0')
    .addBearerAuth()
    .addTag('auth')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/mana/documents', app, document, {
    swaggerOptions: {
      persistAuthorization: true,
    },
  });

  const bullAdapter = new ExpressAdapter();
  bullAdapter.setBasePath('/mana/bull');
  createBullBoard({
    queues: [
      new BullAdapter(app.get<Queue>('BullQueue_' + JOB_NAME_DOCKER)),
      new BullAdapter(app.get<Queue>('BullQueue_' + JOB_NAME_SUBSCRIPTION)),
    ],
    serverAdapter: bullAdapter,
  });
  app.use('/mana/bull', bullAdapter.getRouter());

  await app.listen(3000);
}
bootstrap();

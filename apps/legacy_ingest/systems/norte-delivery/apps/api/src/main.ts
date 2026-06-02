import 'reflect-metadata';
import { ValidationPipe, Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as express from 'express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));
  app.setGlobalPrefix('api/systems/norte-bar', {
    exclude: [
      'auth/(.*)',
      'status/(.*)',
      'users/(.*)',
      'api/systems/norte-gym/(.*)',
      'api/systems/norte-cloud/(.*)',
      'api/personal/norte-cloud/(.*)',
      'api/hub/cortex/(.*)',
      'api/personal/norte-clock/(.*)',
      'api/personal/norte-training/(.*)'
    ],
  });
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true }
    })
  );
  const port = parseInt(process.env.PORT ?? '3333', 10);
  await app.listen(port);
  Logger.log(`API running on port ${port}`, 'Bootstrap');
}
bootstrap();



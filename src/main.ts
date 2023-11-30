import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/config';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      //disableErrorMessages: true,
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
          enableImplicitConversion: true,
      },
    }),
  );
  app.use(cookieParser());
  app.enableCors({
    methods: 'GET,PATCH,POST,DELETE',
    credentials: true,
  });
  await app.listen(3001);
};

bootstrap()
  .then(() =>
    console.log(`[bootstrap] server is running on port: `, config.origin),
  )
  .catch((e) =>
    console.log('An error occurred while starting the application: ', e),
  );

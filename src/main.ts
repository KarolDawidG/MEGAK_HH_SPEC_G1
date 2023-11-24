import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { config } from './config/config';

const bootstrap = async (): Promise<void> => {
  const app = await NestFactory.create(AppModule);
  await app.listen(3001);
};

bootstrap()
  .then(() =>
    console.log(`[bootstrap] server is running on port: `, config.origin),
  )
  .catch((e) =>
    console.log('An error occurred while starting the application: ', e),
  );

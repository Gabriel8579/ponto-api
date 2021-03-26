import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as config from 'config';
import { Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const serverConfig = config.get('server');
  const port = process.env.PORT || serverConfig.port;

  const logger = new Logger('MainApplication');

  app.enableCors()

  await app.listen(port);
  logger.log(`Running in port ${port}`)
}
bootstrap();

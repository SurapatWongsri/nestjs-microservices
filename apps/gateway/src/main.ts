import { NestFactory } from '@nestjs/core';

import { Logger, ValidationPipe } from '@nestjs/common';
import { GatewayModule } from './gateway.module';

async function bootstrap() {
  process.title = 'gateway';

  const logger = new Logger('GatewayBootstrap');

  const app = await NestFactory.create(GatewayModule);

  app.enableShutdownHooks();
  app.useGlobalPipes(new ValidationPipe());

  const port = Number(process.env.GATEWAY_PORT) || 3010;

  await app.listen(port);

  logger.log(`Gateway is listening at port ${port}`);
}

bootstrap();

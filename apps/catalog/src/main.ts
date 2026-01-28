import * as dotenv from 'dotenv'

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { CatalogModule } from './catalog.module'
import { applyToMicroserviceLayer } from '@app/rpc'

dotenv.config()

async function bootstrap() {
  process.title = 'catalog'

  const logger = new Logger('CatalogBootstrap')

  const USER = process.env.RABBITMQ_USER
  const PASS = process.env.RABBITMQ_PASS
  const HOST = process.env.RABBITMQ_HOST
  const AMQP_PORT = process.env.RABBITMQ_PORT

  const RQM_URL = `amqp://${USER}:${PASS}@${HOST}:${AMQP_PORT}`

  const QUEUE = process.env.RABBITMQ_CATALOG_QUEUE ?? 'catalog_queue'
  //create an microservice instance
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    CatalogModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [RQM_URL],
        queue: QUEUE,
        queueOptions: {
          durable: false,
        },
      },
    },
  )

  applyToMicroserviceLayer(app)

  app.enableShutdownHooks()

  await app.listen()

  logger.log(
    `Catalog microservice (RabbitMQ) is starting on queue ${QUEUE} via ${RQM_URL}`,
  )
}
void bootstrap()

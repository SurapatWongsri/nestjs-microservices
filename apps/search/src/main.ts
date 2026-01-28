import * as dotenv from 'dotenv'

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { SearchModule } from './search.module'

dotenv.config()

async function bootstrap() {
  process.title = 'search'

  const logger = new Logger('SearchBootstrap')

  const USER = process.env.RABBITMQ_USER
  const PASS = process.env.RABBITMQ_PASS
  const HOST = process.env.RABBITMQ_HOST
  const AMQP_PORT = process.env.RABBITMQ_PORT

  const RQM_URL = `amqp://${USER}:${PASS}@${HOST}:${AMQP_PORT}`

  const QUEUE = process.env.RABBITMQ_SEARCH_QUEUE ?? 'search_queue'

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    SearchModule,
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

  app.enableShutdownHooks()
  await app.listen()

  logger.log(
    `Search microservice (RMQ) is listening on queue ${QUEUE} via ${RQM_URL}`,
  )
}
bootstrap()

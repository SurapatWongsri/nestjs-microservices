import * as dotenv from 'dotenv'

import { Logger } from '@nestjs/common'
import { NestFactory } from '@nestjs/core'
import { MicroserviceOptions, Transport } from '@nestjs/microservices'
import { MediaModule } from './media.module'
import { applyToMicroserviceLayer } from '@app/rpc'

dotenv.config()

async function bootstrap() {
  process.title = 'media'

  const logger = new Logger('MediaBootstrap')

  const USER = process.env.RABBITMQ_USER
  const PASS = process.env.RABBITMQ_PASS
  const HOST = process.env.RABBITMQ_HOST
  const AMQP_PORT = process.env.RABBITMQ_PORT

  const QUEUE = process.env.RABBITMQ_MEDIA_QUEUE ?? 'media_queue'
  const RQM_URL = `amqp://${USER}:${PASS}@${HOST}:${AMQP_PORT}`

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    MediaModule,
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
    `Media microservice (RMQ) is listening on queue ${QUEUE} via ${RQM_URL}`,
  )
}
void bootstrap()

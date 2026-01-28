import { Module } from '@nestjs/common'
import { GatewayController } from './gateway.controller'
import { GatewayService } from './gateway.service'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { ConfigModule } from '@nestjs/config'
import { MongooseModule } from '@nestjs/mongoose'
import { UsersModule } from './users/users.module'
import { AuthModule } from './auth/auth.module'
import { ProductsHttpController } from './products/products.controller'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRoot(process.env.MONGO_URI_USERS as string),
    UsersModule,

    AuthModule,
    ClientsModule.register([
      {
        name: 'CATALOG_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RMQ_URL ?? 'amqp://devkim:Kk19102002@localhost:5672',
          ],
          queue: process.env.RABBITMQ_CATALOG_QUEUE ?? 'catalog_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'MEDIA_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RMQ_URL ?? 'amqp://devkim:Kk19102002@localhost:5672',
          ],
          queue: process.env.RABBITMQ_MEDIA_QUEUE ?? 'media_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
      {
        name: 'SEARCH_CLIENT',
        transport: Transport.RMQ,
        options: {
          urls: [
            process.env.RMQ_URL ?? 'amqp://devkim:Kk19102002@localhost:5672',
          ],
          queue: process.env.RABBITMQ_SEARCH_QUEUE ?? 'search_queue',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
  ],
  controllers: [GatewayController, ProductsHttpController],
  providers: [GatewayService],
})
export class GatewayModule {}

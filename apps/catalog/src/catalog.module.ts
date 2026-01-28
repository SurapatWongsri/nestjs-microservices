import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { CatalogController } from './catalog.controller'
import { CatalogService } from './catalog.service'
import { ProductController } from './products/product.controller'
import { ProductsService } from './products/products.service'
import { MongooseModule } from '@nestjs/mongoose'
import { Product, ProductSchema } from './products/product.schema'

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGO_URI_CATALOG as string),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
  ],
  controllers: [CatalogController, ProductController],
  providers: [CatalogService, ProductsService],
})
export class CatalogModule {}

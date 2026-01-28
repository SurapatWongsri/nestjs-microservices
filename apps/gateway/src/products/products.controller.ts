import { Body, Controller, Get, Inject, Post } from '@nestjs/common'
import { ClientProxy } from '@nestjs/microservices'
import { CurrentUser } from '../auth/current-user.decorator'
import type { UserContext } from '../auth/auth.types'
import { mapRpcErrorToHttp } from '@app/rpc'
import { firstValueFrom } from 'rxjs'
import { AdminOnly } from '../auth/admin.decorator'
import { Public } from '../auth/public.decorator'

type Product = {
  _id: string
  name: string
  description: string
  price: number
  status: 'DRAFT' | 'ACTIVE' | 'INACTIVE'
  imageUrl: string | undefined
  createdAt: Date
  updatedAt: Date
  createdByClerkUserId: string | undefined
}

@Controller()
export class ProductsHttpController {
  constructor(
    @Inject('CATALOG_CLIENT') private readonly catalogClient: ClientProxy,
  ) {}

  @Post('products')
  @AdminOnly()
  async createProduct(
    @CurrentUser() user: UserContext,
    @Body()
    body: {
      name: string
      description: string
      price: number
      status?: string
      imageUrl?: string
    },
  ) {
    let product: Product

    const paylaod = {
      name: body.name,
      description: body.description,
      price: Number(body.price),
      status: body.status,
      imageUrl: body.imageUrl,
      createdByClerkUserId: user.clerkUserId,
    }

    //RMQ
    try {
      product = await firstValueFrom(
        this.catalogClient.send('product.create', paylaod),
      )
    } catch (error) {
      mapRpcErrorToHttp(error)
    }

    return product
  }

  @Get('products')
  @Public()
  async getProducts() {
    try {
      return await firstValueFrom<Product[]>(
        this.catalogClient.send('product.list', {}),
      )
    } catch (error) {
      mapRpcErrorToHttp(error)
    }
  }
}

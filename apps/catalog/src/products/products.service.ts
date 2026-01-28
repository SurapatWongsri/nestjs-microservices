import { Injectable } from '@nestjs/common'
import { isValidObjectId, Model } from 'mongoose'
import { Product, ProductDocument } from './product.schema'
import { InjectModel } from '@nestjs/mongoose'
import { rpcBadRequest, rpcNotFound } from '@app/rpc'

@Injectable()
export class ProductsService {
  constructor(
    @InjectModel(Product.name)
    private readonly productModel: Model<ProductDocument>,
  ) {}

  async createProduct(input: {
    name: string
    price: number
    description: string
    status?: string
    imageUrl?: string
    createdByClerkUserId?: string
  }): Promise<ProductDocument> {
    if (!input.name || !input.description)
      rpcBadRequest('Name and description are required')

    if (
      typeof input.price !== 'number' ||
      Number.isNaN(input.price) ||
      input.price < 0
    )
      rpcBadRequest('Price must be a valid number >= 0')

    if (
      input.status &&
      input.status !== 'DRAFT' &&
      input.status !== 'ACTIVE' &&
      input.status !== 'INACTIVE'
    )
      rpcBadRequest('Status must be DRAFT, ACTIVE or INACTIVE')

    const newlyCreatedProduct = await this.productModel.create({
      name: input.name,
      price: input.price,
      description: input.description,
      status: input.status ?? 'DRAFT',
      imageUrl: input.imageUrl ?? '',
      createdByClerkUserId: input.createdByClerkUserId,
    })

    return newlyCreatedProduct
  }

  async listProducts(): Promise<ProductDocument[]> {
    return this.productModel.find().sort({ createdAt: -1 }).exec()
  }

  async getProductById(input: { id: string }): Promise<ProductDocument> {
    if (!isValidObjectId(input.id)) rpcNotFound('Invalid product id')

    const product = await this.productModel.findById(input.id).exec()

    if (!product) rpcNotFound('Product is not present in DB')

    return product
  }
}

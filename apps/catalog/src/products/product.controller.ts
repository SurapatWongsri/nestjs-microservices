import { Controller } from '@nestjs/common'
import { ProductsService } from './products.service'
import { MessagePattern, Payload } from '@nestjs/microservices'
import { CreateProductDto, GetProductByIdDto } from './product.dto'

@Controller()
export class ProductController {
  constructor(private readonly productsService: ProductsService) {}

  @MessagePattern('product.create')
  create(@Payload() payload: CreateProductDto) {
    return this.productsService.createProduct(payload)
  }

  @MessagePattern('product.list')
  list() {
    return this.productsService.listProducts()
  }

  @MessagePattern('product.getById')
  getById(@Payload() payload: GetProductByIdDto) {
    return this.productsService.getProductById(payload)
  }
}

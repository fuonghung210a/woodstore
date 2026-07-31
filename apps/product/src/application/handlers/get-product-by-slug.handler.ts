import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import { GetProductBySlugQuery } from '../queries/get-product-by-slug.query';

@QueryHandler(GetProductBySlugQuery)
export class GetProductBySlugHandler
  implements IQueryHandler<GetProductBySlugQuery>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(query: GetProductBySlugQuery): Promise<ProductEntity> {
    const product = await this.productRepository.findBySlug(query.slug);

    if (!product) {
      throw new ProductNotFoundException(query.slug);
    }

    return product;
  }
}

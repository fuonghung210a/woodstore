import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { FindFeaturedProductsQuery } from '../queries/find-featured-products.query';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';

@QueryHandler(FindFeaturedProductsQuery)
export class FindFeaturedProductsHandler
  implements IQueryHandler<FindFeaturedProductsQuery>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(
    query: FindFeaturedProductsQuery,
  ): Promise<ProductEntity[]> {
    return this.productRepository.findFeatured(query.limit);
  }
}

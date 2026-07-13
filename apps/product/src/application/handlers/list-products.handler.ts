import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { ListProductsQuery } from '../queries/list-products.query';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { PaginatedResult } from '../../domain/types';
import { ProductEntity } from '../../domain/entities/product.entity';

@QueryHandler(ListProductsQuery)
export class ListProductsHandler
  implements IQueryHandler<ListProductsQuery>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(
    query: ListProductsQuery,
  ): Promise<PaginatedResult<ProductEntity>> {
    return this.productRepository.findAll(query.filter, query.pagination);
  }
}

import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { SearchProductsByWoodSpeciesQuery } from '../queries/search-products-by-wood-species.query';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';

@QueryHandler(SearchProductsByWoodSpeciesQuery)
export class SearchProductsByWoodSpeciesHandler
  implements IQueryHandler<SearchProductsByWoodSpeciesQuery>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(
    query: SearchProductsByWoodSpeciesQuery,
  ): Promise<ProductEntity[]> {
    return this.productRepository.findByWoodSpecies(query.woodSpecies);
  }
}

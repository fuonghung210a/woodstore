import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import {
  ICategoryRepository,
  ICategoryRepositoryType,
} from '../../domain/repositories/category-repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { GetHomepageDataQuery } from '../queries/get-homepage-data.query';

export interface HomepageData {
  categories: CategoryEntity[];
  featuredProducts: ProductEntity[];
  newestProducts: ProductEntity[];
}

@QueryHandler(GetHomepageDataQuery)
export class GetHomepageDataHandler
  implements IQueryHandler<GetHomepageDataQuery>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepositoryType,
  ) {}

  async execute(query: GetHomepageDataQuery): Promise<HomepageData> {
    const [categories, featuredProducts, newestProducts] = await Promise.all([
      this.categoryRepository.findActive(),
      this.productRepository.findFeatured(query.featuredLimit),
      this.productRepository.findNewest(query.newestLimit),
    ]);

    return { categories, featuredProducts, newestProducts };
  }
}

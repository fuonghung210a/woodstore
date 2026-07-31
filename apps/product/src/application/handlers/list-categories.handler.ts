import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  ICategoryRepositoryType,
} from '../../domain/repositories/category-repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { ListCategoriesQuery } from '../queries/list-categories.query';

@QueryHandler(ListCategoriesQuery)
export class ListCategoriesHandler
  implements IQueryHandler<ListCategoriesQuery>
{
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepositoryType,
  ) {}

  async execute(query: ListCategoriesQuery): Promise<CategoryEntity[]> {
    if (query.onlyActive) {
      return this.categoryRepository.findActive();
    }
    return this.categoryRepository.findAll();
  }
}

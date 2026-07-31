import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  ICategoryRepositoryType,
} from '../../domain/repositories/category-repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { FindCategoryChildrenQuery } from '../queries/find-category-children.query';

@QueryHandler(FindCategoryChildrenQuery)
export class FindCategoryChildrenHandler
  implements IQueryHandler<FindCategoryChildrenQuery>
{
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepositoryType,
  ) {}

  async execute(query: FindCategoryChildrenQuery): Promise<CategoryEntity[]> {
    return this.categoryRepository.findChildren(query.parentId);
  }
}

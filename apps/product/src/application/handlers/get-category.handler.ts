import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  ICategoryRepositoryType,
} from '../../domain/repositories/category-repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { GetCategoryQuery } from '../queries/get-category.query';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler
  implements IQueryHandler<GetCategoryQuery>
{
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepositoryType,
  ) {}

  async execute(query: GetCategoryQuery): Promise<CategoryEntity | null> {
    return this.categoryRepository.findById(query.id);
  }
}

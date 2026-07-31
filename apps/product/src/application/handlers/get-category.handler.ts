import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  ICategoryRepositoryType,
} from '../../domain/repositories/category-repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryNotFoundException } from '../../domain/exceptions/category-not-found.exception';
import { GetCategoryQuery } from '../queries/get-category.query';

@QueryHandler(GetCategoryQuery)
export class GetCategoryHandler implements IQueryHandler<GetCategoryQuery> {
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepositoryType,
  ) {}

  async execute(query: GetCategoryQuery): Promise<CategoryEntity> {
    const category = await this.categoryRepository.findById(query.id);

    if (!category) {
      throw new CategoryNotFoundException(query.id);
    }

    return category;
  }
}

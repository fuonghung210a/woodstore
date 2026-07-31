import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  ICategoryRepositoryType,
} from '../../domain/repositories/category-repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
import { CategoryNotFoundException } from '../../domain/exceptions/category-not-found.exception';
import { UpdateCategoryCommand } from '../commands/update-category.command';

@CommandHandler(UpdateCategoryCommand)
export class UpdateCategoryHandler
  implements ICommandHandler<UpdateCategoryCommand>
{
  constructor(
    @Inject(ICategoryRepository)
    private readonly categoryRepository: ICategoryRepositoryType,
  ) {}

  async execute(command: UpdateCategoryCommand): Promise<CategoryEntity> {
    const dto = command.data;

    const existing = await this.categoryRepository.findById(command.id);
    if (!existing) {
      throw new CategoryNotFoundException(command.id);
    }

    return this.categoryRepository.update(command.id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
    });
  }
}

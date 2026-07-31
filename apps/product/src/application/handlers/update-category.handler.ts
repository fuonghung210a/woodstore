import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  ICategoryRepository,
  ICategoryRepositoryType,
} from '../../domain/repositories/category-repository.interface';
import { CategoryEntity } from '../../domain/entities/category.entity';
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

    return this.categoryRepository.update(command.id, {
      name: dto.name,
      slug: dto.slug,
      description: dto.description,
      sortOrder: dto.sortOrder,
      isActive: dto.isActive,
    });
  }
}

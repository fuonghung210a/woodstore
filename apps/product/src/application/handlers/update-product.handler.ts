import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { Price } from '../../domain/value-objects/price.vo';
import { WoodSpecies } from '../../domain/types/wood-species';
import { UpdateProductCommand } from '../commands/update-product.command';

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler
  implements ICommandHandler<UpdateProductCommand>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductEntity> {
    const dto = command.data;

    return this.productRepository.update(command.id, {
      name: dto.name,
      slug: dto.slug,
      price: dto.price !== undefined ? new Price(dto.price) : undefined,
      woodSpecies: dto.woodSpecies as WoodSpecies | undefined,
      categoryId: dto.categoryId,
      weightKg: dto.weightKg,
      craftsmanship: dto.craftsmanship,
      artisan: dto.artisan,
      finishType: dto.finishType,
      sku: dto.sku,
      stockQuantity: dto.stockQuantity,
      isOneOfAKind: dto.isOneOfAKind,
      images: dto.images,
      tags: dto.tags,
      isFeatured: dto.isFeatured,
    });
  }
}

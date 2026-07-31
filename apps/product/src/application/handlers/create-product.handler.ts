import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../commands/create-product.command';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';
import { Price } from '../../domain/value-objects/price.vo';
import { WoodSpecies } from '../../domain/types/wood-species';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductEntity> {
    const dto = command.data;

    return this.productRepository.create({
      name: dto.name,
      slug: dto.slug,
      price: new Price(dto.price),
      woodSpecies: dto.woodSpecies as WoodSpecies,
      categoryId: dto.categoryId,
      weightKg: dto.weightKg,
      craftsmanship: dto.craftsmanship,
      artisan: dto.artisan,
      finishType: dto.finishType,
      sku: dto.sku,
      stockQuantity: dto.stockQuantity ?? 0,
      isOneOfAKind: dto.isOneOfAKind ?? false,
      images: dto.images ?? [],
      tags: dto.tags ?? [],
      isFeatured: dto.isFeatured ?? false,
    });
  }
}

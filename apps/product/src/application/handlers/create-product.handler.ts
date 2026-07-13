import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import { CreateProductCommand } from '../commands/create-product.command';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { ProductEntity } from '../../domain/entities/product.entity';

@CommandHandler(CreateProductCommand)
export class CreateProductHandler
  implements ICommandHandler<CreateProductCommand>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(command: CreateProductCommand): Promise<ProductEntity> {
    return this.productRepository.create(command.data);
  }
}

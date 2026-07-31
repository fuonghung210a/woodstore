import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Inject } from '@nestjs/common';
import {
  IProductRepository,
  IProductRepositoryType,
} from '../../domain/repositories/product-repository.interface';
import { ProductNotFoundException } from '../../domain/exceptions/product-not-found.exception';
import { SoftDeleteProductCommand } from '../commands/soft-delete-product.command';

@CommandHandler(SoftDeleteProductCommand)
export class SoftDeleteProductHandler
  implements ICommandHandler<SoftDeleteProductCommand>
{
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(command: SoftDeleteProductCommand): Promise<void> {
    const existing = await this.productRepository.findById(command.id);
    if (!existing) {
      throw new ProductNotFoundException(command.id);
    }

    await this.productRepository.softDelete(command.id);
  }
}

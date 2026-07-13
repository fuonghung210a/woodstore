import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import {
  IProductRepository,
  IProductRepositoryType,
} from "../../domain/repositories/product-repository.interface";
import { SoftDeleteProductCommand } from "../commands/soft-delete-product.command";

@CommandHandler(SoftDeleteProductCommand)
export class SoftDeleteProductHandler implements ICommandHandler<SoftDeleteProductCommand> {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(command: SoftDeleteProductCommand): Promise<void> {
    return this.productRepository.softDelete(command.id);
  }
}

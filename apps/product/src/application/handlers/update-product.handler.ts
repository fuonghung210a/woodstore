import { CommandHandler, ICommandHandler } from "@nestjs/cqrs";
import { Inject } from "@nestjs/common";
import {
  IProductRepository,
  IProductRepositoryType,
} from "../../domain/repositories/product-repository.interface";
import { ProductEntity } from "../../domain/entities/product.entity";
import { UpdateProductCommand } from "../commands/update-product.command";

@CommandHandler(UpdateProductCommand)
export class UpdateProductHandler implements ICommandHandler<UpdateProductCommand> {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(command: UpdateProductCommand): Promise<ProductEntity> {
    return this.productRepository.update(command.id, command.data);
  }
}

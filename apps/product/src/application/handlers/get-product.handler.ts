import { IQueryHandler, QueryHandler } from "@nestjs/cqrs";
import { GetProductQuery } from "../queries/get-product.query";
import { Inject } from "@nestjs/common";
import {
  IProductRepository,
  IProductRepositoryType,
} from "../../domain/repositories/product-repository.interface";
import { ProductEntity } from "../../domain/entities/product.entity";

@QueryHandler(GetProductQuery)
export class GetProductHandler implements IQueryHandler<GetProductQuery> {
  constructor(
    @Inject(IProductRepository)
    private readonly productRepository: IProductRepositoryType,
  ) {}

  async execute(query: GetProductQuery): Promise<ProductEntity | null> {
    return this.productRepository.findById(query.id);
  }
}

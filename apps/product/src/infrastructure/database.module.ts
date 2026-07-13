import { Module } from "@nestjs/common";
import { DatabaseModule } from "@woodshop/database";
import { PrismaProductRepository } from "./database/repositories/product.repository.impl";
import { PrismaCategoryRepository } from "./database/repositories/category.repository.impl";
import { IProductRepository } from "../domain/repositories/product-repository.interface";
import { ICategoryRepository } from "../domain/repositories/category-repository.interface";
import { CreateProductHandler } from "../application/handlers/create-product.handler";
import { CqrsModule } from "@nestjs/cqrs";
import { UpdateProductHandler } from "../application/handlers/update-product.handler";
import { SoftDeleteProductHandler } from "../application/handlers/soft-delete-product.handler";
import { GetProductHandler } from "../application/handlers/get-product.handler";
import { FindFeaturedProductsHandler } from "../application/handlers/find-featured-products.handler";
import { ListProductsHandler } from "../application/handlers/list-products.handler";
import { SearchProductsByWoodSpeciesHandler } from "../application/handlers/search-products-by-wood-species.handler";

@Module({
  imports: [
    CqrsModule.forRoot(),
    DatabaseModule.forRoot({
      url: process.env.DATABASE_URL!,
      logLevel: process.env.NODE_ENV === "development" ? "query" : "error",
    }),
  ],
  providers: [
    { provide: IProductRepository, useClass: PrismaProductRepository },
    { provide: ICategoryRepository, useClass: PrismaCategoryRepository },
    CreateProductHandler,
    UpdateProductHandler,
    SoftDeleteProductHandler,
    GetProductHandler,
    FindFeaturedProductsHandler,
    ListProductsHandler,
    SearchProductsByWoodSpeciesHandler,
  ],
  exports: [IProductRepository, ICategoryRepository],
})
export class ProductInfrastructureModule {}

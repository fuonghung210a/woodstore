import { Module } from "@nestjs/common";
import { DatabaseModule } from "@woodshop/database";
import { CqrsModule } from "@nestjs/cqrs";
import { PrismaProductRepository } from "./database/repositories/product.repository.impl";
import { PrismaCategoryRepository } from "./database/repositories/category.repository.impl";
import { IProductRepository } from "../domain/repositories/product-repository.interface";
import { ICategoryRepository } from "../domain/repositories/category-repository.interface";
import { CreateProductHandler } from "../application/handlers/create-product.handler";
import { UpdateProductHandler } from "../application/handlers/update-product.handler";
import { SoftDeleteProductHandler } from "../application/handlers/soft-delete-product.handler";
import { GetProductHandler } from "../application/handlers/get-product.handler";
import { FindFeaturedProductsHandler } from "../application/handlers/find-featured-products.handler";
import { ListProductsHandler } from "../application/handlers/list-products.handler";
import { SearchProductsByWoodSpeciesHandler } from "../application/handlers/search-products-by-wood-species.handler";
import { ProductController } from "../presentation/product.controller";
import { CreateCategoryHandler } from "../application/handlers/create-category.handler";
import { UpdateCategoryHandler } from "../application/handlers/update-category.handler";
import { GetCategoryHandler } from "../application/handlers/get-category.handler";
import { ListCategoriesHandler } from "../application/handlers/list-categories.handler";
import { FindCategoryChildrenHandler } from "../application/handlers/find-category-children.handler";
import { CategoryController } from "../presentation/category.controller";
import { APP_FILTER } from "@nestjs/core";
import { GlobalExceptionFilter } from "../presentation/filters/global-exception.filter";
import { GetHomepageDataHandler } from "../application/handlers/get-homepage-data.handler";

@Module({
  imports: [
    CqrsModule.forRoot(),
    DatabaseModule.forRoot({
      url: process.env.DATABASE_URL!,
      logLevel: process.env.NODE_ENV === "development" ? "query" : "error",
    }),
  ],
  controllers: [ProductController, CategoryController],
  providers: [
    { provide: APP_FILTER, useClass: GlobalExceptionFilter },
    { provide: IProductRepository, useClass: PrismaProductRepository },
    { provide: ICategoryRepository, useClass: PrismaCategoryRepository },
    CreateProductHandler,
    UpdateProductHandler,
    SoftDeleteProductHandler,
    GetProductHandler,
    FindFeaturedProductsHandler,
    ListProductsHandler,
    SearchProductsByWoodSpeciesHandler,
    CreateCategoryHandler,
    UpdateCategoryHandler,
    GetCategoryHandler,
    ListCategoriesHandler,
    FindCategoryChildrenHandler,
    GetHomepageDataHandler,
  ],
  exports: [IProductRepository, ICategoryRepository],
})
export class ProductInfrastructureModule {}

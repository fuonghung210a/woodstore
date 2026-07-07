import { Module } from '@nestjs/common';
import { DatabaseModule } from '@woodshop/database';
import { PrismaProductRepository } from './database/repositories/product.repository.impl';
import { PrismaCategoryRepository } from './database/repositories/category.repository.impl';
import { IProductRepository } from '../domain/repositories/product-repository.interface';
import { ICategoryRepository } from '../domain/repositories/category-repository.interface';

@Module({
  imports: [
    DatabaseModule.forRoot({
      url: process.env.DATABASE_URL!,
      logLevel: process.env.NODE_ENV === 'development' ? 'query' : 'error',
    }),
  ],
  providers: [
    { provide: IProductRepository, useClass: PrismaProductRepository },
    { provide: ICategoryRepository, useClass: PrismaCategoryRepository },
  ],
  exports: [IProductRepository, ICategoryRepository],
})
export class ProductInfrastructureModule {}

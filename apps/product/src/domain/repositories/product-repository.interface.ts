import { ProductEntity } from '../entities/product.entity';
import {
  CreateProductInput,
  UpdateProductInput,
  ProductFilter,
  PaginationParams,
  PaginatedResult,
} from '../types';
import { WoodSpecies } from '../types/wood-species';

export const IProductRepository = 'IProductRepository';

export interface IProductRepositoryType {
  findById(id: string): Promise<ProductEntity | null>;
  findBySlug(slug: string): Promise<ProductEntity | null>;
  findAll(
    filter: ProductFilter,
    pagination: PaginationParams,
  ): Promise<PaginatedResult<ProductEntity>>;
  findFeatured(limit: number): Promise<ProductEntity[]>;
  create(data: CreateProductInput): Promise<ProductEntity>;
  update(id: string, data: UpdateProductInput): Promise<ProductEntity>;
  softDelete(id: string): Promise<void>;
  findByCategory(
    categoryId: string,
    filter: ProductFilter,
  ): Promise<ProductEntity[]>;
  findByWoodSpecies(species: WoodSpecies): Promise<ProductEntity[]>;
}

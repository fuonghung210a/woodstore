import { Dimensions } from "./value-objects/dimensions.vo";
import { Price } from "./value-objects/price.vo";
import { WoodSpecies } from "./types/wood-species";

export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ProductFilter {
  search?: string;
  categoryId?: string;
  woodSpecies?: WoodSpecies;
  isActive?: boolean;
  isFeatured?: boolean;
  minPrice?: number;
  maxPrice?: number;
  minDimensions?: Dimensions;
  maxDimensions?: Dimensions;
}

export interface CreateProductInput {
  name: string;
  slug: string;
  price: Price;
  woodSpecies: WoodSpecies;
  categoryId?: string;
  dimensions?: Dimensions;
  weightKg?: number;
  craftsmanship?: string;
  artisan?: string;
  finishType?: string;
  sku?: string;
  stockQuantity?: number;
  isOneOfAKind?: boolean;
  images?: string[];
  tags?: string[];
  isFeatured?: boolean;
}

export interface UpdateProductInput {
  name?: string;
  slug?: string;
  price?: Price;
  woodSpecies?: WoodSpecies;
  categoryId?: string | null;
  dimensions?: Dimensions | null;
  weightKg?: number | null;
  craftsmanship?: string | null;
  artisan?: string | null;
  finishType?: string | null;
  sku?: string | null;
  stockQuantity?: number;
  isOneOfAKind?: boolean;
  images?: readonly string[];
  tags?: readonly string[];
  isFeatured?: boolean;
}

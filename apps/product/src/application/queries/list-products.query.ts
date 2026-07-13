import { ProductFilter, PaginationParams } from '../../domain/types';

export class ListProductsQuery {
  constructor(
    readonly filter: ProductFilter,
    readonly pagination: PaginationParams,
  ) {}
}

export interface CreateProductCommandInput {
  name: string;
  slug: string;
  price: number;
  woodSpecies: string;
  categoryId?: string;
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

export class CreateProductCommand {
  constructor(readonly data: CreateProductCommandInput) {}
}

import { Price } from '../value-objects/price.vo';
import { Dimensions } from '../value-objects/dimensions.vo';
import { WoodSpecies } from '../types/wood-species';

export interface ProductEntityProps {
  id: string;
  name: string;
  slug: string;
  price: Price;
  woodSpecies: WoodSpecies;
  dimensions: Dimensions | null;
  weightKg: number | null;
  craftsmanship: string | null;
  artisan: string | null;
  finishType: string | null;
  sku: string | null;
  stockQuantity: number;
  isOneOfAKind: boolean;
  images: readonly string[];
  tags: readonly string[];
  categoryId: string | null;
  isActive: boolean;
  isFeatured: boolean;
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date | null;
}

export class ProductEntity {
  readonly id: string;
  readonly name: string;
  readonly slug: string;
  readonly price: Price;
  readonly woodSpecies: WoodSpecies;
  readonly dimensions: Dimensions | null;
  readonly weightKg: number | null;
  readonly craftsmanship: string | null;
  readonly artisan: string | null;
  readonly finishType: string | null;
  readonly sku: string | null;
  readonly stockQuantity: number;
  readonly isOneOfAKind: boolean;
  readonly images: readonly string[];
  readonly tags: readonly string[];
  readonly categoryId: string | null;
  readonly isActive: boolean;
  readonly isFeatured: boolean;
  readonly createdAt: Date;
  readonly updatedAt: Date;
  readonly deletedAt: Date | null;

  constructor(props: ProductEntityProps) {
    this.id = props.id;
    this.name = props.name;
    this.slug = props.slug;
    this.price = props.price;
    this.woodSpecies = props.woodSpecies;
    this.dimensions = props.dimensions;
    this.weightKg = props.weightKg;
    this.craftsmanship = props.craftsmanship;
    this.artisan = props.artisan;
    this.finishType = props.finishType;
    this.sku = props.sku;
    this.stockQuantity = props.stockQuantity;
    this.isOneOfAKind = props.isOneOfAKind;
    this.images = Object.freeze([...props.images]);
    this.tags = Object.freeze([...props.tags]);
    this.categoryId = props.categoryId;
    this.isActive = props.isActive;
    this.isFeatured = props.isFeatured;
    this.createdAt = props.createdAt;
    this.updatedAt = props.updatedAt;
    this.deletedAt = props.deletedAt;
  }

  get isAvailable(): boolean {
    return (
      this.isActive &&
      this.deletedAt === null &&
      (this.isOneOfAKind || this.stockQuantity > 0)
    );
  }

  canFulfill(quantity: number): boolean {
    if (quantity <= 0) return false;
    if (!this.isAvailable) return false;
    if (this.isOneOfAKind) return quantity === 1;
    return this.stockQuantity >= quantity;
  }
}

import { ProductEntity } from './product.entity';
import { Price } from '../value-objects/price.vo';
import { Dimensions } from '../value-objects/dimensions.vo';
import { WoodSpecies } from '../types/wood-species';

function makeProduct(overrides: Partial<ConstructorParameters<typeof ProductEntity>[0]> = {}): ProductEntity {
  const defaults: ConstructorParameters<typeof ProductEntity>[0] = {
    id: 'test-id',
    name: 'Test Product',
    slug: 'test-product',
    price: new Price(100000),
    woodSpecies: WoodSpecies.HUONG,
    dimensions: null,
    weightKg: null,
    craftsmanship: null,
    artisan: null,
    finishType: null,
    sku: null,
    stockQuantity: 5,
    isOneOfAKind: false,
    images: [],
    tags: [],
    categoryId: null,
    isActive: true,
    isFeatured: false,
    createdAt: new Date(),
    updatedAt: new Date(),
    deletedAt: null,
  };
  return new ProductEntity({ ...defaults, ...overrides });
}

describe('ProductEntity', () => {
  describe('isAvailable', () => {
    it('should be available when active, not deleted, and in stock', () => {
      const p = makeProduct({ isActive: true, deletedAt: null, stockQuantity: 5 });
      expect(p.isAvailable).toBe(true);
    });

    it('should not be available when inactive', () => {
      const p = makeProduct({ isActive: false });
      expect(p.isAvailable).toBe(false);
    });

    it('should not be available when soft deleted', () => {
      const p = makeProduct({ deletedAt: new Date() });
      expect(p.isAvailable).toBe(false);
    });

    it('should not be available when out of stock (non-unique)', () => {
      const p = makeProduct({ stockQuantity: 0, isOneOfAKind: false });
      expect(p.isAvailable).toBe(false);
    });

    it('should be available when one-of-a-kind even with zero stock', () => {
      const p = makeProduct({ stockQuantity: 0, isOneOfAKind: true });
      expect(p.isAvailable).toBe(true);
    });
  });

  describe('canFulfill', () => {
    it('should fulfill quantity when available and in stock', () => {
      const p = makeProduct({ stockQuantity: 5 });
      expect(p.canFulfill(3)).toBe(true);
    });

    it('should not fulfill when quantity exceeds stock', () => {
      const p = makeProduct({ stockQuantity: 2 });
      expect(p.canFulfill(5)).toBe(false);
    });

    it('should fulfill exactly 1 for one-of-a-kind', () => {
      const p = makeProduct({ isOneOfAKind: true });
      expect(p.canFulfill(1)).toBe(true);
    });

    it('should not fulfill more than 1 for one-of-a-kind', () => {
      const p = makeProduct({ isOneOfAKind: true });
      expect(p.canFulfill(2)).toBe(false);
    });

    it('should not fulfill when not available', () => {
      const p = makeProduct({ isActive: false });
      expect(p.canFulfill(1)).toBe(false);
    });

    it('should not fulfill zero quantity', () => {
      const p = makeProduct({ stockQuantity: 5 });
      expect(p.canFulfill(0)).toBe(false);
    });

    it('should not fulfill negative quantity', () => {
      const p = makeProduct({ stockQuantity: 5 });
      expect(p.canFulfill(-1)).toBe(false);
    });

    it('should fulfill exact stock quantity', () => {
      const p = makeProduct({ stockQuantity: 5 });
      expect(p.canFulfill(5)).toBe(true);
    });
  });

  describe('immutability', () => {
    it('should freeze images array to prevent mutation', () => {
      const p = makeProduct({ images: ['img1.jpg'] });
      expect(() => (p.images as string[]).push('img2.jpg')).toThrow();
    });

    it('should freeze tags array to prevent mutation', () => {
      const p = makeProduct({ tags: ['tag1'] });
      expect(() => (p.tags as string[]).push('tag2')).toThrow();
    });

    it('should not share array references with input', () => {
      const input = ['img1.jpg'];
      const p = makeProduct({ images: input });
      input.push('img2.jpg');
      expect(p.images).toEqual(['img1.jpg']);
    });
  });
});

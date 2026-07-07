import { Price } from './price.vo';

describe('Price', () => {
  it('should create valid price with default VND', () => {
    const p = new Price(100000);
    expect(p.amount).toBe(100000);
    expect(p.currency).toBe('VND');
  });

  it('should create valid price with custom currency', () => {
    const p = new Price(50, 'USD');
    expect(p.amount).toBe(50);
    expect(p.currency).toBe('USD');
  });

  it('should throw for negative price', () => {
    expect(() => new Price(-1)).toThrow('Price cannot be negative');
  });

  it('should allow zero price', () => {
    const p = new Price(0);
    expect(p.amount).toBe(0);
  });

  it('should equal another price with same amount and currency', () => {
    const a = new Price(100, 'VND');
    const b = new Price(100, 'VND');
    expect(a.equals(b)).toBe(true);
  });

  it('should not equal another price with different amount', () => {
    const a = new Price(100, 'VND');
    const b = new Price(200, 'VND');
    expect(a.equals(b)).toBe(false);
  });

  it('should not equal another price with different currency', () => {
    const a = new Price(100, 'VND');
    const b = new Price(100, 'USD');
    expect(a.equals(b)).toBe(false);
  });

  it('should throw for empty currency', () => {
    expect(() => new Price(100, '')).toThrow(
      'Currency must be a non-empty string',
    );
  });
});

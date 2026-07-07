import { Dimensions } from './dimensions.vo';

describe('Dimensions', () => {
  it('should create valid dimensions', () => {
    const d = new Dimensions(30, 20, 15);
    expect(d.lengthCm).toBe(30);
    expect(d.widthCm).toBe(20);
    expect(d.heightCm).toBe(15);
  });

  it('should calculate volume correctly', () => {
    const d = new Dimensions(10, 5, 2);
    expect(d.volumeCm3).toBe(100);
  });

  it('should throw for negative length', () => {
    expect(() => new Dimensions(-1, 10, 10)).toThrow(
      'Dimensions must be non-negative',
    );
  });

  it('should throw for negative width', () => {
    expect(() => new Dimensions(10, -1, 10)).toThrow(
      'Dimensions must be non-negative',
    );
  });

  it('should throw for negative height', () => {
    expect(() => new Dimensions(10, 10, -1)).toThrow(
      'Dimensions must be non-negative',
    );
  });

  it('should allow zero dimensions', () => {
    const d = new Dimensions(0, 0, 0);
    expect(d.volumeCm3).toBe(0);
  });

  it('should equal another dimensions with same values', () => {
    const a = new Dimensions(10, 20, 30);
    const b = new Dimensions(10, 20, 30);
    expect(a.equals(b)).toBe(true);
  });

  it('should not equal another dimensions with different values', () => {
    const a = new Dimensions(10, 20, 30);
    const b = new Dimensions(10, 20, 31);
    expect(a.equals(b)).toBe(false);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateDiscount, finalAmountAfterDiscount } from '../src/utils/promo';

describe('calculateDiscount', () => {
  it('computes a percentage discount', () => {
    expect(calculateDiscount('percentage', 10, 20000)).toBe(2000);
  });

  it('returns a fixed discount as-is', () => {
    expect(calculateDiscount('fixed', 3000, 20000)).toBe(3000);
  });
});

describe('finalAmountAfterDiscount', () => {
  it('subtracts the discount from the order amount', () => {
    expect(finalAmountAfterDiscount(20000, 2000)).toBe(18000);
  });

  it('never returns a negative amount', () => {
    expect(finalAmountAfterDiscount(1000, 5000)).toBe(0);
  });
});

import { describe, it, expect } from 'vitest';
import { calculateQuotePrice } from '../src/utils/pricing';

describe('calculateQuotePrice', () => {
  it('returns the base price when no modifiers apply', () => {
    const service = { basePrice: 15000, category: 'specialty', priceUnit: 'flat' };
    expect(calculateQuotePrice(service)).toBe(15000);
  });

  it('adds a per-room charge for home cleaning beyond the first room', () => {
    const service = { basePrice: 15000, category: 'home', priceUnit: 'per_room' };
    // 1 room -> base only
    expect(calculateQuotePrice(service, 1)).toBe(15000);
    // 3 rooms -> base + 2 extra rooms * 5000
    expect(calculateQuotePrice(service, 3)).toBe(25000);
  });

  it('does not apply room charges to non-home categories', () => {
    const service = { basePrice: 50000, category: 'office', priceUnit: 'flat' };
    expect(calculateQuotePrice(service, 5)).toBe(50000);
  });

  it('multiplies by area for per_sqm office cleaning', () => {
    const service = { basePrice: 200, category: 'office', priceUnit: 'per_sqm' };
    expect(calculateQuotePrice(service, undefined, 100)).toBe(20000);
  });

  it('coerces a Prisma Decimal-like basePrice', () => {
    const service = { basePrice: { toString: () => '12000' }, category: 'home', priceUnit: 'per_room' };
    expect(calculateQuotePrice(service, 2)).toBe(17000);
  });
});

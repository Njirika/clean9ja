/**
 * Pure booking-quote pricing logic, extracted from BookingService so it can be
 * unit-tested without a database. `basePrice` accepts a number or a Prisma
 * Decimal (anything `Number()` can coerce).
 */
export interface QuotableService {
  basePrice: number | string | { toString(): string };
  category: string;
  priceUnit: string;
}

const EXTRA_ROOM_PRICE = 5000;

export function calculateQuotePrice(
  service: QuotableService,
  numberOfRooms?: number,
  propertySizeSqm?: number
): number {
  let finalPrice = Number(service.basePrice);

  // Home cleaning: each room beyond the first adds a flat per-room charge.
  if (service.category === 'home' && numberOfRooms && numberOfRooms > 1) {
    finalPrice += (numberOfRooms - 1) * EXTRA_ROOM_PRICE;
  }

  // Office cleaning priced per square metre.
  if (service.category === 'office' && propertySizeSqm && service.priceUnit === 'per_sqm') {
    finalPrice = Number(service.basePrice) * propertySizeSqm;
  }

  return finalPrice;
}

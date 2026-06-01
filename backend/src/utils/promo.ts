/**
 * Pure promo-code discount math, extracted from PromoService for unit testing.
 */
export function calculateDiscount(
  discountType: string,
  discountValue: number,
  orderAmount: number
): number {
  if (discountType === 'percentage') {
    return (orderAmount * discountValue) / 100;
  }
  return discountValue;
}

export function finalAmountAfterDiscount(orderAmount: number, discount: number): number {
  return Math.max(0, orderAmount - discount);
}

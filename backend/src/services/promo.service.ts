import { prisma } from '../config/prisma';
import { ApiError } from '../utils/ApiError';
import { calculateDiscount, finalAmountAfterDiscount } from '../utils/promo';

export class PromoService {
  async validatePromo(code: string, orderAmount: number) {
    const promo = await prisma.promoCode.findUnique({ where: { code } });

    if (!promo || !promo.isActive) throw new ApiError(400, 'Invalid or inactive promo code');
    if (new Date() < promo.validFrom || new Date() > promo.validUntil) {
      throw new ApiError(400, 'Promo code is expired or not yet valid');
    }
    if (promo.currentUses >= promo.maxUses) throw new ApiError(400, 'Promo code usage limit reached');
    if (orderAmount < Number(promo.minOrderAmount)) {
      throw new ApiError(400, `Minimum order amount of ${promo.minOrderAmount} required`);
    }

    const discount = calculateDiscount(promo.discountType, Number(promo.discountValue), orderAmount);

    return {
      promoCodeId: promo.id,
      code: promo.code,
      discountType: promo.discountType,
      discountValue: promo.discountValue,
      calculatedDiscount: discount,
      finalAmount: finalAmountAfterDiscount(orderAmount, discount),
    };
  }
}

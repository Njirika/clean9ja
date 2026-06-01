import { Request, Response, NextFunction } from 'express';
import { PromoService } from '../services/promo.service';
import { ApiResponse } from '../utils/ApiResponse';

const promoService = new PromoService();

export const validatePromoCode = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { code, orderAmount } = req.body;
    const result = await promoService.validatePromo(code, orderAmount);
    res.status(200).json(ApiResponse.success('Promo code applied successfully', result));
  } catch (error) {
    next(error);
  }
};

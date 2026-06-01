import { Router } from 'express';
import { validatePromoCode } from '../controllers/promo.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.post('/validate', requireAuth, validatePromoCode);

export default router;

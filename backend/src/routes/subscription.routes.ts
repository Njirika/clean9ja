import { Router } from 'express';
import {
  getUserSubscriptions,
  createSubscription,
  updateSubscriptionStatus,
} from '../controllers/subscription.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.use(requireAuth);

router.get('/', getUserSubscriptions);
router.post('/', createSubscription);
router.patch('/:id/status', updateSubscriptionStatus);

export default router;

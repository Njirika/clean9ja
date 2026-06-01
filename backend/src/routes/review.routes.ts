import { Router } from 'express';
import { createReview, getCleanerReviews, getPublicReviews } from '../controllers/review.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { cache } from '../middlewares/cache.middleware';

const router = Router();

router.get('/', cache(600), getPublicReviews);
router.get('/cleaner/:cleanerId', getCleanerReviews);
router.post('/', requireAuth, createReview);

export default router;

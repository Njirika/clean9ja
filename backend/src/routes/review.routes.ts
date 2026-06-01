import { Router } from 'express';
import { createReview, getCleanerReviews } from '../controllers/review.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

router.get('/cleaner/:cleanerId', getCleanerReviews);
router.post('/', requireAuth, createReview);

export default router;

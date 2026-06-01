import { Router } from 'express';
import { getDashboardStats } from '../controllers/admin.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';

const router = Router();

// Only admin can access these routes
router.use(requireAuth, requireRole('admin'));

router.get('/stats', getDashboardStats);

export default router;

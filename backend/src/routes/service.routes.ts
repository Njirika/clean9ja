import { Router } from 'express';
import {
  getAllServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  toggleServiceStatus,
} from '../controllers/service.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { cache } from '../middlewares/cache.middleware';

const router = Router();

// Public routes
router.get('/', cache(3600), getAllServices); // Cache for 1 hour. Admin can pass ?includeInactive=true to bypass
router.get('/:slug', cache(3600), getServiceBySlug);

// Admin-only routes
router.post('/', requireAuth, requireRole('admin'), createService);
router.put('/:id', requireAuth, requireRole('admin'), updateService);
router.delete('/:id', requireAuth, requireRole('admin'), deleteService);
router.patch('/:id/status', requireAuth, requireRole('admin'), toggleServiceStatus);

export default router;

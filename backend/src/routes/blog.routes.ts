import { Router } from 'express';
import {
  getAllPosts,
  getPostBySlug,
  createPost,
  updatePost,
  deletePost,
} from '../controllers/blog.controller';
import { requireAuth, requireRole } from '../middlewares/auth.middleware';
import { cache } from '../middlewares/cache.middleware';

const router = Router();

// Public routes
router.get('/', cache(3600), getAllPosts);
router.get('/:slug', cache(3600), getPostBySlug);

// Admin-only routes
router.post('/', requireAuth, requireRole('admin'), createPost);
router.put('/:id', requireAuth, requireRole('admin'), updatePost);
router.delete('/:id', requireAuth, requireRole('admin'), deletePost);

export default router;

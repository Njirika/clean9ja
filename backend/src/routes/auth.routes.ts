import { Router } from 'express';
import { register, login, getMe, updateMe, logout } from '../controllers/auth.controller';
import { requireAuth } from '../middlewares/auth.middleware';
import { authLimiter } from '../middlewares/rateLimiter.middleware';

const router = Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/logout', logout);

router.get('/me', requireAuth, getMe);
router.patch('/me', requireAuth, updateMe);

export default router;

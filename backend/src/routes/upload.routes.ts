import { Router } from 'express';
import { uploadImage } from '../controllers/upload.controller';
import { upload } from '../middlewares/upload.middleware';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Single image upload route
router.post('/image', requireAuth, upload.single('file'), uploadImage);

export default router;

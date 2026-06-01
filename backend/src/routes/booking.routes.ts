import { Router } from 'express';
import {
  getQuote,
  createBooking,
  getBookings,
  getBookingById,
} from '../controllers/booking.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// Public/Open quote generation (if a user is exploring pricing before logging in)
router.post('/quote', getQuote);

// Protected routes
router.use(requireAuth);

router.post('/', createBooking);
router.get('/', getBookings);
router.get('/:id', getBookingById);

export default router;

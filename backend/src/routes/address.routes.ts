import { Router } from 'express';
import {
  getUserAddresses,
  getAddressById,
  createAddress,
  updateAddress,
  deleteAddress,
} from '../controllers/address.controller';
import { requireAuth } from '../middlewares/auth.middleware';

const router = Router();

// All address routes require authentication
router.use(requireAuth);

router.get('/', getUserAddresses);
router.post('/', createAddress);
router.get('/:id', getAddressById);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);

export default router;

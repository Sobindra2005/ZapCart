import express from 'express';
import {
    createAddress,
    getAllAddresses,
    getAddress,
    updateAddress,
    deleteAddress,
} from '@/controllers/address.controller';
import { protect } from '@/middlewares/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router
    .route('/')
    .get(getAllAddresses)
    .post(createAddress);

router
    .route('/:id')
    .get(getAddress)
    .put(updateAddress)
    .delete(deleteAddress);

export default router;

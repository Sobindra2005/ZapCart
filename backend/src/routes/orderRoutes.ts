import express from 'express';
import {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrder,
} from '@/controllers/order.controller';
import { protect } from '@/middlewares/authMiddleware';

const router = express.Router();

// Protect all routes
router.use(protect);

router
    .route('/')
    .get(getMyOrders)
    .post(createOrder);

router
    .route('/:id')
    .get(getOrderById)
    .patch(updateOrder);

export default router;

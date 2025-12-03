import express from 'express';
import {
    getInventory,
    updateInventory,
} from '@/controllers/inventory.controller';
import { protect, restrictTo } from '@/middlewares/authMiddleware';
import { UserRole } from '@/generated/prisma';

const router = express.Router();

router.get('/:productId', getInventory);

// Protect subsequent routes
router.use(protect);
router.use(restrictTo(UserRole.ADMIN, UserRole.SUPERADMIN));

router.put('/:productId', updateInventory);

export default router;

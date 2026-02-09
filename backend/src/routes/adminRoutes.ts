import express from 'express';
import { getUsersList } from '@/controllers/admin.controller';
import { protect, restrictTo } from '@/middlewares/authMiddleware';

const router = express.Router();

/**
 * All admin routes require authentication and admin/superadmin role
 */
router.use(protect, restrictTo('ADMIN', 'SUPERADMIN'));

/**
 * @route   GET /api/admin/users
 * @desc    Get list of all users with pagination and sorting
 * @access  Private/Admin
 * @query   start - Starting index (default: 0)
 * @query   limit - Number of records to fetch (default: 10, max: 100)
 * @query   sortBy - Sort order: 'newest' or 'name' (default: 'newest')
 */
router.get('/users', getUsersList);

export default router;

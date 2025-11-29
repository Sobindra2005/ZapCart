import express from 'express';
import { protect, restrictTo } from '@/middlewares/authMiddleware';

const router = express.Router();

/**
 * Test protected route
 * This demonstrates how to use the protect middleware
 * @route GET /api/v1/test/protected
 * @access Private (requires valid access token)
 */
router.get('/protected', protect, (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You have successfully accessed a protected route!',
        user: req.user,
    });
});

/**
 * Test admin-only route
 * This demonstrates how to use role-based access control
 * @route GET /api/v1/test/admin
 * @access Private (requires valid access token + ADMIN or SUPERADMIN role)
 */
router.get('/admin', protect, restrictTo('ADMIN', 'SUPERADMIN'), (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'You have successfully accessed an admin-only route!',
        user: req.user,
    });
});

export default router;

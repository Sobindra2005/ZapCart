import { Router } from 'express';
import {
    getProductReviews,
    getRatingDistribution,
    getReviewById,
    createReview,
    getUserReviews,
    updateReview,
    deleteReview,
    markReviewHelpful,
    markReviewNotHelpful,
    addReplyToReview,
    approveReview,
    rejectReview,
} from '@/controllers/productReview.controller';
import { protect, restrictTo } from '@/middlewares/authMiddleware';

const router = Router();

// Public routes (no authentication required)
router.get('/product/:productId', getProductReviews);
router.get('/product/:productId/stats', getRatingDistribution);
router.get('/:id', getReviewById);

// Protected routes (authentication required)
router.use(protect);

// Authenticated user routes
router.post('/', createReview);
router.get('/user/me', getUserReviews);
router.put('/:id', updateReview);
router.delete('/:id', deleteReview);
router.post('/:id/helpful', markReviewHelpful);
router.post('/:id/not-helpful', markReviewNotHelpful);
router.post('/:id/reply', addReplyToReview);

// Admin/Moderator routes
router.use(restrictTo('admin', 'moderator'));

router.patch('/:id/approve', approveReview);
router.patch('/:id/reject', rejectReview);

export default router;

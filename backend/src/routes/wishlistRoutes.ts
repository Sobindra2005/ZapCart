import express from 'express';
import {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    checkWishlistItem,
    getWishlistCount,
    toggleWishlistItem,
} from '@/controllers/wishlist.controller';
import { protect } from '@/middlewares/authMiddleware';

const router = express.Router();

// Protect all routes - user must be authenticated
router.use(protect);

// Get wishlist count
router.get('/count', getWishlistCount);

// Check if specific product is in wishlist
router.get('/check/:productId', checkWishlistItem);

// Toggle product in wishlist (add/remove)
router.post('/toggle', toggleWishlistItem);

// Main wishlist routes
router
    .route('/')
    .get(getUserWishlist)     // Get all wishlist items
    .post(addToWishlist)      // Add product to wishlist
    .delete(clearWishlist);   // Clear entire wishlist

// Remove specific product from wishlist
router.delete('/:productId', removeFromWishlist);

export default router;

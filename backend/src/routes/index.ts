import express from 'express';
import authRoutes from './authRoutes';
import addressRoutes from './addressRoutes';
import orderRoutes from './orderRoutes';
import settingRoutes from './settingRoutes';
import inventoryRoutes from './inventoryRoutes';
import categoryRoutes from './categoryRoutes';
import productRoutes from './productRoutes';
import searchRoutes from './searchRoutes';
import testRoutes from './testRoutes';
import productReviewRoutes from './productReviewRoutes';

const router = express.Router();

/**
 * Central route configuration
 * Mount all route modules here
 */

// Authentication routes
router.use('/auth', authRoutes);

// Address routes
router.use('/addresses', addressRoutes);

// Order routes
router.use('/orders', orderRoutes);

// Settings routes
router.use('/settings', settingRoutes);

// Inventory routes
router.use('/inventory', inventoryRoutes);

// Category routes
router.use('/categories', categoryRoutes);

// Product routes
router.use('/products', productRoutes);

// Search routes
router.use('/search', searchRoutes);

// Product review routes
router.use('/reviews', productReviewRoutes);

// Test routes (for verifying auth functionality)
router.use('/test', testRoutes);

export default router;

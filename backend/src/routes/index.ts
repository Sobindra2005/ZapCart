import express from 'express';
import authRoutes from './authRoutes';
import addressRoutes from './addressRoutes';
import orderRoutes from './orderRoutes';
import settingRoutes from './settingRoutes';
import inventoryRoutes from './inventoryRoutes';
import testRoutes from './testRoutes';

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

// Test routes (for verifying auth functionality)
router.use('/test', testRoutes);

export default router;

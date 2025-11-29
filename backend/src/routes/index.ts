import express from 'express';
import authRoutes from './authRoutes';
import testRoutes from './testRoutes';

const router = express.Router();

/**
 * Central route configuration
 * Mount all route modules here
 */

// Authentication routes
router.use('/auth', authRoutes);

// Test routes (for verifying auth functionality)
router.use('/test', testRoutes);

export default router;

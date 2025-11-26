import express from 'express';
import exampleRoutes from './exampleRoutes';

const router = express.Router();

/**
 * Central route configuration
 * Mount all route modules here
 */

// Example routes
router.use('/examples', exampleRoutes);

// Add more routes here as your application grows
// router.use('/users', userRoutes);
// router.use('/products', productRoutes);
// router.use('/auth', authRoutes);

export default router;

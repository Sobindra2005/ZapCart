import express from 'express';
import { getUsersList } from '@/controllers/admin.controller';
import { getOrderAnalytics, getTopProducts, getChartData } from '@/controllers/analytics.controller';
import { getRecentLogisticsOrders } from '@/controllers/order.controller';
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

/**
 * @route   GET /api/admin/analytics/orders
 * @desc    Get order analytics with individual KPI time ranges and growth rates
 * @access  Private/Admin
 * @query   salesRange - Time range for total sales (optional: today, week, month, year; default: week)
 * @query   ordersRange - Time range for total orders (optional: today, week, month, year; default: week)
 * @query   aovRange - Time range for average order value (optional: today, week, month, year; default: week)
 * @query   refundRange - Time range for refund rate (optional: today, week, month, year; default: week)
 */
router.get('/analytics/orders', getOrderAnalytics);

/**
 * @route   GET /api/admin/analytics/top-products
 * @desc    Get top 5 best-selling products
 * @access  Private/Admin
 * @query   productsRange - Time range for top products (optional: today, week, month, year; default: week)
 * @query   startDate - Custom start date in ISO format (optional)
 * @query   endDate - Custom end date in ISO format (optional)
 */
router.get('/analytics/top-products', getTopProducts);

/**
 * @route   GET /api/admin/analytics/chart-data
 * @desc    Get chart data for Orders vs Revenue
 * @access  Private/Admin
 * @query   chartRange - Time range for chart data (optional: today, week, month, year; default: week)
 * @query   startDate - Custom start date in ISO format (optional)
 * @query   endDate - Custom end date in ISO format (optional)
 */
router.get('/analytics/chart-data', getChartData);

/**
 * @route   GET /api/admin/orders/logistics/recent
 * @desc    Get recent logistics orders from the last 24 hours
 * @access  Private/Admin
 * @query   start - Starting index (default: 0)
 * @query   limit - Number of records to fetch (default: 5, max: 100)
 */
router.get('/orders/logistics/recent', getRecentLogisticsOrders);

export default router;
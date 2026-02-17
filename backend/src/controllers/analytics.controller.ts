import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler';
import { AnalyticsService } from '../service/analytics.service';

/**
 * Get order analytics with KPIs, top products, and chart data
 * @route GET /api/admin/analytics/orders
 * @access Private/Admin
 * @queryParams {string} salesRange - Time range for total sales KPI (optional, default: week)
 * @queryParams {string} ordersRange - Time range for total orders KPI (optional, default: week)
 * @queryParams {string} aovRange - Time range for average order value KPI (optional, default: week)
 * @queryParams {string} refundRange - Time range for refund rate KPI (optional, default: week)
 * All range parameters accept: today, week, month, year
 * For top products and chart, you can use either predefined range OR custom startDate/endDate (not both)
 * 
 * @description
 * Returns comprehensive analytics data:
 * 
 * **KPIs with Growth Rates:**
 * - Total Sales: Sum of all order amounts
 * - Total Orders: Count of all orders
 * - Average Order Value (AOV): Total sales divided by total orders
 * - Refund Rate: Percentage of refunded orders
 * 
 * Each KPI includes a growth rate compared to its previous equivalent time period:
 * - today → compared with yesterday
 * - week → compared with last week
 * - month → compared with last month
 * - year → compared with last year
 * 
 * Missing intervals are filled with 0 values.
 * 
 * @example
 * GET /api/admin/analytics/orders?salesRange=month
 * GET /api/admin/analytics/orders?salesRange=week
 * 
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "kpis": {
 *       "totalSales": { 
 *         "value": 15000, 
 *         "growthRate": 12.5,
 *         "range": "month",
 *         "comparisonRange": "last_month"
 *       },
 *       "totalOrders": { 
 *         "value": 50, 
 *         "growthRate": 8.7,
 *         "range": "week",
 *         "comparisonRange": "last_week"
 *       },
 *       "averageOrderValue": { 
 *         "value": 300, 
 *         "growthRate": 3.4,
 *         "range": "today",
 *         "comparisonRange": "yesterday"
 *       },
 *       "refundRate": { 
 *         "value": 2.5, 
 *         "growthRate": -15.2,
 *         "range": "year",
 *         "comparisonRange": "last_year"
 *       }
 *     },
 *   }
 * }
 */
export const getOrderAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { salesRange, ordersRange, aovRange, refundRange } = req.query;

  // Get analytics from service with individual ranges
  const analytics = await AnalyticsService.getOrderAnalytics({
    salesRange: salesRange as string,
    ordersRange: ordersRange as string,
    aovRange: aovRange as string,
    refundRange: refundRange as string,
  });



  res.status(200).json({
    Kpis:analytics.kpis,
  });
});

/**
 * Get top 5 best-selling products
 * @route GET /api/admin/analytics/top-products
 * @access Private/Admin
 * @queryParams {string} productsRange - Time range for top products (optional, default: week)
 * @queryParams {string} startDate - Custom start date in ISO format (optional)
 * @queryParams {string} endDate - Custom end date in ISO format (optional)
 * 
 * Range parameter accepts: today, week, month, year
 * You can use either productsRange OR custom startDate/endDate (not both)
 * 
 * @description
 * Returns top 5 best-selling products ranked by total quantity sold.
 * Excludes CANCELLED orders but includes all other statuses including REFUNDED.
 * 
 * @example
 * GET /api/admin/analytics/top-products?productsRange=month
 * GET /api/admin/analytics/top-products?startDate=2026-01-01&endDate=2026-01-31
 * 
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "topProducts": [
 *       {
 *         "id": "507f1f77bcf86cd799439011",
 *         "name": "Wireless Headphones",
 *         "totalQuantitySold": 125,
 *         "thumbnail": "https://..."
 *       }
 *     ]
 *   }
 * }
 */
export const getTopProducts = asyncHandler(async (req: Request, res: Response) => {
  const { productsRange, startDate, endDate } = req.query;

  const topProducts = await AnalyticsService.getTopProducts(
    productsRange as string,
    startDate as string,
    endDate as string
  );

  res.status(200).json({
    status: 'success',
    data: {
      topProducts,
    },
  });
});

/**
 * Get chart data for Orders vs Revenue
 * @route GET /api/admin/analytics/chart-data
 * @access Private/Admin
 * @queryParams {string} chartRange - Time range for chart data (optional, default: week)
 * @queryParams {string} startDate - Custom start date in ISO format (optional)
 * @queryParams {string} endDate - Custom end date in ISO format (optional)
 * 
 * Range parameter accepts: today, week, month, year
 * You can use either chartRange OR custom startDate/endDate (not both)
 * 
 * @description
 * Returns chart data with labels and corresponding orders/revenue per interval.
 * 
 * **Revenue Calculation:**
 * - Revenue = subtotal - discount (excluding tax and shipping)
 * - Only includes valid orders (excludes CANCELLED)
 * 
 * **Label Generation:**
 * - today → 24 hourly intervals (00:00 - 23:00)
 * - week → 7 daily intervals
 * - month → Days of the month
 * - year → 12 monthly intervals (Jan - Dec)
 * - custom range → Dynamic based on duration:
 *   - Same-day range → hourly
 *   - Multi-day within 31 days → daily
 *   - More than 31 days → monthly
 * 
 * Missing intervals are filled with 0 values.
 * 
 * @example
 * GET /api/admin/analytics/chart-data?chartRange=week
 * GET /api/admin/analytics/chart-data?chartRange=today
 * GET /api/admin/analytics/chart-data?startDate=2026-02-01&endDate=2026-02-15
 * 
 * Response:
 * {
 *   "status": "success",
 *   "data": {
 *     "chartData": {
 *       "labels": ["02-10", "02-11", "02-12", "02-13", "02-14", "02-15", "02-16"],
 *       "ordersData": [12, 15, 8, 20, 18, 10, 14],
 *       "revenueData": [3600.00, 4500.50, 2400.00, 6000.25, 5400.00, 3000.75, 4200.00]
 *     }
 *   }
 * }
 */
export const getChartData = asyncHandler(async (req: Request, res: Response) => {
  const { chartRange, startDate, endDate } = req.query;

  const chartData = await AnalyticsService.generateChartData(
    chartRange as string,
    startDate as string,
    endDate as string
  );

  res.status(200).json({
    status: 'success',
    data: {
      chartData,
    },
  });
});


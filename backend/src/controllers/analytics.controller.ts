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
 * @queryParams {string} productsRange - Time range for top products (optional, default: week)
 * @queryParams {string} chartRange - Time range for chart data (optional, default: week)
 * @queryParams {string} startDate - Custom start date for top products/chart in ISO format (optional)
 * @queryParams {string} endDate - Custom end date for top products/chart in ISO format (optional)
 * 
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
 * **Top Products:**
 * - Top 5 best-selling products ranked by quantity sold
 * - Includes product ID, name, total quantity sold, and thumbnail
 * 
 * **Chart Data (Orders vs Revenue):**
 * - Labels: Time intervals (hourly, daily, or monthly)
 * - Orders Data: Number of orders per interval
 * - Revenue Data: Revenue per interval (subtotal - discount, excluding tax and shipping)
 * 
 * Chart label generation:
 * - today → 24 hourly intervals (00:00 - 23:00)
 * - week → 7 daily intervals
 * - month → Days of the month
 * - year → 12 monthly intervals (Jan - Dec)
 * - custom range → Dynamic based on duration (hourly for same-day, daily for multi-day, monthly for multi-month)
 * 
 * Missing intervals are filled with 0 values.
 * 
 * @example
 * GET /api/admin/analytics/orders?salesRange=month&ordersRange=week&chartRange=week
 * GET /api/admin/analytics/orders?salesRange=week&chartRange=today
 * GET /api/admin/analytics/orders?startDate=2026-01-01&endDate=2026-01-31
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
 *     "topProducts": [
 *       {
 *         "id": "507f1f77bcf86cd799439011",
 *         "name": "Wireless Headphones",
 *         "totalQuantitySold": 125,
 *         "thumbnail": "https://..."
 *       }
 *     ],
 *     "chartData": {
 *       "labels": ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
 *       "ordersData": [12, 15, 8, 20, 18, 10, 14],
 *       "revenueData": [3600, 4500, 2400, 6000, 5400, 3000, 4200]
 *     }
 *   }
 * }
 */
export const getOrderAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const { salesRange, ordersRange, aovRange, refundRange, productsRange, chartRange, startDate, endDate } = req.query;

  // Get analytics from service with individual ranges
  const analytics = await AnalyticsService.getOrderAnalytics({
    salesRange: salesRange as string,
    ordersRange: ordersRange as string,
    aovRange: aovRange as string,
    refundRange: refundRange as string,
    productsRange: productsRange as string,
    chartRange: chartRange as string,
    startDate: startDate as string,
    endDate: endDate as string,
  });



  res.status(200).json({
    status: 'success',
    data: analytics,
  });
});


import { prisma } from '@/config/prisma';
import { OrderStatus } from '@/generated/prisma';
import AppError from '@/utils/AppError';
import Product from '@/models/Product';

/**
 * Define valid time ranges for analytics
 */
export type TimeRange = 'today' | 'week' | 'month' | 'year';

/**
 * Interface for date range boundaries
 */
interface DateRange {
  startDate: Date;
  endDate: Date;
}

/**
 * Interface for aggregated order metrics
 */
interface OrderMetrics {
  totalSales: number;
  totalOrders: number;
  refundedOrders: number;
}

/**
 * Interface for KPI with growth rate
 */
interface KPIWithGrowth {
  value: number;
  growthRate: number;
}

/**
 * Interface for KPI with growth rate and range
 */
interface KPIWithGrowthAndRange extends KPIWithGrowth {
  range: TimeRange;
  comparisonRange: string;
}

/**
 * Interface for top selling product
 */
export interface TopProduct {
  id: string;
  name: string;
  totalQuantitySold: number;
  thumbnail?: string;
}

/**
 * Interface for chart data point
 */
export interface ChartDataPoint {
  label: string;
  orders: number;
  revenue: number;
}

/**
 * Interface for chart data
 */
export interface ChartData {
  labels: string[];
  ordersData: number[];
  revenueData: number[];
}

/**
 * Interface for analytics response
 */
export interface OrderAnalytics {
  kpis: {
    totalSales: KPIWithGrowthAndRange;
    totalOrders: KPIWithGrowthAndRange;
    averageOrderValue: KPIWithGrowthAndRange;
    refundRate: KPIWithGrowthAndRange;
  };
}

/**
 * Interface for individual KPI ranges
 */
export interface KPIRanges {
  salesRange?: string;
  ordersRange?: string;
  aovRange?: string;
  refundRange?: string;
  productsRange?: string;
  chartRange?: string;
  startDate?: string;
  endDate?: string;
}

/**
 * Analytics Service
 * Handles all business logic for order analytics and KPI calculations
 */
export class AnalyticsService {
  /**
   * Validate time range parameter
   */
  private static validateTimeRange(range: string): TimeRange {
    const validRanges: TimeRange[] = ['today', 'week', 'month', 'year'];
    if (!validRanges.includes(range as TimeRange)) {
      throw new AppError(
        `Invalid range parameter. Must be one of: ${validRanges.join(', ')}`,
        400
      );
    }
    return range as TimeRange;
  }

  /**
   * Get current period date boundaries based on time range
   */
  private static getCurrentPeriod(range: TimeRange): DateRange {
    const now = new Date();
    const startDate = new Date();
    const endDate = new Date();

    switch (range) {
      case 'today':
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'week':
        // Start of current week (Monday)
        const dayOfWeek = now.getDay();
        const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
        startDate.setDate(now.getDate() + diffToMonday);
        startDate.setHours(0, 0, 0, 0);
        
        // End of current week (Sunday)
        const diffToSunday = dayOfWeek === 0 ? 0 : 7 - dayOfWeek;
        endDate.setDate(now.getDate() + diffToSunday);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'month':
        startDate.setDate(1);
        startDate.setHours(0, 0, 0, 0);
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'year':
        startDate.setMonth(0, 1);
        startDate.setHours(0, 0, 0, 0);
        
        // End of current year (Dec 31)
        endDate.setMonth(11, 31);
        endDate.setHours(23, 59, 59, 999);
        break;
    }

    return { startDate, endDate };
  }

  /**
   * Get previous period date boundaries based on time range
   */
  private static getPreviousPeriod(range: TimeRange): DateRange {
    const currentPeriod = this.getCurrentPeriod(range);
    const startDate = new Date(currentPeriod.startDate);
    const endDate = new Date(currentPeriod.endDate);

    switch (range) {
      case 'today':
        // Yesterday
        startDate.setDate(startDate.getDate() - 1);
        endDate.setDate(endDate.getDate() - 1);
        break;

      case 'week':
        // Last week
        startDate.setDate(startDate.getDate() - 7);
        endDate.setDate(endDate.getDate() - 7);
        break;

      case 'month':
        // Last month
        startDate.setMonth(startDate.getMonth() - 1);
        endDate.setMonth(endDate.getMonth() - 1);
        // Adjust for end of previous month
        endDate.setDate(0); // Sets to last day of previous month
        endDate.setHours(23, 59, 59, 999);
        break;

      case 'year':
        // Last year
        startDate.setFullYear(startDate.getFullYear() - 1);
        endDate.setFullYear(endDate.getFullYear() - 1);
        break;
    }

    return { startDate, endDate };
  }

  /**
   * Get comparison range label
   */
  private static getComparisonLabel(range: TimeRange): string {
    const labels: Record<TimeRange, string> = {
      today: 'yesterday',
      week: 'last_week',
      month: 'last_month',
      year: 'last_year',
    };
    return labels[range];
  }

  /**
   * Fetch order metrics from database for a specific date range
   */
  private static async fetchOrderMetrics(
    startDate: Date,
    endDate: Date
  ): Promise<OrderMetrics> {
    // Exclude CANCELLED orders but include REFUNDED for refund rate calculation
    const validStatuses = [
      OrderStatus.PENDING,
      OrderStatus.PAYMENT_PENDING,
      OrderStatus.PAYMENT_FAILED,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.REFUNDED,
    ];

    // Aggregate total sales and order count (excluding cancelled)
    const aggregation = await prisma.order.aggregate({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: {
          in: validStatuses,
        },
      },
      _sum: {
        totalAmount: true,
      },
      _count: {
        id: true,
      },
    });

    // Count refunded orders separately
    const refundedOrdersCount = await prisma.order.count({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
        status: OrderStatus.REFUNDED,
      },
    });

    return {
      totalSales: Number(aggregation._sum.totalAmount) || 0,
      totalOrders: aggregation._count.id || 0,
      refundedOrders: refundedOrdersCount || 0,
    };
  }

  /**
   * Calculate growth rate between two values
   */
  private static calculateGrowthRate(
    currentValue: number,
    previousValue: number
  ): number {
    // Edge case: both are zero
    if (previousValue === 0 && currentValue === 0) {
      return 0;
    }

    // Edge case: previous is zero but current is positive
    if (previousValue === 0 && currentValue > 0) {
      return 100;
    }

    // Standard growth rate calculation
    return ((currentValue - previousValue) / previousValue) * 100;
  }

  /**
   * Calculate a single KPI with growth rate and range info
   */
  private static async calculateSingleKPI(
    range: TimeRange,
    kpiType: 'sales' | 'orders' | 'aov' | 'refund'
  ): Promise<KPIWithGrowthAndRange> {
    // Get date ranges
    const currentPeriod = this.getCurrentPeriod(range);
    const previousPeriod = this.getPreviousPeriod(range);

    // Fetch metrics for both periods
    const [currentMetrics, previousMetrics] = await Promise.all([
      this.fetchOrderMetrics(currentPeriod.startDate, currentPeriod.endDate),
      this.fetchOrderMetrics(previousPeriod.startDate, previousPeriod.endDate),
    ]);

    let currentValue: number;
    let previousValue: number;

    switch (kpiType) {
      case 'sales':
        currentValue = currentMetrics.totalSales;
        previousValue = previousMetrics.totalSales;
        break;

      case 'orders':
        currentValue = currentMetrics.totalOrders;
        previousValue = previousMetrics.totalOrders;
        break;

      case 'aov':
        currentValue =
          currentMetrics.totalOrders > 0
            ? currentMetrics.totalSales / currentMetrics.totalOrders
            : 0;
        previousValue =
          previousMetrics.totalOrders > 0
            ? previousMetrics.totalSales / previousMetrics.totalOrders
            : 0;
        currentValue = Number(currentValue.toFixed(2));
        break;

      case 'refund':
        currentValue =
          currentMetrics.totalOrders > 0
            ? (currentMetrics.refundedOrders / currentMetrics.totalOrders) * 100
            : 0;
        previousValue =
          previousMetrics.totalOrders > 0
            ? (previousMetrics.refundedOrders / previousMetrics.totalOrders) * 100
            : 0;
        currentValue = Number(currentValue.toFixed(2));
        break;
    }

    const growthRate = this.calculateGrowthRate(currentValue, previousValue);

    return {
      value: currentValue,
      growthRate,
      range,
      comparisonRange: this.getComparisonLabel(range),
    };
  }

  /**
   * Determine interval type based on date range
   */
  private static determineIntervalType(startDate: Date, endDate: Date): 'hourly' | 'daily' | 'monthly' {
    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) {
      return 'hourly'; // Same day
    } else if (diffDays <= 31) {
      return 'daily'; // Up to a month
    } else {
      return 'monthly'; // More than a month
    }
  }

  /**
   * Generate labels based on interval type and date range
   */
  private static generateChartLabels(
    startDate: Date,
    endDate: Date,
    intervalType: 'hourly' | 'daily' | 'monthly',
    rangeType?: TimeRange
  ): string[] {
    const labels: string[] = [];
    
    if (intervalType === 'hourly') {
      // Generate 24 hourly labels
      for (let hour = 0; hour < 24; hour++) {
        const hourStr = hour.toString().padStart(2, '0');
        labels.push(`${hourStr}:00`);
      }
    } else if (intervalType === 'daily') {
      // For 'week' range, always generate all 7 days
      if (rangeType === 'week') {
        const current = new Date(startDate);
        current.setHours(0, 0, 0, 0);
        
        // Generate exactly 7 days (Mon-Sun)
        for (let i = 0; i < 7; i++) {
          const month = (current.getMonth() + 1).toString().padStart(2, '0');
          const day = current.getDate().toString().padStart(2, '0');
          labels.push(`${month}-${day}`);
          current.setDate(current.getDate() + 1);
        }
      } else {
        // Generate daily labels for custom range
        const current = new Date(startDate);
        current.setHours(0, 0, 0, 0);
        
        while (current <= endDate) {
          const month = (current.getMonth() + 1).toString().padStart(2, '0');
          const day = current.getDate().toString().padStart(2, '0');
          labels.push(`${month}-${day}`);
          current.setDate(current.getDate() + 1);
        }
      }
    } else {
      // For 'year' range, always generate all 12 months
      if (rangeType === 'year') {
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        labels.push(...monthNames);
      } else {
        // Generate monthly labels for custom range
        const current = new Date(startDate);
        current.setDate(1);
        current.setHours(0, 0, 0, 0);
        
        const endMonth = new Date(endDate);
        endMonth.setDate(1);
        endMonth.setHours(0, 0, 0, 0);
        
        while (current <= endMonth) {
          const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
          labels.push(monthNames[current.getMonth()]);
          current.setMonth(current.getMonth() + 1);
        }
      }
    }
    
    return labels;
  }

  /**
   * Get chart data key based on interval and date
   */
  private static getChartDataKey(date: Date, intervalType: 'hourly' | 'daily' | 'monthly'): string {
    if (intervalType === 'hourly') {
      const hour = date.getHours().toString().padStart(2, '0');
      return `${hour}:00`;
    } else if (intervalType === 'daily') {
      const month = (date.getMonth() + 1).toString().padStart(2, '0');
      const day = date.getDate().toString().padStart(2, '0');
      return `${month}-${day}`;
    } else {
      const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
      return monthNames[date.getMonth()];
    }
  }

  /**
   * Generate chart data for orders and revenue
   */
  static async generateChartData(
    chartRange?: string,
    startDate?: string,
    endDate?: string
  ): Promise<ChartData> {
    // Get date range
    let dateRange: DateRange;
    let intervalType: 'hourly' | 'daily' | 'monthly';
    let rangeType: TimeRange | undefined;
    
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)', 400);
      }
      
      if (start > end) {
        throw new AppError('startDate must be before endDate', 400);
      }
      
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      dateRange = { startDate: start, endDate: end };
      intervalType = this.determineIntervalType(start, end);
      rangeType = undefined; // Custom range
    } else {
      const range = this.validateTimeRange(chartRange || 'week');
      rangeType = range;
      dateRange = this.getCurrentPeriod(range);
      
      // Determine interval based on range
      if (range === 'today') {
        intervalType = 'hourly';
      } else if (range === 'year') {
        intervalType = 'monthly';
      } else {
        intervalType = 'daily';
      }
    }
    
    // Generate labels
    const labels = this.generateChartLabels(dateRange.startDate, dateRange.endDate, intervalType, rangeType);
    
    // Exclude CANCELLED orders
    const validStatuses = [
      OrderStatus.PENDING,
      OrderStatus.PAYMENT_PENDING,
      OrderStatus.PAYMENT_FAILED,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.REFUNDED,
    ];
    
    // Fetch orders within date range
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: dateRange.startDate,
          lte: dateRange.endDate,
        },
        status: {
          in: validStatuses,
        },
      },
      select: {
        createdAt: true,
        subtotal: true,
        discount: true,
      },
    });
    
    // Aggregate data by interval
    const dataMap = new Map<string, { orders: number; revenue: number }>();
    
    // Initialize all labels with zero
    labels.forEach(label => {
      dataMap.set(label, { orders: 0, revenue: 0 });
    });
    
    // Fill in actual data
    orders.forEach(order => {
      const key = this.getChartDataKey(order.createdAt, intervalType);
      const existing = dataMap.get(key);
      
      if (existing) {
        existing.orders += 1;
        // Revenue = subtotal - discount (excluding tax and shipping)
        existing.revenue += Number(order.subtotal) - Number(order.discount);
      }
    });
    
    // Convert map to arrays
    const ordersData: number[] = [];
    const revenueData: number[] = [];
    
    labels.forEach(label => {
      const data = dataMap.get(label) || { orders: 0, revenue: 0 };
      ordersData.push(data.orders);
      revenueData.push(Number(data.revenue.toFixed(2)));
    });
    
    return {
      labels,
      ordersData,
      revenueData,
    };
  }

  /**
   * Get date range for top products query
   * Supports both predefined ranges and custom dates
   */
  private static getProductsDateRange(
    productsRange?: string,
    startDate?: string,
    endDate?: string
  ): DateRange {
    // If custom dates provided, use them
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      
      if (isNaN(start.getTime()) || isNaN(end.getTime())) {
        throw new AppError('Invalid date format. Use ISO 8601 format (YYYY-MM-DD)', 400);
      }
      
      if (start > end) {
        throw new AppError('startDate must be before endDate', 400);
      }
      
      // Set time boundaries
      start.setHours(0, 0, 0, 0);
      end.setHours(23, 59, 59, 999);
      
      return { startDate: start, endDate: end };
    }
    
    // Otherwise use predefined range (default to 'week')
    const range = this.validateTimeRange(productsRange || 'week');
    return this.getCurrentPeriod(range);
  }

  /**
   * Get top 5 best-selling products
   */
  static async getTopProducts(
    productsRange?: string,
    startDate?: string,
    endDate?: string
  ): Promise<TopProduct[]> {
    const dateRange = this.getProductsDateRange(productsRange, startDate, endDate);
    
    // Exclude CANCELLED orders
    const validStatuses = [
      OrderStatus.PENDING,
      OrderStatus.PAYMENT_PENDING,
      OrderStatus.PAYMENT_FAILED,
      OrderStatus.CONFIRMED,
      OrderStatus.PROCESSING,
      OrderStatus.SHIPPED,
      OrderStatus.DELIVERED,
      OrderStatus.REFUNDED,
    ];

    // Aggregate quantities by product from order items
    const topProductData = await prisma.orderItem.groupBy({
      by: ['productId'],
      where: {
        order: {
          createdAt: {
            gte: dateRange.startDate,
            lte: dateRange.endDate,
          },
          status: {
            in: validStatuses,
          },
        },
      },
      _sum: {
        quantity: true,
      },
      orderBy: {
        _sum: {
          quantity: 'desc',
        },
      },
      take: 5,
    });

    // Fetch product details from MongoDB
    const productIds = topProductData.map((item) => item.productId);
    const products = await Product.find({ _id: { $in: productIds } }).lean();

    // Map products with sales data
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));
    
    const topProducts: TopProduct[] = topProductData
      .map((item) => {
        const product = productMap.get(item.productId);
        if (!product) return null;
        
        return {
          id: item.productId,
          name: product.name,
          totalQuantitySold: item._sum.quantity || 0,
          ...(product.thumbnail && { thumbnail: product.thumbnail }),
        } as TopProduct;
      })
      .filter((item) => item !== null) as TopProduct[];

    return topProducts;
  }

  /**
   * Get order analytics with individual KPI ranges
   * Main service method
   */
  static async getOrderAnalytics(kpiRanges: KPIRanges): Promise<OrderAnalytics> {
    // Validate and set default ranges
    const salesRange = this.validateTimeRange(kpiRanges.salesRange || 'week');
    const ordersRange = this.validateTimeRange(kpiRanges.ordersRange || 'week');
    const aovRange = this.validateTimeRange(kpiRanges.aovRange || 'week');
    const refundRange = this.validateTimeRange(kpiRanges.refundRange || 'week');

    // Calculate each KPI independently with its own range, plus top products and chart data
    const [totalSales, totalOrders, averageOrderValue, refundRate] = await Promise.all([
      this.calculateSingleKPI(salesRange, 'sales'),
      this.calculateSingleKPI(ordersRange, 'orders'),
      this.calculateSingleKPI(aovRange, 'aov'),
      this.calculateSingleKPI(refundRange, 'refund'),
    ]);

    return {
      kpis: {
        totalSales,
        totalOrders,
        averageOrderValue,
        refundRate,
      },
    };
  }
}

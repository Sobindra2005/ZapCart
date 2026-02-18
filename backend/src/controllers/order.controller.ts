import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';
import { OrderStatus, PaymentStatus, PaymentMethod, InventoryAction } from '@/generated/prisma';
import { redis } from '@/config/redis';
import { orderQueue } from '@/config/queue';
import { DELIVERY_ESTIMATE_KEY, REDIS_DELIVERY_KEY } from './settings.controller';
import { Product } from '../models';

// Helper to get estimated delivery days
const getEstimatedDeliveryDays = async (): Promise<number> => {
    const redisClient = redis.getClient();
    let days: string | null = null;

    if (redisClient) {
        days = await redisClient.get(REDIS_DELIVERY_KEY);
    }

    if (!days) {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: DELIVERY_ESTIMATE_KEY },
        });
        days = setting?.value || '5'; // Default

        if (redisClient && days) {
            await redisClient.set(REDIS_DELIVERY_KEY, days);
        }
    }

    return parseInt(days || '5', 10);
};

interface OrderItemInput {
    productId: number;    sku: string;
    quantity: number;
    unitPrice: number;
    discount?: number;
}

/**
 * Create a new order
 * POST /api/v1/orders
 */
export const createOrder = asyncHandler(async (req: Request, res: Response) => {
    const {
        shippingAddressId,
        billingAddressId,
        items, // Array of { productId, productName, sku, variantId, variantName, quantity, unitPrice, discount }
        shippingCost,
        tax,
        discount,
        paymentMethod,
        channel
    } = req.body;
    const userId = req.user!.id;

    // 1. Validate required fields
    if (!shippingAddressId || !billingAddressId || !items || items.length === 0) {
        throw new AppError('Please provide shipping address, billing address, and order items', 400);
    }

    // 2. Validate addresses exist and belong to user
    const shippingAddress = await prisma.address.findUnique({ where: { id: shippingAddressId } });
    const billingAddress = await prisma.address.findUnique({ where: { id: billingAddressId } });

    if (!shippingAddress || shippingAddress.userId !== userId) {
        throw new AppError('Invalid shipping address', 400);
    }
    if (!billingAddress || billingAddress.userId !== userId) {
        throw new AppError('Invalid billing address', 400);
    }

    // 3. Calculate totals (Server-side calculation is safer, but we are trusting client for unitPrice for now as per plan)
    let subtotal = 0;
    const orderItemsData = items.map((item: OrderItemInput) => {
        const itemTotal = (item.unitPrice * item.quantity) - (item.discount || 0);
        subtotal += itemTotal;
        return {
            productId: item.productId,
            sku: item.sku || 'N/A',
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: itemTotal,
            discount: item.discount || 0,
            channel: channel || 'WEBSITE', // Default to WEBSITE if not provided
        };
    });

    const totalAmount = subtotal + (shippingCost || 0) + (tax || 0) - (discount || 0);

    // 4. Get Estimated Delivery
    const deliveryDays = await getEstimatedDeliveryDays();
    const estimatedDelivery = new Date();
    estimatedDelivery.setDate(estimatedDelivery.getDate() + deliveryDays);

    // 6. Generate Tracking Number (Simple UUID or Random String for now)
    const trackingNumber = `TRK-${Date.now()}-${Math.floor(Math.random() * 10000)}`;

    // 7. Create Order and OrderItems in a transaction
    const order = await prisma.$transaction(async (tx) => {
        // Check and Reserve Inventory for each item
        for (const item of items) {
            const inventory = await tx.inventory.findUnique({
                where: { productId: item.productId },
            });

            if (!inventory) {
                throw new AppError(`Product ${item.productName} not found in inventory`, 400);
            }

            if (inventory.availableQuantity < item.quantity) {
                throw new AppError(`Insufficient stock for ${item.productName}`, 400);
            }

            // Update Inventory: Reserve Stock
            await tx.inventory.update({
                where: { id: inventory.id },
                data: {
                    availableQuantity: { decrement: item.quantity },
                    reservedQuantity: { increment: item.quantity },
                },
            });

            // Log Inventory Action
            await tx.inventoryLog.create({
                data: {
                    inventoryId: inventory.id,
                    action: InventoryAction.RESERVATION,
                    quantityChange: -item.quantity, // Available quantity decreases
                    quantityBefore: inventory.availableQuantity,
                    quantityAfter: inventory.availableQuantity - item.quantity,
                    reason: 'Order Reservation',
                    performedBy: userId,
                },
            });
        }

        // Create Order
        const newOrder = await tx.order.create({
            data: {
                userId,
                orderNumber: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`, // Simple order number generation
                status: OrderStatus.PENDING,
                shippingAddressId,
                billingAddressId,
                subtotal,
                shippingCost: shippingCost || 0,
                tax: tax || 0,
                discount: discount || 0,
                totalAmount,
                trackingNumber,
                estimatedDelivery,
                orderItems: {
                    create: orderItemsData,
                },
            },
            include: {
                orderItems: true,
            },
        });

        // (Optional) Create initial Payment record if needed
        if (paymentMethod) {
            await tx.payment.create({
                data: {
                    orderId: newOrder.id,
                    userId,
                    amount: totalAmount,
                    status: PaymentStatus.PENDING,
                    method: paymentMethod as PaymentMethod,
                }
            });
        }

        return newOrder;
    });

    // 7. Queue Job
    await orderQueue.add('process-order', {
        orderId: order.id,
        action: 'PROCESS_ORDER',
    });

    res.status(201).json({
        status: 'success',
        data: { order },
    });
});

/**
 * Get all orders for the logged-in user
 * GET /api/v1/orders
 */
export const getMyOrders = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const orders = await prisma.order.findMany({
        where: { userId },
        include: {
            orderItems: true,
            shippingAddress: true,
            billingAddress: true,
        },
        orderBy: { createdAt: 'desc' },
    });

    // Extract all unique product IDs from all orders
    const productIds = [...new Set(
        orders.flatMap(order => 
            order.orderItems.map(item => item.productId)
        )
    )];

    // Fetch all products in a single query from MongoDB
    const products = await Product.find(
        { _id: { $in: productIds } },
        { _id: 1, name: 1, thumbnail: 1, slug: 1 }
    ).lean();

    // Create a product lookup map for O(1) access
    const productMap = new Map(
        products.map(product => [product._id.toString(), product])
    );

    // Enrich order items with product details
    const enrichedOrders = orders.map(order => ({
        ...order,
        orderItems: order.orderItems.map(item => ({
            ...item,
            product: productMap.get(item.productId) || null,
        })),
    }));

    res.status(200).json({
        status: 'success',
        results: enrichedOrders.length,
        data: { orders: enrichedOrders },
    });
});
/**
 * Get a specific order
 * GET /api/v1/orders/:id
 */
export const getOrderById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const order = await prisma.order.findUnique({
        where: { id: Number(id) },
        include: {
            orderItems: true,
            shippingAddress: true,
            billingAddress: true,
            payments: true,
        },
    });

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    // Ensure the order belongs to the user
    if (order.userId !== userId) {
        throw new AppError('You do not have permission to view this order', 403);
    }

    res.status(200).json({
        status: 'success',
        data: { order },
    });
});

/**
 * Update an order
 * PATCH /api/v1/orders/:id
 */
export const updateOrder = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { status, trackingNumber, estimatedDelivery, deliveredAt } = req.body;

    // Check if order exists
    const order = await prisma.order.findUnique({
        where: { id: Number(id) },
    });

    if (!order) {
        throw new AppError('Order not found', 404);
    }

    const updatedOrder = await prisma.order.update({
        where: { id: Number(id) },
        data: {
            status,
            trackingNumber,
            estimatedDelivery: estimatedDelivery ? new Date(estimatedDelivery) : undefined,
            deliveredAt: deliveredAt ? new Date(deliveredAt) : undefined,
        },
    });

    res.status(200).json({
        status: 'success',
        data: { order: updatedOrder },
    });
});

/**
 * Get recent logistics orders from the last 24 hours
 * GET /api/admin/orders/logistics/recent
 * @access Private/Admin
 * @queryParams {number} start - Starting index (default: 0)
 * @queryParams {number} limit - Number of records to fetch (default: 5, max: 100)
 * 
 * @description
 * Returns paginated orders from the last 24 hours with:
 * - Order details: totalAmount, orderNumber, status, userName
 * - Item details: itemName, quantity for each order item
 * - Total count of pending orders from the last 24 hours
 */
export const getRecentLogisticsOrders = asyncHandler(async (req: Request, res: Response) => {
    const start = parseInt(req.query.start as string) || 0;
    const limit = Math.min(parseInt(req.query.limit as string) || 5, 100);

    // Calculate 24 hours ago timestamp
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    // Fetch orders from last 24 hours with pagination
    const [orders, totalCount, pendingCount] = await Promise.all([
        prisma.order.findMany({
            where: {
                createdAt: {
                    gte: twentyFourHoursAgo,
                },
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                    },
                },
                orderItems: {
                    select: {
                        productId: true,
                        quantity: true,
                    },
                },
            },
            orderBy: {
                createdAt: 'desc',
            },
            skip: start,
            take: limit,
        }),
        // Total count of all orders from last 24 hours
        prisma.order.count({
            where: {
                createdAt: {
                    gte: twentyFourHoursAgo,
                },
            },
        }),
        // Count of pending orders from last 24 hours
        prisma.order.count({
            where: {
                createdAt: {
                    gte: twentyFourHoursAgo,
                },
                status: OrderStatus.PENDING,
            },
        }),
    ]);

    // Extract unique product IDs
    const productIds = [...new Set(
        orders.flatMap(order => 
            order.orderItems.map(item => item.productId)
        )
    )];

    // Fetch product details from MongoDB
    const products = await Product.find(
        { _id: { $in: productIds } },
        { _id: 1, name: 1 }
    ).lean();

    // Create product lookup map
    const productMap = new Map(
        products.map(product => [product._id.toString(), product.name])
    );

    // Transform orders to include required fields
    const transformedOrders = orders.map(order => ({
        totalAmount: Number(order.totalAmount),
        orderNumber: order.orderNumber,
        status: order.status,
        userName: `${order.user.firstName} ${order.user.lastName}`,
        items: order.orderItems.map(item => ({
            itemName: productMap.get(item.productId) || 'Unknown Product',
            quantity: item.quantity,
        })),
        createdAt: order.createdAt,
    }));

    res.status(200).json({
        status: 'success',
        results: transformedOrders.length,
        pagination: {
            start,
            limit,
            total: totalCount,
            hasMore: start + limit < totalCount,
        },
        data: {
            orders: transformedOrders,
            pendingOrdersCount: pendingCount,
        },
    });
});


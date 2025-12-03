import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';
import { OrderStatus, PaymentStatus, PaymentMethod, InventoryAction } from '@/generated/prisma';
import { redis } from '@/config/redis';
import { orderQueue } from '@/config/queue';
import { DELIVERY_ESTIMATE_KEY, REDIS_DELIVERY_KEY } from './settings.controller';

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
    productId: number;
    productName: string;
    sku: string;
    variantId?: number;
    variantName?: string;
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
            productName: item.productName,
            sku: item.sku,
            variantId: item.variantId,
            variantName: item.variantName,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: itemTotal,
            discount: item.discount || 0,
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

    res.status(200).json({
        status: 'success',
        results: orders.length,
        data: { orders },
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


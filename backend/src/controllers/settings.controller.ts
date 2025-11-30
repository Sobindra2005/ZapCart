import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import { redis } from '@/config/redis';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';

export const DELIVERY_ESTIMATE_KEY = 'ESTIMATED_DELIVERY_DAYS';
export const REDIS_DELIVERY_KEY = 'system:delivery_days';

/**
 * Update Estimated Delivery Time (Admin Only)
 * PUT /api/v1/settings/delivery-estimate
 */
export const updateDeliveryEstimate = asyncHandler(async (req: Request, res: Response) => {
    const { days } = req.body;

    if (!days || isNaN(Number(days))) {
        throw new AppError('Please provide a valid number of days', 400);
    }

    const value = String(days);

    // 1. Update Database
    const setting = await prisma.systemSetting.upsert({
        where: { key: DELIVERY_ESTIMATE_KEY },
        update: { value },
        create: {
            key: DELIVERY_ESTIMATE_KEY,
            value,
            description: 'Default estimated delivery time in days',
        },
    });

    // 2. Update Redis Cache
    const redisClient = redis.getClient();
    if (redisClient) {
        await redisClient.set(REDIS_DELIVERY_KEY, value);
    }

    res.status(200).json({
        status: 'success',
        data: {
            setting,
        },
    });
});

/**
 * Get Estimated Delivery Time
 * GET /api/v1/settings/delivery-estimate
 */
export const getDeliveryEstimate = asyncHandler(async (_req: Request, res: Response) => {
    // Try Redis first
    const redisClient = redis.getClient();
    let days = null;

    if (redisClient) {
        days = await redisClient.get(REDIS_DELIVERY_KEY);
    }

    // Fallback to DB
    if (!days) {
        const setting = await prisma.systemSetting.findUnique({
            where: { key: DELIVERY_ESTIMATE_KEY },
        });
        days = setting?.value || '5'; // Default to 5 days if not set

        // Cache it
        if (redisClient) {
            await redisClient.set(REDIS_DELIVERY_KEY, days);
        }
    }

    res.status(200).json({
        status: 'success',
        data: {
            days: Number(days),
        },
    });
});

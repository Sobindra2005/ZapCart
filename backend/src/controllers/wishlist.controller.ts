import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import { getRedisClient } from '@/config/redis';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';

// Redis cache keys
const CACHE_PREFIX = 'wishlist:';
const CACHE_TTL = 3600; // 1 hour

/**
 * Get Redis cache key for user's wishlist
 */
const getUserWishlistKey = (userId: number): string => {
    return `${CACHE_PREFIX}user:${userId}`;
};

/**
 * Get Redis cache key for wishlist item
 */
const getWishlistItemKey = (userId: number, productId: string): string => {
    return `${CACHE_PREFIX}user:${userId}:product:${productId}`;
};

/**
 * Invalidate user's wishlist cache
 */
const invalidateWishlistCache = async (userId: number): Promise<void> => {
    const redisClient = getRedisClient();
    if (redisClient) {
        try {
            const wishlistKey = getUserWishlistKey(userId);
            await redisClient.del(wishlistKey);
        } catch (error) {
            console.error('Redis cache invalidation error:', error);
            // Don't throw error - cache invalidation failure shouldn't break the operation
        }
    }
};

/**
 * @desc    Get user's wishlist
 * @route   GET /api/wishlist
 * @access  Private
 */
export const getUserWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    const redisClient = getRedisClient();
    const cacheKey = getUserWishlistKey(userId);

    // Try to get from cache first
    if (redisClient) {
        try {
            const cachedData = await redisClient.get(cacheKey);
            if (cachedData) {
                const wishlist = JSON.parse(cachedData);
                res.status(200).json({
                    success: true,
                    source: 'cache',
                    count: wishlist.length,
                    data: wishlist,
                });
                return;
            }
        } catch (error) {
            console.error('Redis get error:', error);
            // Continue to database if cache fails
        }
    }

    // Get from database
    const wishlist = await prisma.wishlist.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        select: {
            id: true,
            productId: true,
            createdAt: true,
        },
    });

    // Cache the result
    if (redisClient) {
        try {
            await redisClient.setex(cacheKey, CACHE_TTL, JSON.stringify(wishlist));
        } catch (error) {
            console.error('Redis set error:', error);
            // Don't throw - caching failure shouldn't break the response
        }
    }

    res.status(200).json({
        success: true,
        source: 'database',
        count: wishlist.length,
        data: wishlist,
    });
    return;
});

/**
 * @desc    Add product to wishlist
 * @route   POST /api/wishlist
 * @access  Private
 */
export const addToWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    if (!productId) {
        throw new AppError('Product ID is required', 400);
    }

    // Check if product already in wishlist
    const existingItem = await prisma.wishlist.findFirst({
        where: {
            userId,
            productId,
        },
    });

    if (existingItem) {
        throw new AppError('Product already in wishlist', 400);
    }

    // Add to wishlist
    const wishlistItem = await prisma.wishlist.create({
        data: {
            userId,
            productId,
        },
        select: {
            id: true,
            productId: true,
            createdAt: true,
        },
    });

    // Invalidate cache
    await invalidateWishlistCache(userId);

    res.status(201).json({
        success: true,
        message: 'Product added to wishlist',
        data: wishlistItem,
    });
});

/**
 * @desc    Remove product from wishlist
 * @route   DELETE /api/wishlist/:productId
 * @access  Private
 */
export const removeFromWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    if (!productId) {
        throw new AppError('Product ID is required', 400);
    }

    // Find and delete wishlist item
    const wishlistItem = await prisma.wishlist.findFirst({
        where: {
            userId,
            productId,
        },
    });

    if (!wishlistItem) {
        throw new AppError('Product not found in wishlist', 404);
    }

    await prisma.wishlist.delete({
        where: { id: wishlistItem.id },
    });

    // Invalidate cache
    await invalidateWishlistCache(userId);

    res.status(200).json({
        success: true,
        message: 'Product removed from wishlist',
    });
});

/**
 * @desc    Clear all items from wishlist
 * @route   DELETE /api/wishlist
 * @access  Private
 */
export const clearWishlist = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    // Delete all wishlist items for user
    const result = await prisma.wishlist.deleteMany({
        where: { userId },
    });

    // Invalidate cache
    await invalidateWishlistCache(userId);

    res.status(200).json({
        success: true,
        message: 'Wishlist cleared successfully',
        deletedCount: result.count,
    });
});

/**
 * @desc    Check if product is in wishlist
 * @route   GET /api/wishlist/check/:productId
 * @access  Private
 */
export const checkWishlistItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.params;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    if (!productId) {
        throw new AppError('Product ID is required', 400);
    }

    const redisClient = getRedisClient();
    const itemKey = getWishlistItemKey(userId, productId);

    // Try cache first for quick check
    if (redisClient) {
        try {
            const cachedResult = await redisClient.get(itemKey);
            if (cachedResult !== null) {
                res.status(200).json({
                    success: true,
                    source: 'cache',
                    inWishlist: cachedResult === 'true',
                });
                return;
            }
        } catch (error) {
            console.error('Redis get error:', error);
        }
    }

    // Check database
    const wishlistItem = await prisma.wishlist.findFirst({
        where: {
            userId,
            productId,
        },
    });

    const inWishlist = !!wishlistItem;

    // Cache the result
    if (redisClient) {
        try {
            await redisClient.setex(itemKey, CACHE_TTL, inWishlist ? 'true' : 'false');
        } catch (error) {
            console.error('Redis set error:', error);
        }
    }

    res.status(200).json({
        success: true,
        source: 'database',
        inWishlist,
    });
    return;
});

/**
 * @desc    Get wishlist count for user
 * @route   GET /api/wishlist/count
 * @access  Private
 */
export const getWishlistCount = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    const redisClient = getRedisClient();
    const countKey = `${CACHE_PREFIX}user:${userId}:count`;

    try {
        // Try cache first
        if (redisClient) {
            const cachedCount = await redisClient.get(countKey);
            if (cachedCount !== null) {
                res.status(200).json({
                    success: true,
                    source: 'cache',
                    count: parseInt(cachedCount, 10),
                });
                return;
            }
        }

        // Get from database
        const count = await prisma.wishlist.count({
            where: { userId },
        });

        // Cache the count
        if (redisClient) {
            await redisClient.setex(countKey, CACHE_TTL, count.toString());
        }

        res.status(200).json({
            success: true,
            source: 'database',
            count,
        });
    } catch (error) {
        console.error('Error fetching wishlist count:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while fetching the wishlist count',
        });
    }
});

/**
 * @desc    Toggle product in wishlist (add if not present, remove if present)
 * @route   POST /api/wishlist/toggle
 * @access  Private
 */
export const toggleWishlistItem = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user?.id;
    const { productId } = req.body;

    if (!userId) {
        throw new AppError('User not authenticated', 401);
    }

    if (!productId) {
        throw new AppError('Product ID is required', 400);
    }

    // Check if product is in wishlist
    const existingItem = await prisma.wishlist.findFirst({
        where: {
            userId,
            productId,
        },
    });

    let action: 'added' | 'removed';
    let data = null;

    if (existingItem) {
        // Remove from wishlist
        await prisma.wishlist.delete({
            where: { id: existingItem.id },
        });
        action = 'removed';
    } else {
        // Add to wishlist
        const wishlistItem = await prisma.wishlist.create({
            data: {
                userId,
                productId,
            },
            select: {
                id: true,
                productId: true,
                createdAt: true,
            },
        });
        action = 'added';
        data = wishlistItem;
    }

    // Invalidate cache
    await invalidateWishlistCache(userId);

    res.status(200).json({
        success: true,
        action,
        message: `Product ${action} ${action === 'added' ? 'to' : 'from'} wishlist`,
        data,
    });
});

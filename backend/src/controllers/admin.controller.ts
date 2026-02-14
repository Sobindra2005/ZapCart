import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';

/**
 * Get all users with pagination and sorting
 * @route GET /api/admin/users
 * @access Private/Admin
 */
export const getUsersList = asyncHandler(async (req: Request, res: Response) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'newest';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
        throw new AppError('Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100.', 400);
    }

    const start = (page - 1) * limit;

    // Determine sort order
    let orderBy: any;
    switch (sortBy) {
        case 'newest':
            orderBy = { createdAt: 'desc' };
            break;
        case 'name':
            orderBy = { firstName: 'asc' };
            break;
        default:
            orderBy = { createdAt: 'desc' };
    }

    // Fetch users with pagination
    const [users, totalCount] = await Promise.all([
        prisma.user.findMany({
            skip: start,
            take: limit,
            orderBy,
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                phone: true,
                role: true,
                status: true,
                emailVerified: true,
                lastLogin: true,
                createdAt: true,
                updatedAt: true,
                avatar: true,
                orders: {
                    select: {
                        id: true,
                        orderNumber: true,
                        status: true,
                        totalAmount: true,
                        createdAt: true,
                        updatedAt: true,
                    },
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
                _count: {
                    select: {
                        orders: true,
                        addresses: true,
                    },
                },
            },
        }),
        prisma.user.count(),
    ]);

    // Calculate total spent for each user
    const usersWithTotalSpent = users.map(user => {
        const totalSpent = user.orders.reduce((sum, order) => {
            return sum + Number(order.totalAmount);
        }, 0);

        return {
            ...user,
            totalSpent,
        };
    });

    res.status(200).json({
        status: 'success',
        results: usersWithTotalSpent.length,
        pagination: {
            page,
            limit,
            total: totalCount,
            hasMore: page * limit < totalCount,
        },
        data: {
            users: usersWithTotalSpent,
        },
    });
});

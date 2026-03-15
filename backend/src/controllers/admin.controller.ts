import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';

/**
 * Get all users with pagination, search, and advanced sorting
 * @route GET /api/admin/users
 * @access Private/Admin
 * @queryParams {number} page - Page number (default: 1)
 * @queryParams {number} limit - Results per page (default: 10, max: 100)
 * @queryParams {string} search - Search across firstName, lastName, email, phone
 * @queryParams {string} sortBy - Sort field: newest, firstName, email, phone, spent, status, role
 * @queryParams {string} sortOrder - Sort order: asc, desc (default: desc)
 * 
 * Special sorting behaviors:
 * - status: active -> suspended -> deleted
 * - role: SUPER_ADMIN -> ADMIN -> CUSTOMER  
 * - spent: Total amount spent by user (calculated from orders)
 */
export const getUsersList = asyncHandler(async (req: Request, res: Response) => {
    // Parse pagination parameters
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const sortBy = req.query.sortBy as string || 'newest';
    const sortOrder = req.query.sortOrder as string || 'desc';
    const search = req.query.search as string || '';

    // Validate pagination parameters
    if (page < 1 || limit < 1 || limit > 100) {
        throw new AppError('Invalid pagination parameters. Page must be >= 1 and limit must be between 1 and 100.', 400);
    }

    // Validate sort order
    if (!['asc', 'desc'].includes(sortOrder)) {
        throw new AppError('Invalid sort order. Must be "asc" or "desc".', 400);
    }

    const start = (page - 1) * limit;

    // Build search conditions
    const searchConditions = search ? {
        OR: [
            { firstName: { contains: search, mode: 'insensitive' as const } },
            { lastName: { contains: search, mode: 'insensitive' as const } },
            { email: { contains: search, mode: 'insensitive' as const } },
            { phone: { contains: search, mode: 'insensitive' as const } },
        ],
    } : {};

    // Determine sort order
    let orderBy: {
        [key: string]: string;
    } | Array<{ [key: string]: string }> = { createdAt: 'desc' }; // Default sorting
    switch (sortBy) {
        case 'newest':
            orderBy = { createdAt: sortOrder };
            break;
        case 'firstName':
            orderBy = { firstName: sortOrder };
            break;
        case 'email':
            orderBy = { email: sortOrder };
            break;
        case 'phone':
            orderBy = { phone: sortOrder };
            break;
        case 'status':
            // Custom status ordering: active -> suspended -> deleted
            if (sortOrder === 'asc') {
                orderBy = [
                    { status: 'asc' }, // This will be handled after fetching for custom order
                ];
            } else {
                orderBy = [
                    { status: 'desc' },
                ];
            }
            break;
        case 'role':
            // Custom role ordering will be handled after fetching
            orderBy = [
                { role: sortOrder === 'asc' ? 'asc' : 'desc' },
            ];
            break;
        case 'spent':
            // For spent sorting, we'll need to fetch all and sort in memory
            // or use a more complex query. For now, we'll sort after fetching.
            orderBy = { createdAt: 'desc' }; // Default order for fetching
            break;
        default:
            orderBy = { createdAt: 'desc' };
    }

    // For sorting by spent, we need to fetch more users and sort in memory
    // For other complex sorts, we'll handle post-fetch as well
    const needsCustomSorting = ['spent', 'status', 'role'].includes(sortBy);

    let fetchLimit: number | undefined = limit;
    let fetchSkip = start;

    if (needsCustomSorting) {
        // For custom sorting, we need to fetch more data to sort properly
        // We'll fetch all matching records and then paginate
        fetchLimit = undefined; // Fetch all and sort in memory
        fetchSkip = 0;
    }

    // Fetch users with search and basic sorting
    const [allUsers, totalCount] = await Promise.all([
        prisma.user.findMany({
            where: searchConditions,
            skip: fetchSkip,
            ...(fetchLimit && { take: fetchLimit }),
            ...(needsCustomSorting ? {} : { orderBy }),
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
        prisma.user.count({ where: searchConditions }),
    ]);

    // Calculate total spent for each user
    let usersWithTotalSpent = allUsers.map(user => {
        const totalSpent = user.orders.reduce((sum, order) => {
            return sum + Number(order.totalAmount);
        }, 0);

        return {
            ...user,
            totalSpent,
        };
    });

    // Apply custom sorting if needed
    if (needsCustomSorting) {
        switch (sortBy) {
            case 'spent': {
                usersWithTotalSpent.sort((a, b) => {
                    return sortOrder === 'asc'
                        ? a.totalSpent - b.totalSpent
                        : b.totalSpent - a.totalSpent;
                });
                break;
            }
            case 'status': {
                const statusOrder = { 'active': 0, 'suspended': 1, 'deleted': 2 };
                usersWithTotalSpent.sort((a, b) => {
                    const aOrder = statusOrder[a.status as keyof typeof statusOrder] ?? 3;
                    const bOrder = statusOrder[b.status as keyof typeof statusOrder] ?? 3;
                    return sortOrder === 'asc' ? aOrder - bOrder : bOrder - aOrder;
                });
                break;
            }
            case 'role': {
                const roleOrder = { 'SUPER_ADMIN': 0, 'ADMIN': 1, 'CUSTOMER': 2 };
                usersWithTotalSpent.sort((a, b) => {
                    const aOrder = roleOrder[a.role as keyof typeof roleOrder] ?? 3;
                    const bOrder = roleOrder[b.role as keyof typeof roleOrder] ?? 3;
                    return sortOrder === 'asc' ? aOrder - bOrder : bOrder - aOrder;
                });
                break;
            }
        }

        // Apply pagination after sorting
        usersWithTotalSpent = usersWithTotalSpent.slice(start, start + limit);
    } else if (!needsCustomSorting) {
        // Apply the database-level sorting that was already done
        usersWithTotalSpent.sort((a, b) => {
            switch (sortBy) {
                case 'firstName': {
                    const firstNameCompare = a.firstName.localeCompare(b.firstName);
                    return sortOrder === 'asc' ? firstNameCompare : -firstNameCompare;
                }
                case 'email': {
                    const emailCompare = a.email.localeCompare(b.email);
                    return sortOrder === 'asc' ? emailCompare : -emailCompare;
                }
                case 'phone': {
                    const phoneCompare = (a.phone || '').localeCompare(b.phone || '');
                    return sortOrder === 'asc' ? phoneCompare : -phoneCompare;
                }
                default:
                    return 0; // Keep original order for other sorts
            }
        });
    }

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
        searchApplied: !!search,
        sortApplied: { sortBy, sortOrder },
    });
});
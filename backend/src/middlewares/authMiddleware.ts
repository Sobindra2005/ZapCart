import { Request, Response, NextFunction } from 'express';
import { PrismaClient, UserStatus } from '@/generated/prisma';
import { verifyAccessToken, JwtPayload } from '@/utils/jwtUtils';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';

const prisma = new PrismaClient();

/**
 * Extend Express Request interface to include user
 */
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
                role: string;
                status: UserStatus;
            };
        }
    }
}

/**
 * Middleware to protect routes by verifying JWT access token
 * Attaches authenticated user to request object
 */
export const protect = asyncHandler(async (req: Request, _res: Response, next: NextFunction) => {
    // 1. Get token from Authorization header
    let token: string | undefined;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        throw new AppError('You are not logged in. Please log in to access this resource.', 401);
    }

    // 2. Verify token
    let decoded: JwtPayload;
    try {
        decoded = verifyAccessToken(token);
    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes('expired')) {
                throw new AppError('Your session has expired. Please log in again.', 401);
            }
            throw new AppError('Invalid token. Please log in again.', 401);
        }
        throw error;
    }

    // 3. Check if user still exists
    const user = await prisma.user.findUnique({
        where: { id: decoded.userId },
        select: {
            id: true,
            email: true,
            role: true,
            status: true,
        },
    });

    if (!user) {
        throw new AppError('The user belonging to this token no longer exists.', 401);
    }

    // 4. Check if user account is active
    if (user.status !== UserStatus.ACTIVE) {
        throw new AppError(
            `Your account is ${user.status.toLowerCase()}. Please contact support.`,
            403
        );
    }

    // 5. Attach user to request object
    req.user = user;

    next();
});

/**
 * Middleware to restrict access to specific roles
 * Must be used after the protect middleware
 * @param roles - Allowed user roles
 */
export const restrictTo = (...roles: string[]) => {
    return (req: Request, _res: Response, next: NextFunction) => {
        if (!req.user) {
            throw new AppError('You must be logged in to access this resource.', 401);
        }

        if (!roles.includes(req.user.role)) {
            throw new AppError('You do not have permission to perform this action.', 403);
        }

        next();
    };
};

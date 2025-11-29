import { Request, Response } from 'express';
import { PrismaClient, UserStatus, UserRole } from '@/generated/prisma';
import { hashPassword, comparePassword } from '@/utils/passwordUtils';
import {
    generateAccessToken,
    generateRefreshToken,
    verifyRefreshToken,
    calculateExpirationDate,
} from '@/utils/jwtUtils';
import config from '@/config/env';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';

const prisma = new PrismaClient();

/**
 * User signup/registration
 * POST /api/v1/auth/signup
 */
export const signup = asyncHandler(async (req: Request, res: Response) => {
    const { email, password, firstName, lastName, phone } = req.body;

    // 1. Validate required fields
    if (!email || !password || !firstName || !lastName) {
        throw new AppError('Please provide email, password, first name, and last name', 400);
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new AppError('Please provide a valid email address', 400);
    }

    // 3. Validate password strength
    if (password.length < 8) {
        throw new AppError('Password must be at least 8 characters long', 400);
    }

    // 4. Check if user already exists
    const existingUser = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });

    if (existingUser) {
        throw new AppError('A user with this email already exists', 409);
    }

    // 5. Hash password
    const hashedPassword = await hashPassword(password);

    // 6. Create user
    const user = await prisma.user.create({
        data: {
            email: email.toLowerCase(),
            password: hashedPassword,
            firstName,
            lastName,
            phone: phone || null,
            role: UserRole.CUSTOMER,
            status: UserStatus.ACTIVE,
        },
        select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            phone: true,
            role: true,
            status: true,
            emailVerified: true,
            createdAt: true,
        },
    });

    // 7. Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // 8. Store refresh token in database
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: calculateExpirationDate(config.jwtRefreshExpiration),
        },
    });

    // 9. Send response
    res.status(201).json({
        status: 'success',
        message: 'User registered successfully',
        data: {
            user,
            tokens: {
                accessToken,
                refreshToken,
                accessTokenExpiresIn: config.jwtAccessExpiration,
                refreshTokenExpiresIn: config.jwtRefreshExpiration,
            },
        },
    });
});

/**
 * User login
 * POST /api/v1/auth/login
 */
export const login = asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = req.body;

    // 1. Validate required fields
    if (!email || !password) {
        throw new AppError('Please provide email and password', 400);
    }

    // 2. Find user by email
    const user = await prisma.user.findUnique({
        where: { email: email.toLowerCase() },
    });

    // 3. Check if user exists and password is correct
    if (!user || !(await comparePassword(password, user.password))) {
        throw new AppError('Invalid email or password', 401);
    }

    // 4. Check if user account is active
    if (user.status !== UserStatus.ACTIVE) {
        throw new AppError(
            `Your account is ${user.status.toLowerCase()}. Please contact support.`,
            403
        );
    }

    // 5. Update last login timestamp
    await prisma.user.update({
        where: { id: user.id },
        data: { lastLogin: new Date() },
    });

    // 6. Generate tokens
    const accessToken = generateAccessToken(user.id, user.role);
    const refreshToken = generateRefreshToken(user.id);

    // 7. Store refresh token in database
    await prisma.refreshToken.create({
        data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: calculateExpirationDate(config.jwtRefreshExpiration),
        },
    });

    // 8. Prepare user data (exclude password)
    const { password: _, ...userWithoutPassword } = user;

    // 9. Send response
    res.status(200).json({
        status: 'success',
        message: 'Login successful',
        data: {
            user: userWithoutPassword,
            tokens: {
                accessToken,
                refreshToken,
                accessTokenExpiresIn: config.jwtAccessExpiration,
                refreshTokenExpiresIn: config.jwtRefreshExpiration,
            },
        },
    });
});

/**
 * Refresh access token using refresh token
 * POST /api/v1/auth/refresh-token
 */
export const refreshAccessToken = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    // 1. Validate refresh token is provided
    if (!refreshToken) {
        throw new AppError('Please provide a refresh token', 400);
    }

    // 2. Verify refresh token signature
    await verifyRefreshToken(refreshToken);

    // 3. Check if refresh token exists in database and is not expired
    const storedToken = await prisma.refreshToken.findUnique({
        where: { token: refreshToken },
        include: { user: true },
    });

    if (!storedToken) {
        throw new AppError('Invalid refresh token. Please log in again.', 401);
    }

    if (new Date() > storedToken.expiresAt) {
        // Delete expired token
        await prisma.refreshToken.delete({
            where: { id: storedToken.id },
        });
        throw new AppError('Refresh token has expired. Please log in again.', 401);
    }

    // 4. Check if user still exists and is active
    const user = storedToken.user;
    if (!user) {
        throw new AppError('User no longer exists', 401);
    }

    if (user.status !== UserStatus.ACTIVE) {
        throw new AppError(
            `Your account is ${user.status.toLowerCase()}. Please contact support.`,
            403
        );
    }

    // 5. Generate new access token
    const newAccessToken = generateAccessToken(user.id, user.role);

    // 6. Send response
    res.status(200).json({
        status: 'success',
        message: 'Access token refreshed successfully',
        data: {
            accessToken: newAccessToken,
            accessTokenExpiresIn: config.jwtAccessExpiration,
        },
    });
});

/**
 * User logout (invalidate refresh token)
 * POST /api/v1/auth/logout
 */
export const logout = asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = req.body;

    // 1. Validate refresh token is provided
    if (!refreshToken) {
        throw new AppError('Please provide a refresh token', 400);
    }

    // 2. Delete refresh token from database
    const deletedToken = await prisma.refreshToken.deleteMany({
        where: { token: refreshToken },
    });

    if (deletedToken.count === 0) {
        throw new AppError('Invalid refresh token', 400);
    }

    // 3. Send response
    res.status(200).json({
        status: 'success',
        message: 'Logged out successfully',
    });
});

import jwt from 'jsonwebtoken';
import config from '@/config/env';

/**
 * Payload structure for JWT tokens
 */
export interface JwtPayload {
    userId: number;
    role?: string;
    iat?: number;
    exp?: number;
}

/**
 * Generate an access token for a user
 * @param userId - User ID
 * @param role - User role
 * @returns JWT access token string
 */
export const generateAccessToken = (userId: number, role: string): string => {
    return jwt.sign(
        { userId, role },
        config.jwtSecret,
        { expiresIn: config.jwtAccessExpiration } as jwt.SignOptions
    );
};

/**
 * Generate a refresh token for a user
 * @param userId - User ID
 * @returns JWT refresh token string
 */
export const generateRefreshToken = (userId: number): string => {
    return jwt.sign(
        { userId },
        config.jwtSecret,
        { expiresIn: config.jwtRefreshExpiration } as jwt.SignOptions
    );
};

/**
 * Verify and decode an access token
 * @param token - JWT access token
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyAccessToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Access token has expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid access token');
        }
        throw error;
    }
};

/**
 * Verify and decode a refresh token
 * @param token - JWT refresh token
 * @returns Decoded token payload
 * @throws Error if token is invalid or expired
 */
export const verifyRefreshToken = (token: string): JwtPayload => {
    try {
        return jwt.verify(token, config.jwtSecret) as JwtPayload;
    } catch (error) {
        if (error instanceof jwt.TokenExpiredError) {
            throw new Error('Refresh token has expired');
        }
        if (error instanceof jwt.JsonWebTokenError) {
            throw new Error('Invalid refresh token');
        }
        throw error;
    }
};

/**
 * Calculate expiration date from JWT expiration string
 * @param expirationString - Expiration string (e.g., '7d', '15m')
 * @returns Date object representing the expiration time
 */
export const calculateExpirationDate = (expirationString: string): Date => {
    const now = new Date();
    const match = expirationString.match(/^(\d+)([smhd])$/);

    if (!match) {
        throw new Error('Invalid expiration format');
    }

    const value = parseInt(match[1], 10);
    const unit = match[2];

    switch (unit) {
        case 's':
            return new Date(now.getTime() + value * 1000);
        case 'm':
            return new Date(now.getTime() + value * 60 * 1000);
        case 'h':
            return new Date(now.getTime() + value * 60 * 60 * 1000);
        case 'd':
            return new Date(now.getTime() + value * 24 * 60 * 60 * 1000);
        default:
            throw new Error('Invalid expiration unit');
    }
};

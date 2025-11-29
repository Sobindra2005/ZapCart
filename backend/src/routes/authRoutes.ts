import express from 'express';
import { signup, login, refreshAccessToken, logout } from '@/controllers/authController';

const router = express.Router();

/**
 * Authentication routes
 */

/**
 * @route   POST /api/v1/auth/signup
 * @desc    Register a new user
 * @access  Public
 */
router.post('/signup', signup);

/**
 * @route   POST /api/v1/auth/login
 * @desc    Login user and return tokens
 * @access  Public
 */
router.post('/login', login);

/**
 * @route   POST /api/v1/auth/refresh-token
 * @desc    Refresh access token using refresh token
 * @access  Public
 */
router.post('/refresh-token', refreshAccessToken);

/**
 * @route   POST /api/v1/auth/logout
 * @desc    Logout user and invalidate refresh token
 * @access  Public
 */
router.post('/logout', logout);

export default router;

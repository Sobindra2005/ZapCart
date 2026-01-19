import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';

/**
 * Create a new address
 * POST /api/v1/addresses
 */
export const createAddress = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, phone, address, city, state, country, postalCode, isDefault, location } = req.body;
    const userId = req.user!.id;

    // 1. Validate required fields
    if (!fullName || !phone || !address || !city || !state || !country || !postalCode) {
        throw new AppError('Please provide all required address fields', 400);
    }

    // 2. If isDefault is true, unset other default addresses for this user
    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }

    // 3. Create address
    const addressRes = await prisma.address.create({
        data: {
            userId,
            fullName,
            phone,
            address,
            city,
            state,
            country,
            postalCode,
            isDefault: isDefault || false,
            location
        },
    });

    res.status(201).json({
        status: 'success',
        data: { address: addressRes },
    });
});

/**
 * Get all addresses for the logged-in user
 * GET /api/v1/addresses
 */
export const getAllAddresses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;

    const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
        status: 'success',
        results: addresses.length,
        data: { addresses },
    });
});

/**
 * Get a specific address
 * GET /api/v1/addresses/:id
 */
export const getAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const address = await prisma.address.findUnique({
        where: { id: Number(id) },
    });

    if (!address) {
        throw new AppError('Address not found', 404);
    }

    // Ensure the address belongs to the user
    if (address.userId !== userId) {
        throw new AppError('You do not have permission to view this address', 403);
    }

    res.status(200).json({
        status: 'success',
        data: { address },
    });
});

/**
 * Update an address
 * PUT /api/v1/addresses/:id
 */
export const updateAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { fullName, phone, address, city, state, country, postalCode, isDefault, location } = req.body;
    const userId = req.user!.id;

    // 1. Check if address exists and belongs to user
    const existingAddress = await prisma.address.findUnique({
        where: { id: Number(id) },
    });

    if (!existingAddress) {
        throw new AppError('Address not found', 404);
    }

    if (existingAddress.userId !== userId) {
        throw new AppError('You do not have permission to update this address', 403);
    }

    // 2. If setting as default, unset other default addresses
    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true, id: { not: Number(id) } },
            data: { isDefault: false },
        });
    }

    // 3. Update address
    const updatedAddress = await prisma.address.update({
        where: { id: Number(id) },
        data: {
            fullName,
            phone,
            address,
            city,
            state,
            country,
            postalCode,
            isDefault,
            location,
        }
    });

    res.status(200).json({
        status: 'success',
        data: { address: updatedAddress },
    });
});

/**
 * Delete an address
 * DELETE /api/v1/addresses/:id
 */
export const deleteAddress = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    // 1. Check if address exists and belongs to user
    const existingAddress = await prisma.address.findUnique({
        where: { id: Number(id) },
    });

    if (!existingAddress) {
        throw new AppError('Address not found', 404);
    }

    if (existingAddress.userId !== userId) {
        throw new AppError('You do not have permission to delete this address', 403);
    }

    // 2. Delete address
    await prisma.address.delete({
        where: { id: Number(id) },
    });

    res.status(204).json({
        status: 'success',
        data: null,
    });
});


export const getUserAddresses = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const addresses = await prisma.address.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
    });

    res.status(200).json({
        status: 'success',
        results: addresses.length,
        data: { addresses },
    });
});
import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';

/**
 * Calculate distance between two coordinates using Haversine formula
 * Returns distance in kilometers
 */
function calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
}

/**
 * Find nearby address within specified radius (default 0.5 km / 500 meters)
 */
async function findNearbyAddress(
    userId: number,
    latitude: number,
    longitude: number,
    radiusKm: number = 0.5
) {
    const userAddresses = await prisma.address.findMany({
        where: { userId },
    });

    for (const addr of userAddresses) {
        if (addr.location && typeof addr.location === 'object') {
            const locData = addr.location as { latitude: number; longitude: number };
            const distance = calculateDistance(
                latitude,
                longitude,
                locData.latitude,
                locData.longitude
            );

            if (distance <= radiusKm) {
                return { address: addr, distance };
            }
        }
    }

    return null;
}

/**
 * Create a new address
 * POST /api/v1/addresses
 * 
 * If location (latitude/longitude) is provided, checks for nearby addresses.
 * If a nearby address exists, updates it instead of creating a new one.
 */
export const createAddress = asyncHandler(async (req: Request, res: Response) => {
    const { fullName, phone, address, city, state, country, postalCode, isDefault, location } = req.body;
    const userId = req.user!.id;

    // 1. Validate required fields
    if (!fullName || !phone || !address || !city || !state || !country || !postalCode) {
        throw new AppError('Please provide all required address fields', 400);
    }

    // 2. Check if location is provided and has valid coordinates
    let nearbyAddressResult = null;
    if (location && typeof location === 'object') {
        const { latitude, longitude } = location as { latitude: number; longitude: number };

        if (latitude !== undefined && longitude !== undefined) {
            // Check for nearby address within 500 meters (0.5 km)
            nearbyAddressResult = await findNearbyAddress(userId, latitude, longitude, 0.5);
        }
    }

    // 3. If nearby address exists, update it instead of creating new one
    if (nearbyAddressResult) {
        const { address: nearbyAddr } = nearbyAddressResult;

        // Update the nearby address
        const updatedAddress = await prisma.address.update({
            where: { id: nearbyAddr.id },
            data: {
                fullName,
                phone,
                address,
                city,
                state,
                country,
                postalCode,
                location,
                // Only update isDefault if explicitly provided
                ...(isDefault !== undefined && { isDefault }),
            },
        });

        res.status(200).json({
            status: 'success',
            message: 'Nearby address found and updated instead of creating new one',
            data: { address: updatedAddress, isUpdate: true },
        });
        return;
    }

    // 4. If isDefault is true, unset other default addresses for this user
    if (isDefault) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true },
            data: { isDefault: false },
        });
    }

    // 5. Create new address
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
            location,
        },
    });

    res.status(201).json({
        status: 'success',
        data: { address: addressRes, isUpdate: false },
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
    if (isDefault === true) {
        await prisma.address.updateMany({
            where: { userId, isDefault: true, id: { not: Number(id) } },
            data: { isDefault: false },
        });
    }

    // 3. Update address
    const updatedAddress = await prisma.address.update({
        where: { id: Number(id) },
        data: {
            ...(fullName && { fullName }),
            ...(phone && { phone }),
            ...(address && { address }),
            ...(city && { city }),
            ...(state && { state }),
            ...(country && { country }),
            ...(postalCode && { postalCode }),
            ...(isDefault !== undefined && { isDefault }),
            ...(location && { location }),
        },
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
        orderBy: { updatedAt: 'desc' },
    });

    res.status(200).json({
        status: 'success',
        results: addresses.length,
        data: { addresses },
    });
});
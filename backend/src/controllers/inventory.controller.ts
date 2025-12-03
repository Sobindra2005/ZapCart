import { Request, Response } from 'express';
import { prisma } from '@/config/prisma';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';
import { InventoryAction } from '@/generated/prisma';

/**
 * Get Inventory for a Product
 * GET /api/v1/inventory/:productId
 */
export const getInventory = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    const inventory = await prisma.inventory.findUnique({
        where: { productId },
    });

    if (!inventory) {
        // Returning 0 is often safer for UI.
        res.status(200).json({
            status: 'success',
            data: {
                inventory: {
                    productId,
                    quantityInStock: 0,
                    availableQuantity: 0,
                    reservedQuantity: 0,
                }
            },
        });
        return;
    }

    res.status(200).json({
        status: 'success',
        data: { inventory },
    });
});

/**
 * Update Inventory (Admin)
 * PUT /api/v1/inventory/:productId
 */
export const updateInventory = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const { action, quantity, reason, sku } = req.body;
    const userId = req.user!.id;

    if (!action || !quantity || isNaN(Number(quantity))) {
        throw new AppError('Please provide action and valid quantity', 400);
    }

    const qty = Number(quantity);

    // Validate Action
    if (!Object.values(InventoryAction).includes(action)) {
        throw new AppError('Invalid inventory action', 400);
    }

    // Transaction to ensure consistency
    const inventory = await prisma.$transaction(async (tx) => {
        // 1. Find or Create Inventory Record
        let inv = await tx.inventory.findUnique({ where: { productId } });

        if (!inv) {
            if (!sku) throw new AppError('SKU is required for new inventory record', 400);

            inv = await tx.inventory.create({
                data: {
                    productId,
                    sku,
                    quantityInStock: 0,
                    availableQuantity: 0,
                }
            });
        }

        // 2. Calculate New Quantities
        let quantityChange = 0;
        let newInStock = inv.quantityInStock;
        let newAvailable = inv.availableQuantity;

        switch (action) {
            case InventoryAction.PURCHASE:
            case InventoryAction.RETURN:
            case InventoryAction.ADJUSTMENT: // Assuming adjustment adds stock if positive
                quantityChange = qty;
                newInStock += qty;
                newAvailable += qty;
                break;
            case InventoryAction.DAMAGE:
            case InventoryAction.TRANSFER:
                quantityChange = -qty;
                newInStock -= qty;
                newAvailable -= qty;
                break;
            default:
                throw new AppError('Action not supported via this endpoint', 400);
        }

        if (newInStock < 0) {
            throw new AppError('Insufficient stock for this operation', 400);
        }

        // 3. Update Inventory
        const updatedInv = await tx.inventory.update({
            where: { id: inv.id },
            data: {
                quantityInStock: newInStock,
                availableQuantity: newAvailable,
            }
        });

        // 4. Create Log
        await tx.inventoryLog.create({
            data: {
                inventoryId: inv.id,
                action: action as InventoryAction,
                quantityChange,
                quantityBefore: inv.quantityInStock,
                quantityAfter: newInStock,
                reason,
                performedBy: userId,
            }
        });

        return updatedInv;
    });

    res.status(200).json({
        status: 'success',
        data: { inventory },
    });
});

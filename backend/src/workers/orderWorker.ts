import { Worker, Job } from 'bullmq';
import { config } from '@/config/env';
import { QueueName } from '@/config/queue';
import { prisma } from '@/config/prisma';
import { OrderStatus, InventoryAction } from '@/generated/prisma';

interface OrderJobData {
    orderId: number;
    action: 'PROCESS_ORDER';
}

const workerOptions = {
    connection: {
        host: config.redisHost,
        port: config.redisPort,
    },
    concurrency: 5,
};

export const orderWorker = new Worker<OrderJobData>(
    QueueName.ORDER_QUEUE,
    async (job: Job<OrderJobData>) => {
        const { orderId, action } = job.data;
        console.log(`[OrderWorker] Processing job ${job.id} for order ${orderId} with action ${action}`);

        try {
            if (action === 'PROCESS_ORDER') {
                // Simulate processing delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // Update order status to CONFIRMED or PROCESSING
                // For now, we'll just log it. In a real app, we might reserve inventory here.

                const order = await prisma.order.findUnique({ where: { id: orderId } });
                if (!order) {
                    console.error(`[OrderWorker] Order ${orderId} not found`);
                    return;
                }

                if (order.status === OrderStatus.PENDING) {
                    await prisma.$transaction(async (tx) => {
                        // 1. Update Order Status
                        await tx.order.update({
                            where: { id: orderId },
                            data: { status: OrderStatus.CONFIRMED }
                        });

                        // 2. Finalize Inventory (Move from Reserved to Sold)
                        const orderItems = await tx.orderItem.findMany({
                            where: { orderId },
                        });

                        for (const item of orderItems) {
                            const inventory = await tx.inventory.findUnique({
                                where: { productId: item.productId },
                            });

                            if (inventory) {
                                await tx.inventory.update({
                                    where: { id: inventory.id },
                                    data: {
                                        reservedQuantity: { decrement: item.quantity },
                                        quantityInStock: { decrement: item.quantity },
                                    },
                                });

                                await tx.inventoryLog.create({
                                    data: {
                                        inventoryId: inventory.id,
                                        action: InventoryAction.SALE,
                                        quantityChange: -item.quantity,
                                        quantityBefore: inventory.quantityInStock,
                                        quantityAfter: inventory.quantityInStock - item.quantity,
                                        reason: `Order ${order.orderNumber} Confirmed`,
                                        orderItemId: item.id,
                                    },
                                });
                            }
                        }
                    });
                    console.log(`[OrderWorker] Order ${orderId} status updated to CONFIRMED and inventory deducted`);
                }
            }
        } catch (error) {
            console.error(`[OrderWorker] Failed to process job ${job.id}:`, error);
            throw error;
        }
    },
    workerOptions
);

orderWorker.on('completed', (job) => {
    console.log(`[OrderWorker] Job ${job.id} completed successfully`);
});

orderWorker.on('failed', (job, err) => {
    console.error(`[OrderWorker] Job ${job?.id} failed with error: ${err.message}`);
});

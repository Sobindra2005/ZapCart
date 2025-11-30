import { Queue, QueueOptions } from 'bullmq';
import { config } from './env';

const connection = {
    host: config.redisHost,
    port: config.redisPort,
};

const defaultQueueOptions: QueueOptions = {
    connection,
    defaultJobOptions: {
        attempts: 3,
        backoff: {
            type: 'exponential',
            delay: 2000,
        },
        removeOnComplete: {
            age: 24 * 3600,
            count: 1000,
        },
        removeOnFail: {
            age: 7 * 24 * 3600,
        },
    },
};

// Queue names
export enum QueueName {
    SEARCH_INDEX = 'search-index-queue',
    ORDER_QUEUE = 'order-queue',
}

export const searchIndexQueue = new Queue(QueueName.SEARCH_INDEX, defaultQueueOptions);
export const orderQueue = new Queue(QueueName.ORDER_QUEUE, defaultQueueOptions);

export const closeAllQueues = async (): Promise<void> => {
    console.log('🛑 Closing all queues...');
    await Promise.all([
        searchIndexQueue.close(),
        orderQueue.close(),
    ]);
    console.log('✅ All queues closed');
};

export const queues = {
    searchIndex: searchIndexQueue,
    order: orderQueue,
};

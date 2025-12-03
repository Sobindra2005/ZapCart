import { PrismaClient } from '@/generated/prisma';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { config } from './env';

/**
 * Singleton instance of Prisma Client
 * Ensures only one instance is created and reused throughout the application
 */
class PrismaService {
    private static instance: PrismaClient | null = null;
    private static pool: Pool | null = null;

    /**
     * Get the singleton PrismaClient instance
     */
    public static getInstance(): PrismaClient {
        if (!PrismaService.instance) {
            // Create PostgreSQL connection pool
            PrismaService.pool = new Pool({
                connectionString: config.databaseUrl,
            });

            // Create Prisma adapter
            const adapter = new PrismaPg(PrismaService.pool);

            // Create Prisma Client with adapter
            PrismaService.instance = new PrismaClient({
                adapter,
                log: config.nodeEnv === 'development' 
                    ? ['query', 'error', 'warn'] 
                    : ['error'],
            });

            // Handle connection errors
            PrismaService.instance.$connect()
                .then(() => {
                    console.log('✅ Prisma connected to PostgreSQL');
                })
                .catch((error) => {
                    console.error('❌ Prisma connection failed:', error);
                    process.exit(1);
                });
        }

        return PrismaService.instance;
    }

    /**
     * Disconnect from the database
     */
    public static async disconnect(): Promise<void> {
        if (PrismaService.instance) {
            await PrismaService.instance.$disconnect();
            PrismaService.instance = null;
            console.log('✅ Prisma disconnected');
        }
        if (PrismaService.pool) {
            await PrismaService.pool.end();
            PrismaService.pool = null;
            console.log('✅ PostgreSQL pool closed');
        }
    }
}

// Export the singleton instance
export const prisma = PrismaService.getInstance();

// Export the service class for manual control if needed
export default PrismaService;

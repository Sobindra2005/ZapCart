import mongoose from 'mongoose';
import { config } from './env';
import { connectRedis, disconnectRedis } from './redis';

interface DatabaseConfig {
    uri: string;
    options: mongoose.ConnectOptions;
}

export class DatabaseConnection {
    private static instance: DatabaseConnection;
    private isConnected: boolean = false;
    private connectionPromise: Promise<typeof mongoose> | null = null;
    private config: DatabaseConfig;

    private constructor() {
        this.config = {
            uri: config.MONGODB_URL || 'mongodb://localhost:27017/ecommerce',
            options: {
                maxPoolSize: 10,
                minPoolSize: 2,
                serverSelectionTimeoutMS: 30000,
                socketTimeoutMS: 45000,
                connectTimeoutMS: 30000,
                heartbeatFrequencyMS: 10000,
                retryWrites: true,
                w: 'majority',
                bufferCommands: false,
            }
        };

        this.setupEventListeners();
        this.setupGracefulShutdown();
    }

    public static getInstance(): DatabaseConnection {
        if (!DatabaseConnection.instance) {
            DatabaseConnection.instance = new DatabaseConnection();
        }
        return DatabaseConnection.instance;
    }

    public async connect(): Promise<typeof mongoose> {
        if (this.isConnected) {
            return mongoose;
        }

        if (this.connectionPromise) {
            return this.connectionPromise;
        }

        this.connectionPromise = this.performConnection();

        try {
            await connectRedis();
        } catch (error) {
            console.error('⚠️  Redis connection failed, continuing without cache:', error);
        }

        return this.connectionPromise;
    }

    private async performConnection(): Promise<typeof mongoose> {
        try {
            mongoose.set('strictQuery', false);

            const connection = await mongoose.connect(this.config.uri, this.config.options);
            this.isConnected = true;
            console.log('✅ MongoDB connected successfully');

            return connection;
        } catch (error) {
            this.connectionPromise = null;
            console.error('❌ MongoDB connection error:', error);
            throw error;
        }
    }

    public async disconnect(): Promise<void> {
        try {
            if (this.isConnected) {
                await mongoose.disconnect();
                this.isConnected = false;
                this.connectionPromise = null;
                console.log('🔌 MongoDB disconnected');
            }

            await disconnectRedis();
        } catch (error) {
            console.error('❌ MongoDB disconnection error:', error);
            throw error;
        }
    }

    public async reconnect(): Promise<typeof mongoose> {
        await this.disconnect();
        return this.connect();
    }

    public getConnectionState(): number {
        return mongoose.connection.readyState;
    }

    public isHealthy(): boolean {
        return this.isConnected && mongoose.connection.readyState === 1;
    }

    private setupEventListeners(): void {
        mongoose.connection.on('connected', () => {
            this.isConnected = true;
            console.log('🔗 Mongoose connected to MongoDB');
        });

        mongoose.connection.on('error', (error) => {
            console.error('❌ Mongoose connection error:', error);
        });

        mongoose.connection.on('disconnected', () => {
            this.isConnected = false;
            console.log('🔌 Mongoose disconnected');
        });

        mongoose.connection.on('reconnected', () => {
            this.isConnected = true;
            console.log('🔄 Mongoose reconnected to MongoDB');
        });
    }

    private setupGracefulShutdown(): void {
        const shutdown = async (signal: string) => {
            console.log(`\n🛑 ${signal} received. Gracefully shutting down...`);
            try {
                await this.disconnect();
                process.exit(0);
            } catch (error) {
                console.error('❌ Error during shutdown:', error);
                process.exit(1);
            }
        };

        process.on('SIGINT', () => shutdown('SIGINT'));
        process.on('SIGTERM', () => shutdown('SIGTERM'));
    }
}

// Export singleton instance
export const database = DatabaseConnection.getInstance();

// Convenience functions for backward compatibility
export const connectDatabase = () => database.connect();
export const disconnectDatabase = () => database.disconnect();
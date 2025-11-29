import dotenv from 'dotenv';
import path from 'path';

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, '../../.env') });

/**
 * Validates that a required environment variable exists and returns its value
 * @param key - The environment variable key
 * @param defaultValue - Optional default value if not required
 * @returns The environment variable value
 * @throws Error if required variable is missing
 */
const getEnvVariable = (key: string, defaultValue?: string): string => {
    const value = process.env[key] || defaultValue;

    if (value === undefined) {
        throw new Error(
            `❌ Missing required environment variable: ${key}\n` +
            `Please ensure ${key} is defined in your .env file.\n` +
            `See .env.example for reference.`
        );
    }

    return value;
};

/**
 * Validates NODE_ENV is one of the allowed values
 */
const validateNodeEnv = (env: string): 'development' | 'production' | 'test' => {
    const allowedEnvs = ['development', 'production', 'test'];

    if (!allowedEnvs.includes(env)) {
        throw new Error(
            `❌ Invalid NODE_ENV: "${env}"\n` +
            `NODE_ENV must be one of: ${allowedEnvs.join(', ')}\n` +
            `Current value: ${env}`
        );
    }

    return env as 'development' | 'production' | 'test';
};

/**
 * Centralized configuration object with validated environment variables
 */
export const config = {
    // Server configuration
    port: parseInt(getEnvVariable('PORT', '8080'), 10),
    nodeEnv: validateNodeEnv(getEnvVariable('NODE_ENV', 'development')),

    // Database configuration
    databaseUrl: getEnvVariable('DATABASE_URL', 'mongodb://localhost:27017/ecommerce'),
    MONGODB_URL: getEnvVariable('MONGODB_URL', 'mongodb://localhost:27017/ecommerce'),

    //redis configuration
    redisHost: getEnvVariable('REDIS_HOST', '127.0.0.1'),
    redisPort: parseInt(getEnvVariable('REDIS_PORT', '6379'), 10),

    // API configuration
    apiVersion: 'v1',

    // JWT configuration
    jwtSecret: getEnvVariable('JWT_SECRET'),
    jwtAccessExpiration: getEnvVariable('JWT_ACCESS_EXPIRATION', '15m'),
    jwtRefreshExpiration: getEnvVariable('JWT_REFRESH_EXPIRATION', '7d'),

    // Security configuration
    rateLimitWindowMs: 15 * 60 * 1000, // 15 minutes
    rateLimitMaxRequests: 100, // limit each IP to 100 requests per windowMs
} as const;

/**
 * Validates all required environment variables on application startup
 * Call this function before starting the server
 */
export const validateEnv = (): void => {
    try {
        console.log('🔍 Validating environment variables...');

        // This will throw if any required variable is missing
        const requiredVars = ['PORT', 'NODE_ENV', 'DATABASE_URL', 'MONGODB_URL', 'REDIS_HOST', 'REDIS_PORT', 'JWT_SECRET'];

        requiredVars.forEach(key => {
            getEnvVariable(key);
        });

        console.log('✅ Environment variables validated successfully');
        console.log(`📊 Environment: ${config.nodeEnv}`);
        console.log(`🚀 Port: ${config.port}`);
    } catch (error) {
        console.error('❌ Environment validation failed:');
        console.error(error);
        process.exit(1);
    }
};

export default config;

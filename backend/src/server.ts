import app from './app';
import config, { validateEnv } from '@/config/env';

/**
 * Handle uncaught exceptions
 */
process.on('uncaughtException', (err: Error) => {
    console.error('💥 UNCAUGHT EXCEPTION! Shutting down...');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);
    console.error('Stack trace:', err.stack);
    process.exit(1);
});

/**
 * Validate environment variables before starting server
 */
validateEnv();

/**
 * Start the server
 */
const server = app.listen(config.port, () => {
    console.log('\n🎉 Server started successfully!');
    console.log(`📡 Listening on port: ${config.port}`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
    console.log(`🔗 Health check: http://localhost:${config.port}/health`);
    console.log(`🚀 API Base URL: http://localhost:${config.port}/api/${config.apiVersion}`);
    console.log('\n✨ Ready to accept requests!\n');
});

/**
 * Handle unhandled promise rejections
 */
process.on('unhandledRejection', (err: Error) => {
    console.error('💥 UNHANDLED REJECTION! Shutting down gracefully...');
    console.error('Error name:', err.name);
    console.error('Error message:', err.message);

    // Close server gracefully
    server.close(() => {
        console.log('🔴 Server closed');
        process.exit(1);
    });
});

/**
 * Handle graceful shutdown on SIGTERM
 */
process.on('SIGTERM', () => {
    console.log('👋 SIGTERM received. Shutting down gracefully...');
    server.close(() => {
        console.log('🔴 Process terminated');
    });
});

/**
 * Handle graceful shutdown on SIGINT (Ctrl+C)
 */
process.on('SIGINT', () => {
    console.log('\n👋 SIGINT received. Shutting down gracefully...');
    server.close(() => {
        console.log('🔴 Server closed');
        process.exit(0);
    });
});

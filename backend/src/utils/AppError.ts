/**
 * Custom error class for operational errors
 * Operational errors are predictable errors that should be handled gracefully
 * Examples: validation errors, not found errors, authentication errors, etc.
 */
class AppError extends Error {
    public readonly statusCode: number;
    public readonly status: string;
    public readonly isOperational: boolean;

    /**
     * Creates a new AppError instance
     * @param message - Error message to display to the user
     * @param statusCode - HTTP status code (default: 500)
     */
    constructor(message: string, statusCode: number = 500) {
        super(message);

        this.statusCode = statusCode;
        this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
        this.isOperational = true;

        // Maintains proper stack trace for where our error was thrown
        Error.captureStackTrace(this, this.constructor);
    }
}

export default AppError;

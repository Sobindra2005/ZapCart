import { Request, Response, NextFunction } from 'express';
import AppError from '@/utils/AppError';
import config from '@/config/env';

/**
 * Handles CastError from MongoDB (invalid ObjectId format)
 */
const handleCastError = (err: any): AppError => {
  const message = `Invalid ${err.path}: ${err.value}`;
  return new AppError(message, 400);
};

/**
 * Handles duplicate field errors from MongoDB
 */
const handleDuplicateFieldsError = (err: any): AppError => {
  const value = err.errmsg?.match(/(["'])(\\?.)*?\1/)?.[0];
  const message = `Duplicate field value: ${value}. Please use another value`;
  return new AppError(message, 400);
};

/**
 * Handles validation errors from MongoDB/Mongoose
 */
const handleValidationError = (err: any): AppError => {
  const errors = Object.values(err.errors).map((el: any) => el.message);
  const message = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(message, 400);
};

/**
 * Sends error response in development mode with full details
 */
const sendErrorDev = (err: AppError, res: Response): void => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: err.status || 'error',
    message: err.message,
    statusCode,
    stack: err.stack,
    error: err,
  });
};

/**
 * Sends error response in production mode with limited details
 * Only operational errors show their message to the user
 * Programming errors show a generic message
 */
const sendErrorProd = (err: AppError, res: Response): void => {
  const statusCode = err.statusCode || 500;

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    res.status(statusCode).json({
      status: err.status || 'error',
      message: err.message,
    });
  } 
  // Programming or unknown error: don't leak error details
  else {
    // Log error for debugging
    console.error('❌ ERROR:', err);

    // Send generic message
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong on the server',
    });
  }
};

/**
 * Global error handling middleware
 * Must be registered last in the middleware chain
 * Differentiates between operational and programming errors
 * Provides different responses for development and production
 */
const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): void => {
  // Set default values
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log all errors in development
  if (config.nodeEnv === 'development') {
    console.error('❌ Error occurred:');
    console.error('Message:', err.message);
    console.error('Status Code:', err.statusCode);
    console.error('Stack:', err.stack);
  } else {
    // In production, only log programming errors
    if (!err.isOperational) {
      console.error('❌ PROGRAMMING ERROR:', err);
    }
  }

  // Handle errors based on environment
  if (config.nodeEnv === 'development') {
    sendErrorDev(err, res);
  } else {
    let error = { ...err };
    error.message = err.message;

    // Handle specific error types
    if (err.name === 'CastError') error = handleCastError(error);
    if (err.code === 11000) error = handleDuplicateFieldsError(error);
    if (err.name === 'ValidationError') error = handleValidationError(error);

    sendErrorProd(error, res);
  }
};

export default errorHandler;

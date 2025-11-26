import { Request, Response, NextFunction } from 'express';

/**
 * Type definition for async request handler
 */
type AsyncRequestHandler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<any>;

/**
 * Wrapper function for async route handlers
 * Catches any errors and forwards them to the global error handler
 * Eliminates the need for try-catch blocks in every controller
 * 
 * @param fn - Async function to wrap
 * @returns Express middleware function
 * 
 * @example
 * router.get('/users', asyncHandler(async (req, res) => {
 *   const users = await User.find();
 *   res.json({ users });
 * }));
 */
const asyncHandler = (fn: AsyncRequestHandler) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};

export default asyncHandler;

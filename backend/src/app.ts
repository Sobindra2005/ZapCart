import express, { Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import config from '@/config/env';
import routes from '@/routes/index';
import errorHandler from '@/middlewares/errorHandler';
import AppError from '@/utils/AppError';
import './workers/searchIndexWork.ts'
import cookieParser from 'cookie-parser';

const app = express();

// Set security HTTP headers
app.use(helmet());
app.use(cookieParser());

// Enable CORS for all routes
app.use(cors({
    origin: [`${config.frontendUrl}`,`${config.adminUrl}`],
    credentials: true,
}));

// Rate limiting to prevent abuse
const limiter = rateLimit({
    windowMs: config.rateLimitWindowMs,
    max: config.rateLimitMaxRequests,
    message: 'Too many requests from this IP, please try again later',
    standardHeaders: true,
    legacyHeaders: false,
});
app.use('/api', limiter);

/**
 * BODY PARSING MIDDLEWARES
 */

// Parse JSON bodies with size limit
app.use(express.json({ limit: '10kb' }));

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

/**
 * LOGGING MIDDLEWARE (Development)
 */
if (config.nodeEnv === 'development') {
    app.use((req: Request, _res: Response, next: NextFunction) => {
        console.log(`📝 ${req.method} ${req.url}`);
        next();
    });
}

/**
 * HEALTH CHECK ROUTE
 */
app.get('/health', (_req: Request, res: Response) => {
    res.status(200).json({
        status: 'success',
        message: 'Server is running perfectly fine',
        environment: config.nodeEnv,
        timestamp: new Date().toISOString(),
    });
});

/**
 * API ROUTES
 */
app.use(`/api/${config.apiVersion}`, routes);

/**
 * HANDLE UNDEFINED ROUTES - 404
 */
app.all('*', (req: Request, _res: Response, next: NextFunction) => {
    next(new AppError(`Cannot find ${req.originalUrl} on this server`, 404));
});

/**
 * GLOBAL ERROR HANDLER
 * Must be the last middleware
 */
app.use(errorHandler);

export default app;

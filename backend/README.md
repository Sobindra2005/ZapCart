# E-Commerce Backend API

Production-ready Express.js backend built with TypeScript, featuring comprehensive error handling, security middlewares, and clean architecture principles.

## 🚀 Features

- **TypeScript** - Type-safe code with strict compiler options
- **Clean Architecture** - Modular folder structure with separation of concerns
- **Security** - Helmet, CORS, and rate limiting out of the box
- **Error Handling** - Centralized error handling with operational vs programming error differentiation
- **Environment Validation** - Required environment variables validated on startup
- **Path Aliases** - Clean imports using `@/` prefix
- **Development Ready** - Hot reload with ts-node-dev
- **Production Ready** - Optimized build process and error responses

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── env.ts              # Environment variable loader & validator
│   ├── controllers/
│   │   └── exampleController.ts # Example CRUD controller
│   ├── middlewares/
│   │   └── errorHandler.ts     # Global error handling middleware
│   ├── routes/
│   │   ├── index.ts            # Central route configuration
│   │   └── exampleRoutes.ts    # Example route definitions
│   ├── utils/
│   │   ├── AppError.ts         # Custom operational error class
│   │   └── asyncHandler.ts     # Async route handler wrapper
│   ├── app.ts                  # Express app configuration
│   └── server.ts               # Server entry point
├── dist/                       # Compiled JavaScript output
├── .env                        # Environment variables (not in git)
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── package.json                # Dependencies and scripts
└── tsconfig.json               # TypeScript configuration
```

## 🛠️ Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the backend directory (copy from `.env.example`):

```env
PORT=8080
NODE_ENV=development
DATABASE_URL=mongodb://localhost:27017/ecommerce
```

**Required Variables:**
- `PORT` - Server port (default: 8080)
- `NODE_ENV` - Environment: `development`, `production`, or `test`
- `DATABASE_URL` - Database connection string

### 3. Start Development Server

```bash
npm run dev
```

The server will start with hot-reload enabled at `http://localhost:8080`

## 📜 Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with hot-reload |
| `npm run build` | Compile TypeScript to JavaScript |
| `npm start` | Start production server (requires build first) |
| `npm run start:prod` | Build and start production server |
| `npm run type-check` | Check TypeScript types without compiling |

## 🔌 API Endpoints

### Health Check
```
GET /health
```
Returns server status and environment information.

### Example Endpoints
```
GET    /api/v1/examples         # Get all examples
GET    /api/v1/examples/:id     # Get example by ID (404 if not found)
POST   /api/v1/examples         # Create new example
DELETE /api/v1/examples/:id     # Delete example by ID
GET    /api/v1/examples/error   # Trigger error (for testing)
```

### Example Request

**Create Example:**
```bash
curl -X POST http://localhost:8080/api/v1/examples \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","description":"Test description"}'
```

**Response (Success):**
```json
{
  "status": "success",
  "data": {
    "example": {
      "id": "3",
      "name": "Test",
      "description": "Test description",
      "createdAt": "2025-11-26T17:39:17.123Z"
    }
  }
}
```

**Response (Error - Development):**
```json
{
  "status": "fail",
  "message": "No example found with ID: 999",
  "statusCode": 404,
  "stack": "Error: No example found..."
}
```

**Response (Error - Production):**
```json
{
  "status": "fail",
  "message": "No example found with ID: 999"
}
```

## 🛡️ Security Features

- **Helmet** - Sets various HTTP headers for security
- **CORS** - Configurable Cross-Origin Resource Sharing
- **Rate Limiting** - 100 requests per 15 minutes per IP
- **Body Size Limits** - JSON and URL-encoded bodies limited to 10kb

## ⚠️ Error Handling

### Operational Errors
Predictable errors that should be handled gracefully:
- Validation errors (400)
- Not found errors (404)
- Authentication errors (401)
- Database errors

These use the `AppError` class and return clean JSON responses.

### Programming Errors
Unexpected bugs or issues:
- Uncaught exceptions
- Unhandled promise rejections
- Syntax errors

These are logged in detail and return generic messages in production.

### Development vs Production

**Development Mode:**
- Full error details including stack traces
- Request logging
- Detailed validation messages

**Production Mode:**
- Clean error messages without stack traces
- Programming errors return generic messages
- Operational errors show specific messages

## 🚢 Production Deployment

### 1. Build the Project
```bash
npm run build
```

### 2. Set Production Environment
```env
NODE_ENV=production
PORT=8080
DATABASE_URL=your-production-database-url
```

### 3. Start Production Server
```bash
npm start
```

### Production Checklist
- [ ] Set `NODE_ENV=production`
- [ ] Configure production `DATABASE_URL`
- [ ] Update CORS origins in `app.ts`
- [ ] Set up process manager (PM2, systemd)
- [ ] Configure reverse proxy (nginx, Apache)
- [ ] Set up SSL/TLS certificates
- [ ] Configure logging service
- [ ] Set up monitoring and alerts

## 🧩 Path Aliases

The project uses TypeScript path aliases for clean imports:

```typescript
import config from '@/config/env';
import AppError from '@/utils/AppError';
import asyncHandler from '@/utils/asyncHandler';
import errorHandler from '@/middlewares/errorHandler';
```

Available aliases:
- `@/config/*` → `src/config/*`
- `@/middlewares/*` → `src/middlewares/*`
- `@/utils/*` → `src/utils/*`
- `@/routes/*` → `src/routes/*`
- `@/controllers/*` → `src/controllers/*`
- `@/models/*` → `src/models/*`
- `@/services/*` → `src/services/*`

## 📝 Adding New Features

### Create a New Controller
```typescript
import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';

export const getItems = asyncHandler(async (req: Request, res: Response) => {
  // Your logic here
  res.status(200).json({ status: 'success', data: {} });
});
```

### Create New Routes
```typescript
import express from 'express';
import { getItems } from '@/controllers/itemController';

const router = express.Router();
router.get('/', getItems);

export default router;
```

### Register Routes
Add to `src/routes/index.ts`:
```typescript
import itemRoutes from './itemRoutes';
router.use('/items', itemRoutes);
```

## 🤝 Contributing

1. Follow the existing code structure
2. Use TypeScript strict mode
3. Wrap async handlers with `asyncHandler`
4. Throw `AppError` for operational errors
5. Add proper JSDoc comments
6. Test both success and error cases

## 📄 License

ISC

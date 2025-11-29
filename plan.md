# E-commerce Platform Architecture

**Architecture Plan** — Dual-Database Polyglot Persistence System

## Overview

This e-commerce platform uses a polyglot persistence architecture, leveraging both PostgreSQL (via Prisma) and MongoDB (via Mongoose) to optimize for each database's strengths:

- **PostgreSQL**: Transactional data requiring ACID compliance (orders, payments, users, inventory)
- **MongoDB**: Flexible, high-read catalog and session data (products, categories, carts, reviews)

## Architecture Strategy

### Database Distribution

#### PostgreSQL (via Prisma)
**Purpose**: Critical transactional data with strong consistency requirements

- **User Management**: User accounts, addresses, authentication
- **Orders**: Order records, order items, order lifecycle
- **Payments**: Payment records, transactions, payment status
- **Inventory**: Stock tracking, warehouse management

#### MongoDB (via Mongoose)
**Purpose**: Flexible schemas, high-read operations, temporary data

- **Product Catalog**: Products, variants, attributes
- **Categories**: Hierarchical category structure
- **Shopping Carts**: Temporary cart data
- **Reviews**: Product reviews and ratings
- **Search Indices**: Optimized search data

## Implementation Roadmap

### Phase 1: Data Layer Foundation
1. **PostgreSQL Models** (Prisma Schema)
   - User, Address, Order, OrderItem
   - Payment, Transaction, Inventory
   - Relations and indexes

2. **MongoDB Models** (Mongoose Schemas)
   - Product, ProductVariant, Category
   - Cart, CartItem, ProductReview
   - SearchIndex

### Phase 2: Authentication & Authorization
- JWT-based authentication service
- Middleware: `authenticateToken`, `authorize` (role-based)
- Auth controllers: register, login, logout, refresh-token
- Password hashing with bcrypt
- Role-based access control (customer, admin, superadmin)

### Phase 3: Product Catalog System
- Product CRUD operations (MongoDB)
- Search, filter, pagination
- Category hierarchy management
- Product review system
- Image upload integration (Cloudinary/S3)

### Phase 4: Cart & Order Processing
- Cart operations (MongoDB): add, update, remove
- Order state machine (PostgreSQL): pending → processing → shipped → delivered
- Cross-database transaction handling (cart → order conversion)
- Order history and tracking

### Phase 5: Payment & Inventory
- Payment gateway integration (Stripe/PayPal)
- Webhook handlers for payment events
- Inventory management with atomic updates
- Stock reservation and concurrency control
- Low stock notifications

### Phase 6: Infrastructure & Deployment
- Docker Compose: MongoDB, PostgreSQL, Redis containers
- Environment configuration management
- Production build optimization
- CI/CD pipeline updates
- Monitoring and logging

## Key Design Decisions

### 1. Database Transaction Coordination
**Challenge**: Handling distributed transactions between MongoDB (cart) and PostgreSQL (order)

**Approach Options**:
- **Saga Pattern**: Choreographed or orchestrated sagas with compensation logic
- **Eventual Consistency**: Event-driven architecture with message queue
- **Two-Phase Commit**: For critical operations requiring strong consistency

**Recommendation**: Start with saga pattern for cart-to-order conversion, use event sourcing for audit trail

### 2. Image & File Management
**Options**:
- **Cloudinary**: Managed service, automatic optimization, CDN (recommended for MVP)
- **AWS S3**: Cost-effective, full control, scalable (recommended for production)
- **Local Storage**: Development only, not production-ready

**Choice**: Cloudinary for initial launch, migrate to S3 as scale increases

### 3. Search Strategy
**Options**:
- **MongoDB Text Search**: Built-in, simple, sufficient for <10k products
- **Elasticsearch**: Advanced filtering, faceted search, analytics
- **Algolia**: Managed, fast, excellent UX, higher cost

**Choice**: MongoDB text indexes for MVP, evaluate Elasticsearch at 10k+ products

### 4. Admin Panel
**Requirements**:
- Product management (CRUD, bulk operations)
- Order management (status updates, tracking)
- User management (view, suspend, roles)
- Analytics dashboard (sales, inventory, customers)
- Inventory control (stock updates, alerts)

**Implementation**: Protected `/api/v1/admin/*` routes with role-based middleware

## Tech Stack

### Backend
- **Runtime**: Node.js 20 (TypeScript 5.3+)
- **Framework**: Express.js 4.18
- **Databases**: 
  - PostgreSQL (Prisma ORM 7.0)
  - MongoDB (Mongoose 9.0)
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet, CORS, Rate Limiting
- **Validation**: Zod or Joi
- **Image Upload**: Multer → Cloudinary/S3

### Infrastructure
- **Containerization**: Docker, Docker Compose
- **Reverse Proxy**: Nginx
- **Caching**: Redis (sessions, frequently accessed data)
- **CI/CD**: GitHub Actions
- **Payment**: Stripe or PayPal SDK

## API Structure

```
/api/v1
├── /auth
│   ├── POST /register
│   ├── POST /login
│   ├── POST /logout
│   └── POST /refresh-token
├── /products
│   ├── GET / (list, search, filter, paginate)
│   ├── GET /:id
│   ├── POST / (admin)
│   ├── PUT /:id (admin)
│   └── DELETE /:id (admin)
├── /categories
│   ├── GET / (hierarchy)
│   └── GET /:id/products
├── /cart
│   ├── GET /
│   ├── POST /items
│   ├── PUT /items/:itemId
│   └── DELETE /items/:itemId
├── /orders
│   ├── POST / (create from cart)
│   ├── GET / (user's orders)
│   ├── GET /:id
│   └── PATCH /:id/status (admin)
├── /payments
│   ├── POST /create-intent
│   └── POST /webhook
├── /users
│   ├── GET /profile
│   ├── PUT /profile
│   └── POST /addresses
├── /reviews
│   ├── POST /products/:productId
│   └── GET /products/:productId
└── /admin
    ├── /analytics
    ├── /orders
    ├── /products
    └── /users
```

## Environment Variables

```env
# Server
NODE_ENV=development
PORT=8080

# PostgreSQL (Prisma)
DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce

# MongoDB (Mongoose)
MONGO_URI=mongodb://localhost:27017/ecommerce

# Redis
REDIS_URL=redis://localhost:6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d
JWT_REFRESH_SECRET=your-refresh-secret
JWT_REFRESH_EXPIRES_IN=30d

# Payment Gateway
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...

# File Storage
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Email (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-password
```

## Current Project Status

### ✅ Completed
- Basic Express.js setup with TypeScript
- Error handling middleware (Prisma + Mongoose compatible)
- MongoDB connection with Mongoose
- Prisma configuration
- Security middleware (Helmet, CORS, Rate Limiting)
- Docker containerization
- Nginx reverse proxy
- CI/CD pipeline (GitHub Actions)

### 🚧 In Progress / To Do
- Database models (both Prisma and Mongoose)
- Authentication system
- Product catalog
- Cart functionality
- Order processing
- Payment integration
- Admin panel
- Image upload
- Search implementation

## Security Considerations

1. **Authentication**: JWT with refresh tokens, httpOnly cookies
2. **Authorization**: Role-based access control (RBAC)
3. **Input Validation**: Strict validation on all endpoints
4. **Rate Limiting**: Already implemented (100 req/15min)
5. **SQL Injection**: Prisma provides protection
6. **NoSQL Injection**: Mongoose schema validation
7. **XSS Protection**: Helmet middleware configured
8. **CSRF**: SameSite cookies, CSRF tokens for state-changing operations
9. **Payment Security**: PCI compliance via Stripe/PayPal, never store card data
10. **Environment Secrets**: Never commit `.env`, use secret management

## Scalability Considerations

1. **Database Sharding**: MongoDB horizontal sharding for product catalog
2. **Read Replicas**: PostgreSQL read replicas for order queries
3. **Caching Layer**: Redis for frequently accessed data (products, categories)
4. **CDN**: Cloudinary/CloudFront for image delivery
5. **Load Balancing**: Nginx upstream servers, consider Kubernetes
6. **Microservices**: Potential split: Auth Service, Product Service, Order Service, Payment Service
7. **Message Queue**: RabbitMQ/Kafka for async operations (emails, notifications)

## Contributing

### Development Setup
1. Install dependencies: `npm install`
2. Set up databases (PostgreSQL, MongoDB)
3. Copy `.env.example` to `.env` and configure
4. Run Prisma migrations: `npx prisma migrate dev`
5. Generate Prisma client: `npx prisma generate`
6. Start development server: `npm run dev`

### Code Standards
- TypeScript strict mode
- ESLint configuration followed
- Path aliases for clean imports
- Error handling with `asyncHandler` wrapper
- Consistent naming conventions

---

**Project**: Personal E-commerce Store  
**Repository**: Sobindra2005/Ecommerce  
**Branch**: development  
**Architecture**: Dual-Database (PostgreSQL + MongoDB)
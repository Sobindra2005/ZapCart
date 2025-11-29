# E-commerce Platform

> A modern, scalable e-commerce platform built with dual-database architecture (PostgreSQL + MongoDB) for optimal performance and flexibility.

[![CI/CD](https://github.com/Sobindra2005/Ecommerce/actions/workflows/deploy.yml/badge.svg)](https://github.com/Sobindra2005/Ecommerce/actions/workflows/deploy.yml)
[![Node.js](https://img.shields.io/badge/Node.js-20-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue.svg)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)

## 🏗️ Architecture

This platform uses **polyglot persistence** - combining PostgreSQL and MongoDB to leverage the strengths of both databases:

- **PostgreSQL (Prisma)**: Transactional data - orders, payments, users, inventory
- **MongoDB (Mongoose)**: Flexible catalog data - products, carts, reviews, search

📖 **[View Detailed Architecture Plan →](plan.md)**

## ✨ Features

- 🛍️ **Product Catalog**: Browse products with advanced search and filtering
- 🛒 **Shopping Cart**: Add, update, and manage cart items
- 👤 **User Authentication**: Secure JWT-based authentication with refresh tokens
- 📦 **Order Management**: Complete order lifecycle from cart to delivery
- 💳 **Payment Integration**: Secure payment processing (Stripe/PayPal)
- 🔐 **Role-Based Access**: Customer, Admin, and SuperAdmin roles
- 📊 **Admin Dashboard**: Product, order, and user management
- ⭐ **Reviews & Ratings**: Customer feedback system
- 🚀 **Scalable Architecture**: Containerized with Docker, production-ready

## 🛠️ Tech Stack

### Backend
- **Runtime**: Node.js 20 with TypeScript
- **Framework**: Express.js
- **Databases**: PostgreSQL (Prisma ORM) + MongoDB (Mongoose)
- **Authentication**: JWT with bcrypt
- **Validation**: Zod/Joi
- **Security**: Helmet, CORS, Rate Limiting

### Infrastructure
- **Containerization**: Docker & Docker Compose
- **Reverse Proxy**: Nginx
- **Caching**: Redis
- **CI/CD**: GitHub Actions
- **Payment**: Stripe/PayPal SDK
- **File Storage**: Cloudinary/AWS S3

## 📁 Project Structure

```
.
├── backend/                 # Node.js/Express backend
│   ├── src/
│   │   ├── config/         # Database & environment config
│   │   ├── controllers/    # Request handlers
│   │   ├── middlewares/    # Authentication, error handling
│   │   ├── models/         # Mongoose schemas (MongoDB)
│   │   ├── routes/         # API route definitions
│   │   ├── services/       # Business logic
│   │   └── utils/          # Helper functions
│   ├── prisma/
│   │   └── schema.prisma   # PostgreSQL schema
│   ├── Dockerfile
│   └── package.json
├── nginx/                   # Nginx configuration
│   ├── nginx.conf
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── deploy.yml      # CI/CD pipeline
├── docker-compose.yml      # Multi-container setup
├── plan.md                 # Architecture documentation
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Docker & Docker Compose
- PostgreSQL (or use Docker)
- MongoDB (or use Docker)
- Redis (optional, for caching)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Sobindra2005/Ecommerce.git
   cd Ecommerce
   ```

2. **Set up environment variables**
   ```bash
   cp backend/.env.example backend/.env
   ```
   
   Edit `backend/.env` with your configuration:
   ```env
   NODE_ENV=development
   PORT=8080
   DATABASE_URL=postgresql://user:password@localhost:5432/ecommerce
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your-secret-key
   # ... see plan.md for complete list
   ```

3. **Install dependencies**
   ```bash
   cd backend
   npm install
   ```

4. **Set up databases**
   
   **Option A: Using Docker Compose** (Recommended)
   ```bash
   # Add PostgreSQL, MongoDB, and Redis to docker-compose.yml
   docker compose up -d postgres mongodb redis
   ```
   
   **Option B: Local Installation**
   - Install PostgreSQL and MongoDB locally
   - Update connection strings in `.env`

5. **Run Prisma migrations**
   ```bash
   cd backend
   npx prisma migrate dev
   npx prisma generate
   ```

6. **Start development server**
   
   **Backend only:**
   ```bash
   cd backend
   npm run dev
   ```
   
   **Full stack with Docker:**
   ```bash
   docker compose up
   ```
   
   Backend API: `http://localhost:8080`  
   Nginx: `http://localhost:80`

## 🐳 Docker Deployment

### Development Mode
```bash
docker compose up
```

### Production Mode
```bash
# Update backend/Dockerfile to use production stage
docker compose -f docker-compose.prod.yml up -d
```

## 📡 API Documentation

Base URL: `http://localhost:8080/api/v1`

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/login` - Login user
- `POST /auth/logout` - Logout user
- `POST /auth/refresh-token` - Refresh access token

### Products
- `GET /products` - List products (with search, filter, pagination)
- `GET /products/:id` - Get product details
- `POST /products` - Create product (admin)
- `PUT /products/:id` - Update product (admin)
- `DELETE /products/:id` - Delete product (admin)

### Cart
- `GET /cart` - Get user cart
- `POST /cart/items` - Add item to cart
- `PUT /cart/items/:itemId` - Update cart item
- `DELETE /cart/items/:itemId` - Remove cart item

### Orders
- `POST /orders` - Create order from cart
- `GET /orders` - Get user orders
- `GET /orders/:id` - Get order details
- `PATCH /orders/:id/status` - Update order status (admin)

### Users
- `GET /users/profile` - Get user profile
- `PUT /users/profile` - Update profile
- `POST /users/addresses` - Add address

### Admin
- `GET /admin/analytics` - Dashboard analytics
- `GET /admin/orders` - Manage all orders
- `GET /admin/products` - Manage products
- `GET /admin/users` - Manage users

📖 **[View Complete API Structure →](plan.md#api-structure)**

## 🔒 Security

- JWT authentication with httpOnly cookies
- Password hashing with bcrypt
- Rate limiting (100 requests per 15 minutes)
- Helmet.js security headers
- CORS configuration
- Input validation and sanitization
- SQL injection protection (Prisma)
- NoSQL injection protection (Mongoose)

## 🚦 Development Workflow

### Branch Strategy
- `main` - Production-ready code
- `development` - Active development
- `feature/*` - New features
- `bugfix/*` - Bug fixes

### CI/CD Pipeline
GitHub Actions automatically:
1. Runs linting (ESLint)
2. Builds TypeScript
3. Builds Docker images
4. Tests Docker Compose setup

## 📈 Roadmap

- [x] Project setup and architecture
- [ ] Database models (Prisma + Mongoose)
- [ ] Authentication system
- [ ] Product catalog API
- [ ] Shopping cart functionality
- [ ] Order processing system
- [ ] Payment gateway integration
- [ ] Admin dashboard
- [ ] Image upload service
- [ ] Search and filtering
- [ ] Email notifications
- [ ] Frontend application

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards
- TypeScript strict mode
- ESLint configuration
- Clean code principles
- Error handling with `asyncHandler`
- Path aliases for imports

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👤 Author

**Sobindra2005**
- GitHub: [@Sobindra2005](https://github.com/Sobindra2005)

## 📞 Support

For issues and questions:
- Open an issue on GitHub
- Check the [Architecture Plan](plan.md)
- Review existing issues and discussions

---

**Status**: 🚧 In Active Development  
**Last Updated**: November 29, 2025

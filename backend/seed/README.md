# Database Seeding Script

This folder contains the database seeding script that populates both PostgreSQL (via Prisma) and MongoDB (via Mongoose) with sample data.

## Overview

The seeding script creates 50 records for each schema/model:

### Prisma Models (PostgreSQL):
- Users (50 records)
- Addresses (50 records)
- RefreshTokens (50 records)
- Orders (50 records)
- OrderItems (50 records)
- Payments (50 records)
- Transactions (50 records)
- Inventory (50 records)
- InventoryLogs (50 records)
- SystemSettings (50 records)

### Mongoose Models (MongoDB):
- Categories (50 records - 10 root + 40 subcategories)
- Products (50 records)
- ProductReviews (50 records)
- SearchIndex (auto-generated from products and categories)

## Features

- ✅ Uses Faker.js for realistic random data
- ✅ Generates valid image URLs using Picsum Photos
- ✅ Maintains referential integrity (relationships between models)
- ✅ Handles both Prisma and Mongoose models
- ✅ Properly typed with TypeScript

## Usage

### Prerequisites

1. Make sure your databases are running:
   - PostgreSQL (for Prisma models)
   - MongoDB (for Mongoose models)

2. Ensure your `.env` file has the correct database connection strings:
   - `DATABASE_URL` - PostgreSQL connection string
   - `MONGODB_URL` - MongoDB connection string

### Running the Seed Script

```bash
npm run seed
```

This will:
1. Connect to both databases
2. Seed all models with 50 records each
3. Disconnect from databases

### Clearing Existing Data

By default, the script does NOT clear existing data. If you want to clear existing data before seeding, uncomment the deletion lines in the `seed()` function in `seed/index.ts`:

```typescript
// Uncomment these lines to clear existing data
await prisma.inventoryLog.deleteMany();
await prisma.inventory.deleteMany();
// ... etc
```

## Image URLs

The script generates valid image URLs using Picsum Photos service:
- Format: `https://picsum.photos/seed/{seed}/{width}/{height}`
- All images are valid and accessible
- Different seeds ensure variety in images

## Notes

- User passwords are hashed using bcrypt (default password: `password123`)
- Product variants are randomly generated for products with `hasVariants: true`
- Categories are created hierarchically (root categories first, then subcategories)
- SearchIndex entries are automatically synced when products and categories are created
- All dates are randomly generated within reasonable ranges (past/future)

## Troubleshooting

If you encounter errors:

1. **Connection errors**: Check that both databases are running and connection strings in `.env` are correct
2. **Type errors**: Make sure all dependencies are installed (`npm install`)
3. **Foreign key errors**: The script creates records in the correct order to maintain referential integrity


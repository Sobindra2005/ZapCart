import { faker } from '@faker-js/faker';
import { database } from '../src/config/database';
import { prisma } from '../src/config/prisma';
import Product from '../src/models/Product';
import Category from '../src/models/Category';
import ProductReview from '../src/models/ProductReview';
import SearchIndex from '../src/models/SearchIndex';
import bcrypt from 'bcryptjs';

// Helper function to generate valid image URLs
const getImageUrl = (width: number = 800, height: number = 600, category?: string): string => {
  const seed = faker.string.alphanumeric(10);
  const categoryParam = category ? `/${category}` : '';
  return `https://picsum.photos/seed/${seed}${categoryParam}/${width}/${height}`;
};

// Helper function to generate multiple image URLs
const getImageUrls = (count: number = 3, width: number = 800, height: number = 600): string[] => {
  return Array.from({ length: count }, () => getImageUrl(width, height));
};

// Helper function to generate SKU
const generateSKU = (prefix: string = 'SKU'): string => {
  return `${prefix}-${faker.string.alphanumeric(8).toUpperCase()}`;
};

// Seed Prisma Models (PostgreSQL)
async function seedPrisma() {
  console.log('🌱 Seeding Prisma models (PostgreSQL)...');

  // Seed Users
  console.log('  → Seeding Users...');
  const users: Array<{ id: number }> = [];
  for (let i = 0; i < 50; i++) {
    try {
      const firstName = faker.person.firstName();
      const lastName = faker.person.lastName();
      const email = faker.internet.email({ firstName, lastName });
      const hashedPassword = await bcrypt.hash('password123', 10);

      const user = await prisma.user.create({
        data: {
          email,
          password: hashedPassword,
          firstName,
          lastName,
          phone: faker.phone.number(),
          role: faker.helpers.arrayElement(['CUSTOMER', 'ADMIN', 'SUPERADMIN']),
          status: faker.helpers.arrayElement(['ACTIVE', 'SUSPENDED', 'DELETED']),
          emailVerified: faker.datatype.boolean(),
          lastLogin: faker.datatype.boolean() ? faker.date.recent() : null,
        },
      });
      users.push(user);
      if ((i + 1) % 10 === 0) {
        console.log(`    Progress: ${i + 1}/50 users created...`);
      }
    } catch (error) {
      console.error(`    ❌ Error creating user ${i + 1}:`, error);
      throw error;
    }
  }
  console.log(`  ✅ Created ${users.length} users`);

  // Seed Addresses
  console.log('  → Seeding Addresses...');
  const addresses: Array<{ id: number }> = [];
  for (let i = 0; i < 50; i++) {
    const address = await prisma.address.create({
      data: {
        userId: faker.helpers.arrayElement(users).id,
        fullName: faker.person.fullName(),
        phone: faker.phone.number(),
        addressLine1: faker.location.streetAddress(),
        addressLine2: faker.datatype.boolean() ? faker.location.secondaryAddress() : null,
        city: faker.location.city(),
        state: faker.location.state(),
        country: faker.location.country(),
        postalCode: faker.location.zipCode(),
        isDefault: faker.datatype.boolean(),
      },
    });
    addresses.push(address);
  }
  console.log(`  ✅ Created ${addresses.length} addresses`);

  // Seed RefreshTokens
  console.log('  → Seeding RefreshTokens...');
  for (let i = 0; i < 50; i++) {
    await prisma.refreshToken.create({
      data: {
        token: faker.string.alphanumeric(64),
        userId: faker.helpers.arrayElement(users).id,
        expiresAt: faker.date.future(),
      },
    });
  }
  console.log(`✅ Created 50 refresh tokens`);

  // Seed Orders
  console.log('  → Seeding Orders...');
  const orders: Array<{ id: number; totalAmount: number }> = [];
  for (let i = 0; i < 50; i++) {
    const user = faker.helpers.arrayElement(users);
    const shippingAddress = faker.helpers.arrayElement(addresses);
    const billingAddress = faker.helpers.arrayElement(addresses);

    const subtotal = parseFloat(faker.commerce.price({ min: 10, max: 1000 }));
    const shippingCost = parseFloat(faker.commerce.price({ min: 0, max: 50 }));
    const tax = parseFloat((subtotal * 0.1).toFixed(2));
    const discount = parseFloat(faker.commerce.price({ min: 0, max: 50 }));
    const totalAmount = subtotal + shippingCost + tax - discount;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        orderNumber: `ORD-${faker.string.alphanumeric(10).toUpperCase()}`,
        status: faker.helpers.arrayElement([
          'PENDING',
          'PAYMENT_PENDING',
          'PAYMENT_FAILED',
          'CONFIRMED',
          'PROCESSING',
          'SHIPPED',
          'DELIVERED',
          'CANCELLED',
          'REFUNDED',
        ]),
        shippingAddressId: shippingAddress.id,
        billingAddressId: billingAddress.id,
        subtotal,
        shippingCost,
        tax,
        discount,
        totalAmount,
        trackingNumber: faker.datatype.boolean() ? faker.string.alphanumeric(12).toUpperCase() : null,
        estimatedDelivery: faker.date.future(),
        deliveredAt: faker.datatype.boolean() ? faker.date.past() : null,
        customerNotes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        adminNotes: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      },
    });
    orders.push({ id: order.id, totalAmount: Number(order.totalAmount) });
  }
  console.log(`  ✅ Created ${orders.length} orders`);

  // Seed OrderItems
  console.log('  → Seeding OrderItems...');
  for (let i = 0; i < 50; i++) {
    const order = faker.helpers.arrayElement(orders);
    const quantity = faker.number.int({ min: 1, max: 10 });
    const unitPrice = parseFloat(faker.commerce.price({ min: 5, max: 500 }));
    const totalPrice = unitPrice * quantity;
    const discount = parseFloat(faker.commerce.price({ min: 0, max: 20 }));

    await prisma.orderItem.create({
      data: {
        orderId: order.id,
        productId: faker.database.mongodbObjectId(),
        productName: faker.commerce.productName(),
        sku: generateSKU(),
        variantId: faker.datatype.boolean() ? faker.database.mongodbObjectId() : null,
        variantName: faker.datatype.boolean() ? faker.commerce.productMaterial() : null,
        quantity,
        unitPrice,
        totalPrice,
        discount,
      },
    });
  }
  console.log(`  ✅ Created 50 order items`);

  // Seed Payments
  console.log('  → Seeding Payments...');
  const payments: Array<{ id: number }> = [];
  for (let i = 0; i < 50; i++) {
    const order = faker.helpers.arrayElement(orders);
    const user = faker.helpers.arrayElement(users);

    const payment = await prisma.payment.create({
      data: {
        orderId: order.id,
        userId: user.id,
        amount: order.totalAmount,
        currency: 'USD',
        status: faker.helpers.arrayElement([
          'PENDING',
          'PROCESSING',
          'COMPLETED',
          'FAILED',
          'REFUNDED',
          'CANCELLED',
        ]),
        method: faker.helpers.arrayElement(['STRIPE', 'BANK_TRANSFER', 'CASH_ON_DELIVERY']),
        gatewayProvider: faker.helpers.arrayElement(['stripe', 'paypal', null]),
        gatewayPaymentId: faker.datatype.boolean() ? faker.string.alphanumeric(24) : null,
        gatewayCustomerId: faker.datatype.boolean() ? faker.string.alphanumeric(24) : null,
        cardLast4: faker.datatype.boolean() ? faker.string.numeric(4) : null,
        cardBrand: faker.datatype.boolean() ? faker.helpers.arrayElement(['visa', 'mastercard', 'amex']) : null,
        metadata: faker.datatype.boolean() ? { test: faker.lorem.word() } : undefined,
        errorMessage: faker.datatype.boolean() ? faker.lorem.sentence() : null,
      },
    });
    payments.push(payment);
  }
  console.log(`  ✅ Created ${payments.length} payments`);

  // Seed Transactions
  console.log('  → Seeding Transactions...');
  for (let i = 0; i < 50; i++) {
    const payment = faker.helpers.arrayElement(payments);
    const order = faker.helpers.arrayElement(orders);

    await prisma.transaction.create({
      data: {
        paymentId: payment.id,
        orderId: order.id,
        type: faker.helpers.arrayElement([
          'CHARGE',
          'REFUND',
          'PARTIAL_REFUND',
          'AUTHORIZATION',
          'CAPTURE',
        ]),
        amount: parseFloat(faker.commerce.price({ min: 1, max: 1000 })),
        currency: 'USD',
        gatewayTransactionId: faker.datatype.boolean() ? faker.string.alphanumeric(24) : null,
        gatewayResponse: faker.datatype.boolean() ? { status: 'success' } : undefined,
        status: faker.helpers.arrayElement(['success', 'failed', 'pending']),
        errorCode: faker.datatype.boolean() ? faker.string.alphanumeric(6) : null,
        errorMessage: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        description: faker.lorem.sentence(),
        metadata: faker.datatype.boolean() ? { test: faker.lorem.word() } : undefined,
      },
    });
  }
  console.log(`  ✅ Created 50 transactions`);

  // Seed Inventory
  console.log('  → Seeding Inventory...');
  for (let i = 0; i < 50; i++) {
    const quantityInStock = faker.number.int({ min: 0, max: 1000 });
    const reservedQuantity = faker.number.int({ min: 0, max: quantityInStock });

    await prisma.inventory.create({
      data: {
        productId: faker.database.mongodbObjectId(),
        variantId: faker.datatype.boolean() ? faker.database.mongodbObjectId() : null,
        sku: generateSKU('INV'),
        quantityInStock,
        reservedQuantity,
        availableQuantity: quantityInStock - reservedQuantity,
        lowStockThreshold: faker.number.int({ min: 5, max: 20 }),
        reorderPoint: faker.number.int({ min: 1, max: 10 }),
        isActive: faker.datatype.boolean(),
        warehouseLocation: faker.datatype.boolean() ? faker.location.city() : null,
      },
    });
  }
  console.log(`  ✅ Created 50 inventory records`);

  // Seed InventoryLogs
  console.log('  → Seeding InventoryLogs...');
  const inventoryRecords = await prisma.inventory.findMany();
  const orderItems = await prisma.orderItem.findMany();

  for (let i = 0; i < 50; i++) {
    const inventory = faker.helpers.arrayElement(inventoryRecords) as { id: number; quantityInStock: number };
    const quantityChange = faker.number.int({ min: -50, max: 100 });
    const quantityBefore = inventory.quantityInStock;
    const quantityAfter = Math.max(0, quantityBefore + quantityChange);

    await prisma.inventoryLog.create({
      data: {
        inventoryId: inventory.id,
        orderItemId: faker.datatype.boolean() && orderItems.length > 0 
          ? (faker.helpers.arrayElement(orderItems) as { id: number }).id 
          : null,
        action: faker.helpers.arrayElement([
          'PURCHASE',
          'SALE',
          'RETURN',
          'ADJUSTMENT',
          'DAMAGE',
          'TRANSFER',
          'RESERVATION',
          'RELEASE',
        ]),
        quantityChange,
        quantityBefore,
        quantityAfter,
        reason: faker.datatype.boolean() ? faker.lorem.sentence() : null,
        performedBy: faker.datatype.boolean() ? faker.helpers.arrayElement(users).id : null,
      },
    });
  }
  console.log(`  ✅ Created 50 inventory logs`);

  // Seed SystemSettings
  console.log('  → Seeding SystemSettings...');
  const systemSettings = [
    { key: 'site_name', value: 'Ecommerce Store', description: 'Site name' },
    { key: 'site_email', value: 'admin@ecommerce.com', description: 'Site email' },
    { key: 'currency', value: 'USD', description: 'Default currency' },
    { key: 'tax_rate', value: '10', description: 'Tax rate percentage' },
    { key: 'shipping_cost', value: '5.00', description: 'Default shipping cost' },
    { key: 'free_shipping_threshold', value: '100.00', description: 'Free shipping threshold' },
    { key: 'maintenance_mode', value: 'false', description: 'Maintenance mode' },
    { key: 'max_upload_size', value: '5242880', description: 'Max upload size in bytes' },
    { key: 'allowed_file_types', value: 'jpg,jpeg,png,gif,webp', description: 'Allowed file types' },
    { key: 'order_auto_confirm', value: 'true', description: 'Auto confirm orders' },
  ];

  for (let i = 0; i < 50; i++) {
    const setting = systemSettings[i % systemSettings.length];
    await prisma.systemSetting.upsert({
      where: { key: `${setting.key}_${i}` },
      update: {},
      create: {
        key: `${setting.key}_${i}`,
        value: faker.datatype.boolean() ? setting.value : faker.lorem.word(),
        description: setting.description,
      },
    });
  }
  console.log(`  ✅ Created 50 system settings`);

  console.log('✅ Prisma seeding completed!');
}

// Seed Mongoose Models (MongoDB)
async function seedMongoose() {
  console.log('🌱 Seeding Mongoose models (MongoDB)...');

  // Seed Categories
  console.log('  → Seeding Categories...');
  const categories: any[] = [];
  const rootCategories: any[] = [];

  // Create root categories first
  for (let i = 0; i < 10; i++) {
    try {
      const name = `${faker.commerce.department()} ${faker.string.alphanumeric(4)}`;
      const category = new Category({
        name,
        slug: faker.helpers.slugify(name).toLowerCase() + '-' + faker.string.alphanumeric(6),
        description: faker.lorem.paragraph(),
        parent: null,
        ancestors: [],
        level: 0,
        image: getImageUrl(400, 300, 'category'),
        icon: faker.helpers.arrayElement(['📱', '💻', '👕', '👟', '⌚', '🎧', '📷', '🏠', '🚗', '🎮']),
        color: faker.color.rgb(),
        metaTitle: faker.lorem.sentence({ min: 3, max: 6 }),
        metaDescription: faker.lorem.sentence({ min: 5, max: 10 }).substring(0, 160),
        metaKeywords: faker.lorem.words(5).split(' '),
        isActive: faker.datatype.boolean({ probability: 0.9 }),
        displayOrder: i,
        productCount: 0,
      });
      await category.save();
      rootCategories.push(category);
      categories.push(category);
    } catch (error) {
      console.error(`    ❌ Error creating root category ${i + 1}:`, error);
      throw error;
    }
  }

  // Create subcategories
  for (let i = 0; i < 40; i++) {
    const parent = faker.helpers.arrayElement(rootCategories);
    const name = `${faker.commerce.productAdjective()} ${faker.commerce.product()} ${faker.string.alphanumeric(4)}`;
    const category = new Category({
      name,
      slug: faker.helpers.slugify(name).toLowerCase() + '-' + faker.string.alphanumeric(6),
      description: faker.lorem.paragraph(),
      parent: parent._id,
      ancestors: [...parent.ancestors, parent._id],
      level: parent.level + 1,
      image: getImageUrl(400, 300, 'category'),
      icon: faker.helpers.arrayElement(['📱', '💻', '👕', '👟', '⌚', '🎧', '📷', '🏠', '🚗', '🎮']),
      color: faker.color.rgb(),
      metaTitle: faker.lorem.sentence({ min: 3, max: 6 }),
      metaDescription: faker.lorem.sentence({ min: 5, max: 10 }).substring(0, 160),
      metaKeywords: faker.lorem.words(5).split(' '),
      isActive: faker.datatype.boolean({ probability: 0.9 }),
      displayOrder: i,
      productCount: 0,
    });
    await category.save();
    categories.push(category);
  }
  console.log(`  ✅ Created ${categories.length} categories`);

  // Seed Products
  console.log('  → Seeding Products...');
  const products: any[] = [];
  for (let i = 0; i < 50; i++) {
    try {
      const name = faker.commerce.productName();
      const hasVariants = faker.datatype.boolean({ probability: 0.4 });
      const variants = hasVariants
        ? Array.from({ length: faker.number.int({ min: 2, max: 5 }) }, (_, idx) => ({
          sku: generateSKU('PROD') + `-${Date.now()}-${idx}`,
          size: faker.helpers.arrayElement(['S', 'M', 'L', 'XL', 'XXL']),
          color: faker.color.human(),
          material: faker.commerce.productMaterial(),
          price: parseFloat(faker.commerce.price({ min: 10, max: 500 })),
          compareAtPrice: faker.datatype.boolean({ probability: 0.3 })
            ? parseFloat(faker.commerce.price({ min: 500, max: 700 }))
            : undefined,
          stock: faker.number.int({ min: 0, max: 1000 }),
          images: getImageUrls(faker.number.int({ min: 1, max: 3 })),
          weight: faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 }),
          dimensions: {
            length: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
            width: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
            height: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
            unit: faker.helpers.arrayElement(['cm', 'inch']),
          },
        }))
        : [];

      const basePrice = parseFloat(faker.commerce.price({ min: 10, max: 500 }));
      const product = new Product({
        name,
        slug: faker.helpers.slugify(name).toLowerCase() + '-' + faker.string.alphanumeric(6),
        description: faker.commerce.productDescription(),
        shortDescription: faker.lorem.sentence({ min: 10, max: 20 }),
        basePrice,
        compareAtPrice: faker.datatype.boolean({ probability: 0.3 })
          ? parseFloat(faker.commerce.price({ min: 500, max: 700 }))
          : undefined,
        costPrice: parseFloat(faker.commerce.price({ min: 5, max: basePrice * 0.7 })),
        category: faker.helpers.arrayElement(categories)._id,
        subcategories: faker.datatype.boolean({ probability: 0.3 })
          ? [faker.helpers.arrayElement(categories)._id]
          : [],
        brand: faker.company.name(),
        tags: faker.lorem.words(faker.number.int({ min: 2, max: 5 })).split(' '),
        hasVariants,
        variants,
        totalStock: hasVariants
          ? variants.reduce((sum, v) => sum + v.stock, 0)
          : faker.number.int({ min: 0, max: 1000 }),
        lowStockThreshold: faker.number.int({ min: 5, max: 20 }),
        trackInventory: faker.datatype.boolean({ probability: 0.9 }),
        allowBackorder: faker.datatype.boolean({ probability: 0.2 }),
        images: getImageUrls(faker.number.int({ min: 3, max: 6 }), 800, 800),
        thumbnail: getImageUrl(400, 400),
        videoUrl: faker.datatype.boolean({ probability: 0.2 })
          ? `https://www.youtube.com/watch?v=${faker.string.alphanumeric(11)}`
          : undefined,
        metaTitle: faker.lorem.sentence({ min: 3, max: 6 }),
        metaDescription: faker.lorem.sentence({ min: 5, max: 10 }).substring(0, 160),
        metaKeywords: faker.lorem.words(5).split(' '),
        specifications: new Map([
          ['Material', faker.commerce.productMaterial()],
          ['Weight', `${faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 })} kg`],
          ['Dimensions', `${faker.number.int({ min: 10, max: 100 })}x${faker.number.int({ min: 10, max: 100 })} cm`],
        ]),
        features: Array.from({ length: faker.number.int({ min: 3, max: 7 }) }, () =>
          faker.lorem.sentence()
        ),
        weight: faker.number.float({ min: 0.1, max: 10, fractionDigits: 2 }),
        dimensions: {
          length: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
          width: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
          height: faker.number.float({ min: 10, max: 100, fractionDigits: 1 }),
          unit: faker.helpers.arrayElement(['cm', 'inch']),
        },
        status: faker.helpers.arrayElement(['draft', 'active', 'archived']),
        visibility: faker.helpers.arrayElement(['public', 'hidden', 'featured']),
        publishedAt: faker.date.past(),
        viewCount: faker.number.int({ min: 0, max: 10000 }),
        salesCount: faker.number.int({ min: 0, max: 1000 }),
        averageRating: parseFloat(faker.number.float({ min: 0, max: 5, fractionDigits: 1 }).toFixed(1)),
        reviewCount: faker.number.int({ min: 0, max: 500 }),
      });
      await product.save();
      products.push(product);
      if ((i + 1) % 10 === 0) {
        console.log(`    Progress: ${i + 1}/50 products created...`);
      }
    } catch (error) {
      console.error(`    ❌ Error creating product ${i + 1}:`, error);
      throw error;
    }
  }
  console.log(`  ✅ Created ${products.length} products`);

  // Seed ProductReviews
  console.log('  → Seeding ProductReviews...');

  for (let i = 0; i < 50; i++) {
    const product = faker.helpers.arrayElement(products);
    // Use a MongoDB ObjectId for user reference (we'll use a fake one since users are in PostgreSQL)
    const fakeUserId = faker.database.mongodbObjectId();

    const review = new ProductReview({
      product: product._id,
      user: fakeUserId as any, // Type assertion needed
      rating: faker.number.int({ min: 1, max: 5 }),
      title: faker.lorem.sentence({ min: 3, max: 8 }),
      comment: faker.lorem.paragraph({ min: 2, max: 5 }),
      images: faker.datatype.boolean({ probability: 0.4 })
        ? getImageUrls(faker.number.int({ min: 1, max: 3 }), 600, 600)
        : [],
      isVerifiedPurchase: faker.datatype.boolean({ probability: 0.6 }),
      orderId: faker.datatype.boolean({ probability: 0.3 })
        ? (faker.database.mongodbObjectId() as any)
        : undefined,
      helpfulCount: faker.number.int({ min: 0, max: 100 }),
      notHelpfulCount: faker.number.int({ min: 0, max: 20 }),
      helpfulVotes: [],
      status: faker.helpers.arrayElement(['pending', 'approved', 'rejected']),
      moderatorNote: faker.datatype.boolean({ probability: 0.2 })
        ? faker.lorem.sentence()
        : undefined,
      moderatedBy: faker.datatype.boolean({ probability: 0.2 })
        ? (faker.database.mongodbObjectId() as any)
        : undefined,
      moderatedAt: faker.datatype.boolean({ probability: 0.2 })
        ? faker.date.past()
        : undefined,
      reply: faker.datatype.boolean({ probability: 0.3 })
        ? {
          content: faker.lorem.paragraph(),
          repliedBy: faker.database.mongodbObjectId() as any,
          repliedAt: faker.date.past(),
        }
        : undefined,
    });
    await review.save();
  }
  console.log(`  ✅ Created 50 product reviews`);

  // Seed SearchIndex
  console.log('  → Seeding SearchIndex...');
  // Sync products to search index
  for (const product of products) {
    await SearchIndex.syncProduct(product._id.toString());
  }

  // Sync categories to search index
  for (const category of categories) {
    await SearchIndex.syncCategory(category._id.toString());
  }
  console.log(`  ✅ Created search index entries for products and categories`);

  console.log('✅ Mongoose seeding completed!');
}

const args = process.argv.slice(2);
const shouldClear = args.includes('--clear');

// Main seeding function
async function seed() {
  try {
    console.log('🚀 Starting database seeding...\n');

    // Connect to databases
    console.log('📡 Connecting to databases...');

    // Connect to MongoDB
    const mongooseConnection = await database.connect();
    console.log(`✅ MongoDB connected to: ${mongooseConnection.connection.host}:${mongooseConnection.connection.port}/${mongooseConnection.connection.name}`);

    // Connect to PostgreSQL (Prisma)
    // The Prisma client might already be connecting, so we ensure it's connected
    await prisma.$connect();
    console.log('✅ PostgreSQL (Prisma) connected');

    // Verify connections by performing a simple query
    try {
      const userCount = await prisma.user.count();
      console.log(`✅ Verified Prisma connection - Current user count: ${userCount}`);
    } catch (error) {
      console.error('❌ Failed to verify Prisma connection:', error);
      throw error;
    }

    try {
      if (!mongooseConnection.connection.db) {
        throw new Error('MongoDB database connection not available');
      }
      const categoryCount = await mongooseConnection.connection.db.collection('categories').countDocuments();
      console.log(`✅ Verified MongoDB connection - Current category count: ${categoryCount}`);
    } catch (error) {
      console.error('❌ Failed to verify MongoDB connection:', error);
      throw error;
    }

    console.log('✅ All databases verified and ready for seeding\n');

    // Clear existing data (optional - comment out if you want to keep existing data)

    if (shouldClear) {
      console.log('🗑️  Clearing existing data...');
      // Uncomment the following lines if you want to clear existing data
      await prisma.inventoryLog.deleteMany();
      await prisma.inventory.deleteMany();
      await prisma.transaction.deleteMany();
      await prisma.payment.deleteMany();
      await prisma.orderItem.deleteMany();
      await prisma.order.deleteMany();
      await prisma.refreshToken.deleteMany();
      await prisma.address.deleteMany();
      await prisma.user.deleteMany();
      await prisma.systemSetting.deleteMany();
      await SearchIndex.deleteMany();
      await ProductReview.deleteMany();
      await Product.deleteMany();
      await Category.deleteMany();
      console.log('✅ Data cleared (or skipped)\n');
    }

    // Seed Prisma models
    await seedPrisma();
    console.log('');

    // Seed Mongoose models
    await seedMongoose();
    console.log('');

    // Verify data was actually written
    console.log('🔍 Verifying seeded data...');
    const finalUserCount = await prisma.user.count();
    const finalOrderCount = await prisma.order.count();

    if (!mongooseConnection.connection.db) {
      throw new Error('MongoDB database connection not available for verification');
    }
    const finalCategoryCount = await mongooseConnection.connection.db.collection('categories').countDocuments();
    const finalProductCount = await mongooseConnection.connection.db.collection('products').countDocuments();

    console.log(`📊 Final counts:`);
    console.log(`   PostgreSQL - Users: ${finalUserCount}, Orders: ${finalOrderCount}`);
    console.log(`   MongoDB - Categories: ${finalCategoryCount}, Products: ${finalProductCount}`);

    if (finalUserCount === 0 || finalOrderCount === 0 || finalCategoryCount === 0 || finalProductCount === 0) {
      console.warn('⚠️  WARNING: Some counts are zero. Data may not have been written correctly.');
    }

    console.log('🎉 Seeding completed successfully!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    // Disconnect from databases
    console.log('\n📡 Disconnecting from databases...');
    await prisma.$disconnect();
    await database.disconnect();
    console.log('✅ Disconnected');
  }
}

// Run seeding
if (require.main === module) {
  seed()
    .then(() => {
      console.log('\n✨ All done!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Seeding failed:', error);
      process.exit(1);
    });
}

export default seed;


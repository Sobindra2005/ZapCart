// import { faker } from '@faker-js/faker';
// import { DatabaseConnection } from '../src/config/database';
// import PrismaService from '../src/config/prisma';
// import Category, { ICategory } from '../src/models/Category';
// import Product, { IProduct } from '../src/models/Product';
// import ProductReview from '../src/models/ProductReview';
// import SearchIndex from '../src/models/SearchIndex';
// import * as bcrypt from 'bcryptjs';

// const prisma = PrismaService.getInstance();

// /**
//  * ============================================
//  * SEEDER CONFIGURATION
//  * ============================================
//  */

// const SEED_CONFIG = {
//   // Base records (core data)
//   BASE_USERS: 10, // 1 admin/superadmin + 9 customers
//   BASE_CATEGORIES: 10, // Root categories
//   BASE_SYSTEM_SETTINGS: 4,
  
//   // Generated records (on top of base)
//   PRODUCTS_PER_CATEGORY: 5, // 50 products total
//   ADDRESSES_PER_USER: 2, // 20 addresses total
//   ORDERS_PER_USER: 3, // 30 orders total
//   REVIEWS_PER_PRODUCT: 2, // 100 reviews total
//   INVENTORY_SYNC: true,
// };

// /**
//  * ============================================
//  * UTILITY FUNCTIONS
//  * ============================================
//  */

// async function hashPassword(password: string): Promise<string> {
//   const salt = await bcrypt.genSalt(10);
//   return bcrypt.hash(password, salt);
// }


// function generateOrderNumber(): string {
//   return `ORD-${Date.now()}-${Math.random().toString(36).substring(7).toUpperCase()}`;
// }

// function generateSKU(): string {
//   return `SKU-${faker.string.alphanumeric(8).toUpperCase()}`;
// }

// /**
//  * ============================================
//  * BASE RECORDS SEEDERS (15 Core Records)
//  * ============================================
//  */

// async function seedBaseUsers(): Promise<any[]> {
//   console.log('\n📝 Seeding Base Users...');
  
//   const users = [];
//   const hashedPassword = await hashPassword('Test@123456');
  
//   // 1. Create Super Admin
//   const superAdmin = await prisma.user.create({
//     data: {
//       email: 'superadmin@ecommerce.com',
//       password: hashedPassword,
//       firstName: 'Super',
//       lastName: 'Admin',
//       phone: '+1-555-0100',
//       role: 'SUPERADMIN',
//       status: 'ACTIVE',
//       emailVerified: true,
//       avatar: faker.image.avatar(),
//     },
//   });
//   users.push(superAdmin);
//   console.log(`  ✅ Created Super Admin: ${superAdmin.email}`);

//   // 2. Create Admin
//   const admin = await prisma.user.create({
//     data: {
//       email: 'admin@ecommerce.com',
//       password: hashedPassword,
//       firstName: 'Admin',
//       lastName: 'User',
//       phone: '+1-555-0101',
//       role: 'ADMIN',
//       status: 'ACTIVE',
//       emailVerified: true,
//       avatar: faker.image.avatar(),
//     },
//   });
//   users.push(admin);
//   console.log(`  ✅ Created Admin: ${admin.email}`);

//   // 3-10. Create 8 Customer Users
//   for (let i = 1; i <= 8; i++) {
//     const customer = await prisma.user.create({
//       data: {
//         email: `customer${i}@example.com`,
//         password: hashedPassword,
//         firstName: faker.person.firstName(),
//         lastName: faker.person.lastName(),
//         phone: faker.phone.number(),
//         role: 'CUSTOMER',
//         status: 'ACTIVE',
//         emailVerified: faker.datatype.boolean({ probability: 0.8 }),
//         avatar: faker.image.avatar(),
//       },
//     });
//     users.push(customer);
//     console.log(`  ✅ Created Customer: ${customer.email}`);
//   }

//   return users;
// }

// async function seedBaseAddresses(users: any[]): Promise<any[]> {
//   console.log('\n📍 Seeding Base Addresses...');
  
//   const addresses = [];

//   for (const user of users) {
//     // 2 addresses per user
//     for (let i = 0; i < 2; i++) {
//       const address = await prisma.address.create({
//         data: {
//           userId: user.id,
//           fullName: `${user.firstName} ${user.lastName}`,
//           phone: user.phone || faker.phone.number(),
//           address: faker.location.streetAddress(),
//           city: faker.location.city(),
//           state: faker.location.state({ abbreviated: true }),
//           country: 'United States',
//           postalCode: faker.location.zipCode('####'),
//           isDefault: i === 0, // First address is default
//           location: {
//             latitude: parseFloat(faker.location.latitude().toString()),
//             longitude: parseFloat(faker.location.longitude().toString()),
//           },
//         },
//       });
//       addresses.push(address);
//     }
//     console.log(`  ✅ Created 2 addresses for user: ${user.email}`);
//   }

//   return addresses;
// }

// async function seedBaseCategories(): Promise<ICategory[]> {
//   console.log('\n🏷️  Seeding Base Categories...');
  
//   const categoryNames = [
//     'Electronics',
//     'Clothing & Fashion',
//     'Home & Kitchen',
//     'Sports & Outdoors',
//     'Books & Media',
//     'Beauty & Personal Care',
//     'Toys & Games',
//     'Health & Wellness',
//     'Automotive',
//     'Office Supplies',
//   ];

//   const categories:any[] = [];

//   for (const name of categoryNames) {
//     const category = await Category.create({
//       name,
//       slug: name.toLowerCase().replace(/\s+/g, '-').replace(/&/g, 'and'),
//       description: faker.lorem.sentences(2),
//       image: faker.image.url(),
//       icon: '📦',
//       color: faker.color.rgb({ casing: 'lower' }),
//       metaTitle: name,
//       metaDescription: faker.lorem.sentence(),
//       metaKeywords: [name.toLowerCase(), 'shopping', 'products'],
//       isActive: true,
//       displayOrder: categoryNames.indexOf(name),
//       productCount: 0,
//       level: 0,
//     });
//     categories.push(category);
//     console.log(`  ✅ Created Category: ${name}`);
//   }

//   return categories;
// }

// async function seedBaseSystemSettings(): Promise<any[]> {
//   console.log('\n⚙️  Seeding Base System Settings...');
  
//   const settings = [
//     {
//       key: 'ESTIMATED_DELIVERY_DAYS',
//       value: '5-7',
//       description: 'Default estimated delivery days for orders',
//     },
//     {
//       key: 'SHIPPING_INFO',
//       value: 'Free shipping on orders over $50',
//       description: 'Default shipping information displayed to customers',
//     },
//     {
//       key: 'SUPPORT_EMAIL',
//       value: 'support@ecommerce.com',
//       description: 'Customer support email address',
//     },
//     {
//       key: 'MAINTENANCE_MODE',
//       value: 'false',
//       description: 'Enable/disable maintenance mode',
//     },
//   ];

//   const createdSettings = [];

//   for (const setting of settings) {
//     const created = await prisma.systemSetting.create({
//       data: {
//         key: setting.key,
//         value: setting.value,
//         description: setting.description,
//       },
//     });
//     createdSettings.push(created);
//     console.log(`  ✅ Created Setting: ${setting.key}`);
//   }

//   return createdSettings;
// }

// /**
//  * ============================================
//  * GENERATED RECORDS SEEDERS
//  * ============================================
//  */

// async function seedProducts(categories: ICategory[]): Promise<IProduct[]> {
//   console.log('\n🛍️  Seeding Products...');
  
//   const products = [];
//   const brands = ['TechBrand', 'FashionCo', 'HomeGoods', 'SportGear', 'Premium'];

//   for (const category of categories) {
//     for (let i = 0; i < SEED_CONFIG.PRODUCTS_PER_CATEGORY; i++) {
//       const basePrice = faker.number.int({ min: 10, max: 500 });
//       const product = await Product.create({
//         name: `${category.name} - ${faker.commerce.productName()}`,
//         slug: faker.lorem.slug(),
//         description: faker.lorem.paragraphs(2),
//         shortDescription: faker.lorem.sentence(),
//         basePrice,
//         compareAtPrice: basePrice + faker.number.int({ min: 20, max: 100 }),
//         costPrice: basePrice * 0.6,
//         category: category._id,
//         brand: faker.helpers.arrayElement(brands),
//         tags: [
//           faker.lorem.word(),
//           faker.lorem.word(),
//           faker.lorem.word(),
//         ],
//         hasVariants: faker.datatype.boolean({ probability: 0.6 }),
//         variants: [],
//         totalStock: faker.number.int({ min: 10, max: 1000 }),
//         lowStockThreshold: 10,
//         trackInventory: true,
//         allowBackorder: faker.datatype.boolean({ probability: 0.3 }),
//         images: [
//           faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
//           faker.image.urlPicsumPhotos({ width: 400, height: 400 }),
//         ],
//         thumbnail: faker.image.urlPicsumPhotos({ width: 200, height: 200 }),
//         status: 'active',
//         visibility: faker.helpers.arrayElement(['public', 'public', 'public', 'featured']),
//         publishedAt: faker.date.past(),
//         viewCount: faker.number.int({ min: 0, max: 1000 }),
//         salesCount: faker.number.int({ min: 0, max: 500 }),
//         averageRating: faker.number.float({ min: 2, max: 5, fractionDigits: 1 }),
//         reviewCount: 0,
//       });
//       products.push(product);
//     }
//     console.log(`  ✅ Created ${SEED_CONFIG.PRODUCTS_PER_CATEGORY} products for category: ${category.name}`);
//   }

//   return products;
// }

// async function seedInventory(products: IProduct[]): Promise<any[]> {
//   console.log('\n📦 Seeding Inventory...');
  
//   const inventories = [];

//   for (const product of products) {
//     const inventory = await prisma.inventory.create({
//       data: {
//         productId: product._id.toString(),
//         sku: generateSKU(),
//         quantityInStock: product.totalStock,
//         reservedQuantity: faker.number.int({ min: 0, max: product.totalStock / 2 }),
//         availableQuantity: product.totalStock,
//         lowStockThreshold: 10,
//         reorderPoint: 5,
//         isActive: true,
//         warehouseLocation: `Aisle-${faker.string.alphanumeric(2).toUpperCase()}-${faker.number.int({ min: 1, max: 10 })}`,
//       },
//     });
//     inventories.push(inventory);
//   }

//   console.log(`  ✅ Created ${inventories.length} inventory records`);
//   return inventories;
// }

// async function seedOrders(users: any[], addresses: any[]): Promise<any[]> {
//   console.log('\n📋 Seeding Orders...');
  
//   const orders = [];
//   const orderStatuses: any[] = [
//     'PENDING',
//     'PAYMENT_PENDING',
//     'CONFIRMED',
//     'PROCESSING',
//     'SHIPPED',
//     'DELIVERED',
//   ];

//   for (const user of users) {
//     if (user.role === 'CUSTOMER') {
//       const userAddresses = addresses.filter((a) => a.userId === user.id);

//       for (let i = 0; i < SEED_CONFIG.ORDERS_PER_USER; i++) {
//         const subtotal = faker.number.float({ min: 50, max: 500, fractionDigits: 2 });
//         const tax = parseFloat((subtotal * 0.1).toFixed(2));
//         const shippingCost = faker.datatype.boolean({ probability: 0.5 }) ? 0 : 10;
//         const discount = faker.datatype.boolean({ probability: 0.3 })
//           ? faker.number.float({ min: 5, max: 50, fractionDigits: 2 })
//           : 0;

//         const order = await prisma.order.create({
//           data: {
//             userId: user.id,
//             orderNumber: generateOrderNumber(),
//             status: faker.helpers.arrayElement(orderStatuses),
//             shippingAddressId: userAddresses[0]?.id || addresses[0].id,
//             billingAddressId: userAddresses[1]?.id || addresses[1].id,
//             subtotal: subtotal.toString(),
//             tax: tax.toString(),
//             shippingCost: shippingCost.toString(),
//             discount: discount.toString(),
//             totalAmount: (subtotal + tax + shippingCost - discount).toFixed(2).toString(),
//             trackingNumber: faker.string.alphanumeric(12).toUpperCase(),
//             estimatedDelivery: faker.date.future(),
//             deliveredAt: faker.datatype.boolean({ probability: 0.5 })
//               ? faker.date.past()
//               : null,
//             customerNotes: faker.lorem.sentence(),
//           },
//         });
//         orders.push(order);
//       }
//       console.log(
//         `  ✅ Created ${SEED_CONFIG.ORDERS_PER_USER} orders for customer: ${user.email}`
//       );
//     }
//   }

//   return orders;
// }

// async function seedOrderItems(orders: any[], products: IProduct[]): Promise<any[]> {
//   console.log('\n📦 Seeding Order Items...');
  
//   const orderItems = [];

//   for (const order of orders) {
//     const itemCount = faker.number.int({ min: 1, max: 5 });

//     for (let i = 0; i < itemCount; i++) {
//       const product = faker.helpers.arrayElement(products);
//       const quantity = faker.number.int({ min: 1, max: 5 });
//       const unitPrice = product.basePrice;
//       const totalPrice = unitPrice * quantity;

//       const orderItem = await prisma.orderItem.create({
//         data: {
//           orderId: order.id,
//           productId: product._id.toString(),
//           productName: product.name,
//           sku: generateSKU(),
//           quantity,
//           unitPrice: unitPrice.toString(),
//           totalPrice: totalPrice.toString(),
//           discount: faker.datatype.boolean({ probability: 0.2 })
//             ? faker.number.float({ min: 5, max: 20, fractionDigits: 2 }).toString()
//             : '0',
//         },
//       });
//       orderItems.push(orderItem);
//     }
//   }

//   console.log(`  ✅ Created ${orderItems.length} order items`);
//   return orderItems;
// }

// async function seedPayments(orders: any[], users: any[]): Promise<any[]> {
//   console.log('\n💳 Seeding Payments...');
  
//   const payments = [];
//   const paymentMethods: any[] = ['STRIPE', 'BANK_TRANSFER', 'CASH_ON_DELIVERY'];
//   const paymentStatuses: any[] = ['COMPLETED', 'PENDING', 'FAILED'];

//   for (const order of orders) {
//     const user = users.find((u) => u.id === order.userId);
//     if (!user) continue;

//     const payment = await prisma.payment.create({
//       data: {
//         orderId: order.id,
//         userId: user.id,
//         amount: order.totalAmount.toString(),
//         currency: 'USD',
//         status: faker.helpers.arrayElement(paymentStatuses),
//         method: faker.helpers.arrayElement(paymentMethods),
//         gatewayProvider: 'STRIPE',
//         gatewayPaymentId: faker.string.nanoid(24),
//         cardLast4: faker.finance.creditCardNumber('####'),
//         cardBrand: faker.helpers.arrayElement(['VISA', 'MASTERCARD', 'AMEX']),
//       },
//     });
//     payments.push(payment);
//   }

//   console.log(`  ✅ Created ${payments.length} payments`);
//   return payments;
// }

// async function seedTransactions(payments: any[]): Promise<any[]> {
//   console.log('\n🔄 Seeding Transactions...');
  
//   const transactions = [];
//   const transactionTypes: any[] = ['CHARGE', 'AUTHORIZATION', 'CAPTURE'];

//   for (const payment of payments) {
//     const order = await prisma.order.findUnique({
//       where: { id: payment.orderId },
//     });

//     if (order) {
//       const transaction = await prisma.transaction.create({
//         data: {
//           paymentId: payment.id,
//           orderId: payment.orderId,
//           type: faker.helpers.arrayElement(transactionTypes),
//           amount: order.totalAmount.toString(),
//           currency: 'USD',
//           gatewayTransactionId: faker.string.nanoid(24),
//           status: payment.status === 'COMPLETED' ? 'SUCCESS' : 'PENDING',
//           description: `Transaction for order ${order.orderNumber}`,
//         },
//       });
//       transactions.push(transaction);
//     }
//   }

//   console.log(`  ✅ Created ${transactions.length} transactions`);
//   return transactions;
// }

// async function seedProductReviews(products: IProduct[], users: any[]): Promise<any[]> {
//   console.log('\n⭐ Seeding Product Reviews...');
  
//   const reviews = [];
//   const reviewStatuses = ['approved', 'pending', 'rejected'];

//   for (const product of products) {
//     for (let i = 0; i < SEED_CONFIG.REVIEWS_PER_PRODUCT; i++) {
//       const user = faker.helpers.arrayElement(users.filter((u) => u.role === 'CUSTOMER'));

//       const review = await ProductReview.create({
//         product: product._id,
//         user: user.id,
//         rating: faker.number.int({ min: 1, max: 5 }),
//         comment: faker.lorem.paragraphs(1),
//         isVerifiedPurchase: faker.datatype.boolean({ probability: 0.7 }),
//         helpfulCount: faker.number.int({ min: 0, max: 100 }),
//         notHelpfulCount: faker.number.int({ min: 0, max: 50 }),
//         status: faker.helpers.arrayElement(reviewStatuses),
//         createdAt: faker.date.past(),
//         updatedAt: faker.date.recent(),
//       });
//       reviews.push(review);
//     }
//   }

//   console.log(`  ✅ Created ${reviews.length} reviews`);
//   return reviews;
// }

// async function seedSearchIndex(products: IProduct[], categories: ICategory[]): Promise<void> {
//   console.log('\n🔍 Syncing Search Index...');
  
//   // Clear existing search index
//   await SearchIndex.deleteMany({});

//   // Index all products
//   const productDocuments = products.map((product) => ({
//     entityType: 'product',
//     entityId: product._id,
//     name: product.name,
//     description: product.description,
//     keywords: product.tags,
//     brand: product.brand,
//     sku: product.variants[0]?.sku,
//     price: product.basePrice,
//     rating: product.averageRating,
//     isActive: product.status === 'active',
//     searchText: `${product.name} ${product.description} ${product.brand}`.toLowerCase(),
//     popularity: product.viewCount + product.salesCount,
//     lastSyncedAt: new Date(),
//   }));

//   // Index all categories
//   const categoryDocuments = categories.map((category) => ({
//     entityType: 'category',
//     entityId: category._id,
//     name: category.name,
//     description: category.description,
//     keywords: [category.slug],
//     isActive: category.isActive,
//     searchText: `${category.name} ${category.description}`.toLowerCase(),
//     popularity: category.productCount,
//     lastSyncedAt: new Date(),
//   }));

//   const allDocuments = [...productDocuments, ...categoryDocuments];
  
//   if (allDocuments.length > 0) {
//     await SearchIndex.insertMany(allDocuments);
//   }

//   console.log(`  ✅ Indexed ${productDocuments.length} products and ${categoryDocuments.length} categories`);
// }

// /**
//  * ============================================
//  * MAIN SEEDER FUNCTION
//  * ============================================
//  */

// async function main() {
//   console.log('\n====================================');
//   console.log('🌱 ECOMMERCE DATABASE SEEDER');
//   console.log('====================================');

//   try {
//     // Connect to MongoDB
//     await DatabaseConnection.getInstance().connect();
//     console.log('✅ Connected to MongoDB');

//     // Always clear MongoDB data to avoid duplicate key errors on unique fields
//     console.log('\n🗑️  Clearing MongoDB data...');
//     await Category.deleteMany({});
//     await Product.deleteMany({});
//     await ProductReview.deleteMany({});
//     await SearchIndex.deleteMany({});
//     console.log('  ✅ Cleared MongoDB collections');

//     // Check if we should also clear Prisma data
//     const shouldClear = process.argv.includes('--clear');
//     if (shouldClear) {
//       console.log('\n🗑️  Clearing PostgreSQL data...');
      
//       // Clear Prisma data
//       await prisma.transaction.deleteMany({});
//       await prisma.payment.deleteMany({});
//       await prisma.orderItem.deleteMany({});
//       await prisma.order.deleteMany({});
//       await prisma.inventoryLog.deleteMany({});
//       await prisma.inventory.deleteMany({});
//       await prisma.address.deleteMany({});
//       await prisma.refreshToken.deleteMany({});
//       await prisma.systemSetting.deleteMany({});
//       await prisma.user.deleteMany({});
      
//       console.log('  ✅ Cleared PostgreSQL data');
//     }

//     // ============================================
//     // SEED BASE RECORDS (15 Core Records)
//     // ============================================
//     console.log('\n\n=== PHASE 1: SEEDING BASE RECORDS ===\n');

//     const users = await seedBaseUsers();
//     const addresses = await seedBaseAddresses(users);
//     const categories = await seedBaseCategories();
//     const systemSettings = await seedBaseSystemSettings();

//     console.log('\n\n✅ BASE RECORDS SEEDED:');
//     console.log(`  - ${users.length} Users`);
//     console.log(`  - ${addresses.length} Addresses`);
//     console.log(`  - ${categories.length} Categories`);
//     console.log(`  - ${systemSettings.length} System Settings`);

//     // ============================================
//     // SEED GENERATED RECORDS
//     // ============================================
//     console.log('\n\n=== PHASE 2: SEEDING GENERATED RECORDS ===\n');

//     const products = await seedProducts(categories);
//     const inventories = await seedInventory(products);
//     const orders = await seedOrders(users, addresses);
//     const orderItems = await seedOrderItems(orders, products);
//     const payments = await seedPayments(orders, users);
//     const transactions = await seedTransactions(payments);
//     const reviews = await seedProductReviews(products, users);
//     await seedSearchIndex(products, categories);

//     console.log('\n\n✅ GENERATED RECORDS SEEDED:');
//     console.log(`  - ${products.length} Products`);
//     console.log(`  - ${inventories.length} Inventory Records`);
//     console.log(`  - ${orders.length} Orders`);
//     console.log(`  - ${orderItems.length} Order Items`);
//     console.log(`  - ${payments.length} Payments`);
//     console.log(`  - ${transactions.length} Transactions`);
//     console.log(`  - ${reviews.length} Reviews`);

//     // ============================================
//     // SUMMARY
//     // ============================================
//     console.log('\n\n====================================');
//     console.log('✅ SEEDING COMPLETED SUCCESSFULLY');
//     console.log('====================================');
//     console.log('\n📊 SEEDING SUMMARY:');
//     console.log('\n🔵 BASE RECORDS (Phase 1):');
//     console.log(`  ├─ Users: ${users.length}`);
//     console.log(`  ├─ Addresses: ${addresses.length}`);
//     console.log(`  ├─ Categories: ${categories.length}`);
//     console.log(`  └─ System Settings: ${systemSettings.length}`);
//     console.log('\n🟢 GENERATED RECORDS (Phase 2):');
//     console.log(`  ├─ Products: ${products.length}`);
//     console.log(`  ├─ Inventory: ${inventories.length}`);
//     console.log(`  ├─ Orders: ${orders.length}`);
//     console.log(`  ├─ Order Items: ${orderItems.length}`);
//     console.log(`  ├─ Payments: ${payments.length}`);
//     console.log(`  ├─ Transactions: ${transactions.length}`);
//     console.log(`  └─ Reviews: ${reviews.length}`);
//     console.log('\n💡 Test Accounts:');
//     console.log('  ├─ Super Admin: superadmin@ecommerce.com (password: Test@123456)');
//     console.log('  ├─ Admin: admin@ecommerce.com (password: Test@123456)');
//     console.log('  └─ Customers: customer1@example.com to customer8@example.com (password: Test@123456)');
//     console.log('\n====================================\n');
//   } catch (error) {
//     console.error('\n❌ SEEDING ERROR:', error);
//     process.exit(1);
//   } finally {
//     // Disconnect
//     await PrismaService.disconnect();
//     await DatabaseConnection.getInstance().disconnect();
//     process.exit(0);
//   }
// }

// // Run the seeder
// main();

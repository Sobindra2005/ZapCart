import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';
import Product, { IProduct, IProductVariant } from '@/models/Product';
import { prisma } from '@/config/prisma';
import mongoose from 'mongoose';

/**
 * Helper function to sync product stock with Prisma Inventory
 */
const syncProductInventory = async (productId: string, sku: string, stock: number) => {
    // Check if inventory record exists
    const inventory = await prisma.inventory.findUnique({
        where: { productId },
    });

    if (inventory) {
        // Update existing inventory
        await prisma.inventory.update({
            where: { productId },
            data: {
                quantityInStock: stock,
                availableQuantity: stock,
            },
        });
    } else {
        // Create new inventory record
        await prisma.inventory.create({
            data: {
                productId,
                sku,
                quantityInStock: stock,
                availableQuantity: stock,
            },
        });
    }
};

/**
 * Create a new product
 * POST /api/v1/products
 */
export const createProduct = asyncHandler(async (req: Request, res: Response) => {
    const productData = req.body;

    // Create product in MongoDB
    const product = (await Product.create(productData)) as unknown as IProduct;

    // Sync inventory with Prisma if product tracks inventory
    if (product.trackInventory) {
        const sku = product.hasVariants && product.variants.length > 0
            ? product.variants[0].sku
            : `SKU-${product._id}`;

        await syncProductInventory(product._id.toString(), sku, product.totalStock);
    }

    res.status(201).json({
        status: 'success',
        data: { product },
    });
});

/**
 * Get all products with filtering, search, sorting, and pagination
 * GET /api/v1/products
 */
export const getAllProducts = asyncHandler(async (req: Request, res: Response) => {
    const {
        page = 1,
        limit = 20,
        sort = '-createdAt',
        category,
        brand,
        minPrice,
        maxPrice,
        status,
        visibility,
        search,
        featured,
    } = req.query;

    const filter: any = {};

    // Filter by category
    if (category) {
        filter.category = category;
    }

    // Filter by brand
    if (brand) {
        filter.brand = brand;
    }

    // Filter by price range
    if (minPrice || maxPrice) {
        filter.basePrice = {};
        if (minPrice) filter.basePrice.$gte = Number(minPrice);
        if (maxPrice) filter.basePrice.$lte = Number(maxPrice);
    }

    // Filter by status
    if (status) {
        filter.status = status;
    } else {
        // Default to active for public queries
        filter.status = 'active';
    }

    // Filter by visibility
    if (visibility) {
        filter.visibility = visibility;
    } else if (featured === 'true') {
        filter.visibility = 'featured';
    }

    // Search by text
    if (search) {
        filter.$text = { $search: search as string };
    }

    // Pagination
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Execute query
    const [products, total] = await Promise.all([
        Product.find(filter)
            .populate('category', 'name slug')
            .sort(sort as string)
            .limit(limitNum)
            .skip(skip)
            .lean(),
        Product.countDocuments(filter),
    ]);

    res.status(200).json({
        status: 'success',
        results: products.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: { products },
    });
});

/**
 * Get featured products
 * GET /api/v1/products/featured
 */
export const getFeaturedProducts = asyncHandler(async (_req: Request, res: Response) => {
    // Use static method from Product model
    const products = await Product.findFeatured(10);

    res.status(200).json({
        status: 'success',
        results: products.length,
        data: { products },
    });
});

/**
 * Get products by category
 * GET /api/v1/products/category/:categoryId
 */
export const getProductsByCategory = asyncHandler(async (req: Request, res: Response) => {
    const { categoryId } = req.params;
    const { page = 1, limit = 20, sort = '-createdAt' } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Use static method from Product model
    const [products, total] = await Promise.all([
        Product.findByCategory(categoryId, {
            limit: limitNum,
            skip,
            sort: sort as string
        }),
        Product.countDocuments({
            category: categoryId,
            status: 'active',
            visibility: { $in: ['public', 'featured'] },
        }),
    ]);

    res.status(200).json({
        status: 'success',
        results: products.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: { products },
    });
});

/**
 * Search products with full-text search
 * GET /api/v1/products/search
 */
export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { q, page = 1, limit = 20 } = req.query;

    if (!q) {
        throw new AppError('Please provide a search query', 400);
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const [products, total] = await Promise.all([
        Product.find({
            $text: { $search: q as string },
            status: 'active',
        })
            .select({ score: { $meta: 'textScore' } })
            .sort({ score: { $meta: 'textScore' } })
            .limit(limitNum)
            .skip(skip)
            .populate('category', 'name slug')
            .lean(),
        Product.countDocuments({
            $text: { $search: q as string },
            status: 'active',
        }),
    ]);

    res.status(200).json({
        status: 'success',
        results: products.length,
        total,
        data: { products },
    });
});

/**
 * Get a single product by ID or slug
 * GET /api/v1/products/:identifier
 */
export const getProductById = asyncHandler(async (req: Request, res: Response) => {
    const { identifier } = req.params;

    let product: IProduct | null;

    // Check if identifier is a valid ObjectId
    if (mongoose.Types.ObjectId.isValid(identifier)) {
        product = await Product.findById(identifier)
            .populate('category', 'name slug')
            .lean();
    } else {
        // Search by slug
        product = await Product.findOne({ slug: identifier })
            .populate('category', 'name slug')
            .lean();
    }

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

/**
 * Get related products based on category and tags
 * GET /api/v1/products/:id/related
 */
export const getRelatedProducts = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { limit = 6 } = req.query;

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Find related products by category and tags
    const relatedProducts = await Product.find({
        _id: { $ne: product._id },
        $or: [
            { category: product.category },
            { tags: { $in: product.tags } },
        ],
        status: 'active',
        visibility: { $in: ['public', 'featured'] },
    })
        .limit(Number(limit))
        .populate('category', 'name slug')
        .lean();

    res.status(200).json({
        status: 'success',
        results: relatedProducts.length,
        data: { products: relatedProducts },
    });
});

/**
 * Update a product
 * PUT /api/v1/products/:id
 */
export const updateProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const updateData = req.body;

    const product = await Product.findByIdAndUpdate(id, updateData, {
        new: true,
        runValidators: true,
    });

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Sync inventory if stock changed
    if (updateData.totalStock !== undefined && product.trackInventory) {
        const sku = product.hasVariants && product.variants.length > 0
            ? product.variants[0].sku
            : `SKU-${product._id}`;

        await syncProductInventory(product._id.toString(), sku, product.totalStock);
    }

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

/**
 * Delete a product (archive by default)
 * DELETE /api/v1/products/:id?hard=true
 */
export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { hard } = req.query;

    if (hard === 'true') {
        // Hard delete
        const product = await Product.findByIdAndDelete(id);
        if (!product) {
            throw new AppError('Product not found', 404);
        }

        // Delete from inventory
        await prisma.inventory.deleteMany({
            where: { productId: id },
        });
    } else {
        // Soft delete - archive
        const product = await Product.findByIdAndUpdate(
            id,
            { status: 'archived' },
            { new: true }
        );

        if (!product) {
            throw new AppError('Product not found', 404);
        }
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Add a variant to a product
 * POST /api/v1/products/:id/variants
 */
export const addProductVariant = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const variantData: IProductVariant = req.body;

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Add variant
    product.variants.push(variantData);
    product.hasVariants = true;
    await product.save();

    // Update total stock from variants
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    product.totalStock = totalStock;
    await product.save();

    // Sync inventory
    if (product.trackInventory) {
        await syncProductInventory(product._id.toString(), variantData.sku, totalStock);
    }

    res.status(201).json({
        status: 'success',
        data: { product },
    });
});

/**
 * Update a product variant
 * PUT /api/v1/products/:id/variants/:sku
 */
export const updateProductVariant = asyncHandler(async (req: Request, res: Response) => {
    const { id, sku } = req.params;
    const updateData = req.body;

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    const variantIndex = product.variants.findIndex(v => v.sku === sku);
    if (variantIndex === -1) {
        throw new AppError('Variant not found', 404);
    }

    // Update variant
    Object.assign(product.variants[variantIndex], updateData);
    await product.save();

    // Update total stock
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    product.totalStock = totalStock;
    await product.save();

    // Sync inventory
    if (product.trackInventory) {
        await syncProductInventory(product._id.toString(), sku, totalStock);
    }

    res.status(200).json({
        status: 'success',
        data: { product },
    });
});

/**
 * Delete a product variant
 * DELETE /api/v1/products/:id/variants/:sku
 */
export const deleteProductVariant = asyncHandler(async (req: Request, res: Response) => {
    const { id, sku } = req.params;

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    product.variants = product.variants.filter(v => v.sku !== sku);

    if (product.variants.length === 0) {
        product.hasVariants = false;
    }

    await product.save();

    // Update total stock
    const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
    product.totalStock = totalStock;
    await product.save();

    // Sync inventory
    if (product.trackInventory) {
        const mainSku = product.variants.length > 0 ? product.variants[0].sku : `SKU-${product._id}`;
        await syncProductInventory(product._id.toString(), mainSku, totalStock);
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Bulk update products
 * PATCH /api/v1/products/bulk
 * Body: { updates: [{ id, data }, ...] }
 */
export const bulkUpdateProducts = asyncHandler(async (req: Request, res: Response) => {
    const { updates } = req.body;

    if (!updates || !Array.isArray(updates)) {
        throw new AppError('Please provide updates array', 400);
    }

    const results = [];

    for (const update of updates) {
        const { id, data } = update;
        const product = await Product.findByIdAndUpdate(id, data, {
            new: true,
            runValidators: true,
        });

        if (product) {
            results.push(product);

            // Sync inventory if stock changed
            if (data.totalStock !== undefined && product.trackInventory) {
                const sku = product.hasVariants && product.variants.length > 0
                    ? product.variants[0].sku
                    : `SKU-${product._id}`;

                await syncProductInventory(product._id.toString(), sku, product.totalStock);
            }
        }
    }

    res.status(200).json({
        status: 'success',
        results: results.length,
        data: { products: results },
    });
});

/**
 * Bulk delete products
 * DELETE /api/v1/products/bulk
 * Body: { ids: [...], hard: boolean }
 */
export const bulkDeleteProducts = asyncHandler(async (req: Request, res: Response) => {
    const { ids, hard } = req.body;

    if (!ids || !Array.isArray(ids)) {
        throw new AppError('Please provide ids array', 400);
    }

    if (hard) {
        // Hard delete
        await Product.deleteMany({ _id: { $in: ids } });

        // Delete from inventory
        await prisma.inventory.deleteMany({
            where: { productId: { in: ids } },
        });
    } else {
        // Soft delete - archive
        await Product.updateMany(
            { _id: { $in: ids } },
            { status: 'archived' }
        );
    }

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Increment product view count
 * POST /api/v1/products/:id/view
 */
export const incrementProductViews = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const product = await Product.findById(id);

    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Use instance method from Product model
    await product.incrementViews();

    res.status(200).json({
        status: 'success',
        data: { viewCount: product.viewCount },
    });
});

/**
 * Update product rating
 * POST /api/v1/products/:id/rating
 * Body: { rating: number, isNew: boolean }
 */
export const updateProductRating = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const { rating, isNew = true } = req.body;

    if (!rating || rating < 0 || rating > 5) {
        throw new AppError('Please provide a valid rating between 0 and 5', 400);
    }

    const product = await Product.findById(id);
    if (!product) {
        throw new AppError('Product not found', 404);
    }

    // Use instance method from Product model
    await product.updateRating(rating, isNew);

    res.status(200).json({
        status: 'success',
        data: {
            averageRating: product.averageRating,
            reviewCount: product.reviewCount,
        },
    });
});

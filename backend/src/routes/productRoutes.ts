import { Router } from 'express';
import {
    createProduct,
    getAllProducts,
    getFeaturedProducts,
    getProductsByCategory,
    getProductById,
    getRelatedProducts,
    updateProduct,
    deleteProduct,
    addProductVariant,
    updateProductVariant,
    deleteProductVariant,
    bulkUpdateProducts,
    bulkDeleteProducts,
    addProductToFeatured,
    removeProductFromFeatured,
} from '@/controllers/product.controller';
import { protect, restrictTo } from '@/middlewares/authMiddleware';

const router = Router();

// Public routes (no authentication required)
router.get('/featured', getFeaturedProducts);
router.get('/category/:categoryId', getProductsByCategory);
router.get('/:identifier', getProductById);
router.get('/:id/related', getRelatedProducts);

router.use(protect);

// Customer routes (authenticated users)
router.get('/', getAllProducts);

// Admin routes (admin only)
router.use(restrictTo('admin'));

router.post('/', createProduct);
router.patch('/featured/add', addProductToFeatured);
router.patch('/featured/remove', removeProductFromFeatured);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

// Variant management
router.post('/:id/variants', addProductVariant);
router.put('/:id/variants/:sku', updateProductVariant);
router.delete('/:id/variants/:sku', deleteProductVariant);

// Bulk operations
router.patch('/bulk', bulkUpdateProducts);
router.delete('/bulk', bulkDeleteProducts);


export default router;

import mongoose, { Schema, Document, Model } from 'mongoose';
import { QueueService } from 'service/queueService/searchIndexService';

// Product Variant Interface
export interface IProductVariant {
  sku: string;
  size?: string;
  color?: string;
  material?: string;
  price: number;
  compareAtPrice?: number;
  stock: number;
  images?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };
}

// Product Interface
export interface IProduct extends Document {
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;

  // Pricing
  basePrice: number;
  compareAtPrice?: number;
  costPrice?: number;

  // Categorization
  category: mongoose.Types.ObjectId;
  subcategories?: mongoose.Types.ObjectId[];
  brand?: string;
  tags: string[];

  // Variants
  hasVariants: boolean;
  variants: IProductVariant[];

  // Inventory
  totalStock: number;
  lowStockThreshold: number;
  trackInventory: boolean;
  allowBackorder: boolean;

  // Media
  images: string[];
  thumbnail?: string;
  videoUrl?: string;

  // SEO & Metadata
  metaTitle?: string;
  metaDescription?: string;
  metaKeywords?: string[];

  // Product Details
  specifications?: Map<string, string>;
  features?: string[];
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'inch';
  };

  // Status & Visibility
  status: 'draft' | 'active' | 'archived';
  visibility: 'public' | 'hidden' | 'featured';
  publishedAt?: Date;

  // Sales & Analytics
  viewCount: number;
  salesCount: number;
  averageRating: number;
  reviewCount: number;

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Instance methods
  incrementViews(): Promise<this>;
  updateRating(newRating: number, isNew?: boolean): Promise<this>;
}

// Product Model Interface with static methods
export interface IProductModel extends Model<IProduct> {
  findFeatured(limit?: number): Promise<IProduct[]>;
  findByCategory(
    categoryId: string,
    options?: { limit?: number; skip?: number; sort?: any }
  ): Promise<IProduct[]>;
}

// Product Schema
const ProductVariantSchema = new Schema<IProductVariant>(
  {
    sku: {
      type: String,
      required: true,
      unique: true,
      uppercase: true,
      trim: true
    },
    size: { type: String, trim: true },
    color: { type: String, trim: true },
    material: { type: String, trim: true },
    price: {
      type: Number,
      required: true,
      min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative']
    },
    stock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    images: [{ type: String }],
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: {
        type: String,
        enum: ['cm', 'inch'],
        default: 'cm'
      }
    }
  },
  { _id: false }
);

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Product name is required'],
      trim: true,
      maxlength: [200, 'Product name cannot exceed 200 characters']
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      required: [true, 'Product description is required'],
      maxlength: [5000, 'Description cannot exceed 5000 characters']
    },
    shortDescription: {
      type: String,
      maxlength: [500, 'Short description cannot exceed 500 characters']
    },

    // Pricing
    basePrice: {
      type: Number,
      required: [true, 'Base price is required'],
      min: [0, 'Price cannot be negative']
    },
    compareAtPrice: {
      type: Number,
      min: [0, 'Compare price cannot be negative']
    },
    costPrice: {
      type: Number,
      min: [0, 'Cost price cannot be negative']
    },

    // Categorization
    category: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Product category is required'],
      index: true
    },
    subcategories: [{
      type: Schema.Types.ObjectId,
      ref: 'Category'
    }],
    brand: {
      type: String,
      trim: true,
      index: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },

    // Variants
    hasVariants: {
      type: Boolean,
      default: false
    },
    variants: {
      type: [ProductVariantSchema],
      default: []
    },

    // Inventory
    totalStock: {
      type: Number,
      required: true,
      min: [0, 'Stock cannot be negative'],
      default: 0
    },
    lowStockThreshold: {
      type: Number,
      default: 10,
      min: [0, 'Threshold cannot be negative']
    },
    trackInventory: {
      type: Boolean,
      default: true
    },
    allowBackorder: {
      type: Boolean,
      default: false
    },

    // Media
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v && v.length > 0;
        },
        message: 'At least one product image is required'
      }
    },
    thumbnail: String,
    videoUrl: String,

    // SEO & Metadata
    metaTitle: {
      type: String,
      maxlength: [60, 'Meta title cannot exceed 60 characters']
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters']
    },
    metaKeywords: [String],

    // Product Details
    specifications: {
      type: Map,
      of: String,
      default: new Map()
    },
    features: [String],
    weight: {
      type: Number,
      min: [0, 'Weight cannot be negative']
    },
    dimensions: {
      length: { type: Number, min: 0 },
      width: { type: Number, min: 0 },
      height: { type: Number, min: 0 },
      unit: {
        type: String,
        enum: ['cm', 'inch'],
        default: 'cm'
      }
    },

    // Status & Visibility
    status: {
      type: String,
      enum: ['draft', 'active', 'archived'],
      default: 'draft',
      index: true
    },
    visibility: {
      type: String,
      enum: ['public', 'hidden', 'featured'],
      default: 'public',
      index: true
    },
    publishedAt: Date,

    // Sales & Analytics
    viewCount: {
      type: Number,
      default: 0,
      min: 0
    },
    salesCount: {
      type: Number,
      default: 0,
      min: 0
    },
    averageRating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    reviewCount: {
      type: Number,
      default: 0,
      min: 0
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Indexes for performance
ProductSchema.index({ name: 'text', description: 'text', tags: 'text' });
ProductSchema.index({ category: 1, status: 1, visibility: 1 });
ProductSchema.index({ brand: 1, status: 1 });
ProductSchema.index({ basePrice: 1 });
ProductSchema.index({ averageRating: -1 });
ProductSchema.index({ salesCount: -1 });
ProductSchema.index({ createdAt: -1 });

// Virtual for checking if product is in stock
ProductSchema.virtual('inStock').get(function () {
  return this.totalStock > 0 || this.allowBackorder;
});

// Virtual for checking if stock is low
ProductSchema.virtual('isLowStock').get(function () {
  return this.trackInventory && this.totalStock <= this.lowStockThreshold && this.totalStock > 0;
});

// Virtual for discount percentage
ProductSchema.virtual('discountPercentage').get(function () {
  if (this.compareAtPrice && this.compareAtPrice > this.basePrice) {
    return Math.round(((this.compareAtPrice - this.basePrice) / this.compareAtPrice) * 100);
  }
  return 0;
});

// Pre-save middleware to generate slug if not provided
ProductSchema.pre('save', function (next) {
  if (!this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }

  // Auto-set thumbnail if not provided
  if (!this.thumbnail && this.images && this.images.length > 0) {
    this.thumbnail = this.images[0];
  }

  // Calculate total stock from variants
  if (this.hasVariants && this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, variant) => sum + variant.stock, 0);
  }
  // @ts-ignore
  next();
});

// Pre-save middleware to set publishedAt when status changes to active
ProductSchema.pre('save', function (next) {
  if (this.isModified('status') && this.status === 'active' && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  // @ts-ignore
  next();
});

// Post-save hook to sync to search index
ProductSchema.post('save', async function (doc) {
  try {
    // Only sync active products or when deleting (status change)
    if (doc.status === 'active' || (doc.isModified && doc.isModified('status'))) {
      await QueueService.syncProductToSearchIndex(doc._id.toString());
    }
  } catch (error) {
    console.error('Error syncing product to search index:', error);
    // Don't throw - sync failures shouldn't block product saves
  }
});

// Post-delete hook to remove from search index
ProductSchema.post('deleteOne', { document: true, query: false }, async function (doc) {
  try {
    const SearchIndex = (await import('@/models/SearchIndex')).default;
    await SearchIndex.deleteOne({ entityType: 'product', entityId: doc._id });
    console.log(`Removed product ${doc._id} from search index`);
  } catch (error) {
    console.error('Error removing product from search index:', error);
  }
});

// Static method to find featured products
ProductSchema.statics.findFeatured = function (limit: number = 10) {
  return this.find({
    status: 'active',
    visibility: 'featured'
  })
    .sort({ salesCount: -1, averageRating: -1 })
    .limit(limit)
    .populate('category');
};

// Static method to find products by category
ProductSchema.statics.findByCategory = function (categoryId: string, options: any = {}) {
  const { limit = 20, skip = 0, sort = { createdAt: -1 } } = options;
  return this.find({
    category: categoryId,
    status: 'active',
    visibility: { $in: ['public', 'featured'] }
  })
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Instance method to increment view count
ProductSchema.methods.incrementViews = function () {
  this.viewCount += 1;
  return this.save();
};

// Instance method to update rating
ProductSchema.methods.updateRating = function (newRating: number, isNew: boolean = true) {
  if (isNew) {
    this.averageRating = ((this.averageRating * this.reviewCount) + newRating) / (this.reviewCount + 1);
    this.reviewCount += 1;
  } else {
    // For rating updates, recalculate separately
    this.averageRating = newRating;
  }
  return this.save();
};

// Model
const Product = mongoose.model<IProduct, IProductModel>('Product', ProductSchema);

export default Product;

import mongoose, { Schema, Document, Model } from 'mongoose';
import { IProductVariant } from './Product';

// Search Index Interface
export interface ISearchIndex extends Document {
  // Reference
  entityType: 'product' | 'category';
  entityId: mongoose.Types.ObjectId;

  // Searchable fields (denormalized for fast search)
  name: string;
  description: string;
  keywords: string[];

  // Product-specific fields
  categoryName?: string;
  categorySlug?: string;
  brand?: string;
  tags?: string[];
  sku?: string;

  // Metadata for filtering
  price?: number;
  rating?: number;
  isActive: boolean;

  // Search optimization
  searchText: string; // Combined text for full-text search
  popularity: number; // Based on views, sales, etc.

  // Timestamps
  lastSyncedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Search options interface
interface ISearchOptions {
  entityType?: 'product' | 'category' | null;
  limit?: number;
  skip?: number;
  filters?: {
    brand?: string;
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    minRating?: number;
    tags?: string[];
  };
  sort?: {
    popularity?: number;
    rating?: number;
    price?: number;
    [key: string]: number | undefined;
  };
}

// Search result interface
interface ISearchResult {
  _id: mongoose.Types.ObjectId;
  entityType: 'product' | 'category';
  entityId: mongoose.Types.ObjectId;
  name: string;
  description: string;
  brand?: string;
  price?: number;
  rating?: number;
  score?: number;
  [key: string]: unknown;
}

// Sync result interface
interface ISyncResult {
  synced: number;
  failed: number;
  errors: Array<{
    productId?: mongoose.Types.ObjectId;
    categoryId?: mongoose.Types.ObjectId;
    error: unknown;
  }>;
}

// Rebuild result interface
interface IRebuildResult {
  products: ISyncResult;
  categories: ISyncResult;
  timestamp: Date;
}

// Suggestion interface
interface ISearchSuggestion {
  _id: mongoose.Types.ObjectId;
  name: string;
  entityType: 'product' | 'category';
  brand?: string;
}

// Popular search interface
interface IPopularSearch {
  _id: mongoose.Types.ObjectId;
  name: string;
  entityType: 'product' | 'category';
  brand?: string;
  price?: number;
  rating?: number;
}

interface ISearchIndexModel extends Model<ISearchIndex> {
  syncProduct(productId: string): Promise<ISearchIndex | null>;
  syncCategory(categoryId: string): Promise<ISearchIndex | null>;
  search(query: string, options?: ISearchOptions): Promise<{
    results: ISearchResult[];
    total: number;
    page: number;
    totalPages: number;
  }>;
  getSuggestions(query: string, limit?: number): Promise<ISearchSuggestion[]>;
  getPopular(entityType?: string, limit?: number): Promise<IPopularSearch[]>;
  syncAllProducts(): Promise<ISyncResult>;
  syncAllCategories(): Promise<ISyncResult>;
  rebuildIndex(): Promise<IRebuildResult>;
}

// Search Index Schema
const SearchIndexSchema = new Schema<ISearchIndex, ISearchIndexModel>(
  {
    // Reference
    entityType: {
      type: String,
      enum: ['product', 'category'],
      required: true,
      index: true
    },
    entityId: {
      type: Schema.Types.ObjectId,
      required: true,
      index: true
    },

    // Searchable fields
    name: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    description: {
      type: String,
      default: ''
    },
    keywords: {
      type: [String],
      default: [],
      index: true
    },

    // Product-specific fields
    categoryName: {
      type: String,
      index: true
    },
    categorySlug: String,
    brand: {
      type: String,
      index: true
    },
    tags: {
      type: [String],
      default: [],
      index: true
    },
    sku: {
      type: String,
      uppercase: true,
      sparse: true,
      index: true
    },

    // Metadata for filtering
    price: {
      type: Number,
      index: true
    },
    rating: {
      type: Number,
      index: true
    },
    isActive: {
      type: Boolean,
      default: true,
      index: true
    },

    // Search optimization
    searchText: {
      type: String,
      required: true
    },
    popularity: {
      type: Number,
      default: 0,
      index: true
    },

    // Timestamps
    lastSyncedAt: {
      type: Date,
      default: Date.now,
      index: true
    }
  },
  {
    timestamps: true
  }
);

// Compound indexes for common queries
SearchIndexSchema.index({ entityType: 1, entityId: 1 }, { unique: true });
SearchIndexSchema.index({ isActive: 1, popularity: -1 });
SearchIndexSchema.index({ brand: 1, isActive: 1 });
SearchIndexSchema.index({ price: 1, isActive: 1 });
SearchIndexSchema.index({ rating: -1, isActive: 1 });

// Text index for full-text search
SearchIndexSchema.index({
  name: 'text',
  description: 'text',
  keywords: 'text',
  brand: 'text',
  tags: 'text',
  categoryName: 'text'
}, {
  weights: {
    name: 10,
    keywords: 8,
    brand: 6,
    tags: 5,
    categoryName: 4,
    description: 2
  },
  name: 'search_text_index'
});

// Pre-save middleware to build searchText
SearchIndexSchema.pre('save', function () {
  // Combine all searchable fields into searchText
  const parts = [
    this.name,
    this.description,
    ...(this.keywords || []),
    this.brand || '',
    ...(this.tags || []),
    this.categoryName || '',
    this.sku || ''
  ];

  this.searchText = parts
    .filter(p => p && p.trim().length > 0)
    .join(' ')
    .toLowerCase()
    .trim();
});

// Static method to sync product to search index
SearchIndexSchema.statics.syncProduct = async function (productId: string) {
  const Product = mongoose.model('Product');

  const product = await Product.findById(productId).populate('category');

  if (!product) {
    // Remove from index if product doesn't exist
    await this.deleteOne({ entityType: 'product', entityId: productId });
    return null;
  }

  const category = product.category;

  // Extract all variant SKUs
  const skus = product.hasVariants
    ? product.variants.map((v: IProductVariant) => v.sku).filter(Boolean)
    : [];

  // Build keywords
  const keywords = [
    ...product.tags,
    product.brand || '',
    category?.name || '',
    ...skus
  ].filter(Boolean);

  const indexData = {
    entityType: 'product',
    entityId: product._id,
    name: product.name,
    description: product.description || '',
    keywords,
    categoryName: category?.name,
    categorySlug: category?.slug,
    brand: product.brand,
    tags: product.tags,
    sku: skus.length > 0 ? skus[0] : undefined, // Primary SKU
    price: product.basePrice,
    rating: product.averageRating,
    isActive: product.status === 'active' && product.visibility !== 'hidden',
    popularity: (product.viewCount || 0) + (product.salesCount || 0) * 10,
    lastSyncedAt: new Date()
  };

  return this.findOneAndUpdate(
    { entityType: 'product', entityId: product._id },
    indexData,
    { upsert: true, new: true }
  );
};

// Static method to sync category to search index
SearchIndexSchema.statics.syncCategory = async function (categoryId: string) {
  const Category = mongoose.model('Category');
  const category = await Category.findById(categoryId);

  if (!category) {
    await this.deleteOne({ entityType: 'category', entityId: categoryId });
    return null;
  }

  const indexData = {
    entityType: 'category',
    entityId: category._id,
    name: category.name,
    description: category.description || '',
    keywords: category.metaKeywords || [],
    isActive: category.isActive,
    popularity: category.productCount || 0,
    lastSyncedAt: new Date()
  };

  return this.findOneAndUpdate(
    { entityType: 'category', entityId: category._id },
    indexData,
    { upsert: true, new: true }
  );
};

// Static method to perform search
SearchIndexSchema.statics.search = async function (query: string, options: ISearchOptions = {}) {
  const {
    entityType = null,
    limit = 20,
    skip = 0,
    filters = {},
    sort = { popularity: -1, rating: -1 }
  } = options;

  interface SearchQuery {
    $text: { $search: string };
    isActive: boolean;
    entityType?: 'product' | 'category';
    brand?: string;
    categorySlug?: string;
    price?: {
      $gte?: number;
      $lte?: number;
    };
    rating?: {
      $gte: number;
    };
    tags?: {
      $in: string[];
    };
  }

  const searchQuery: SearchQuery = {
    $text: { $search: query },
    isActive: true
  };

  if (entityType) {
    searchQuery.entityType = entityType;
  }

  // Apply filters
  if (filters.brand) {
    searchQuery.brand = filters.brand;
  }

  if (filters.category) {
    searchQuery.categorySlug = filters.category;
  }

  if (filters.minPrice || filters.maxPrice) {
    searchQuery.price = {};
    if (filters.minPrice) searchQuery.price.$gte = filters.minPrice;
    if (filters.maxPrice) searchQuery.price.$lte = filters.maxPrice;
  }

  if (filters.minRating) {
    searchQuery.rating = { $gte: filters.minRating };
  }

  if (filters.tags && filters.tags.length > 0) {
    searchQuery.tags = { $in: filters.tags };
  }

  const sortObject: Record<string, number | { $meta: string }> = {
    score: { $meta: 'textScore' },
    ...sort
  };

  const results = await this.find(searchQuery, {
    score: { $meta: 'textScore' }
  })
    .sort(sortObject as unknown as string)
    .limit(limit)
    .skip(skip)
    .lean();

  const total = await this.countDocuments(searchQuery);

  return {
    results,
    total,
    page: Math.floor(skip / limit) + 1,
    totalPages: Math.ceil(total / limit)
  };
};

// Static method to get search suggestions/autocomplete
SearchIndexSchema.statics.getSuggestions = async function (query: string, limit: number = 5) {
  const regex = new RegExp(`^${query}`, 'i');

  return this.find({
    $or: [
      { name: regex },
      { keywords: regex },
      { brand: regex }
    ],
    isActive: true
  })
    .select('name entityType brand')
    .sort({ popularity: -1 })
    .limit(limit)
    .lean();
};

// Static method to get popular searches
SearchIndexSchema.statics.getPopular = async function (entityType: string = 'product', limit: number = 10) {
  return this.find({
    entityType,
    isActive: true
  })
    .select('name entityType brand price rating')
    .sort({ popularity: -1, rating: -1 })
    .limit(limit)
    .lean();
};

// Static method to sync all products
SearchIndexSchema.statics.syncAllProducts = async function () {
  const Product = mongoose.model('Product');
  const products = await Product.find({ status: 'active' }).select('_id');

  const results: ISyncResult = {
    synced: 0,
    failed: 0,
    errors: []
  };

  for (const product of products) {
    try {
      await this.syncProduct(product._id.toString());
      results.synced++;
    } catch (error) {
      results.failed++;
      results.errors.push({ productId: product._id, error });
    }
  }

  return results;
};

// Static method to sync all categories
SearchIndexSchema.statics.syncAllCategories = async function () {
  const Category = mongoose.model('Category');
  const categories = await Category.find({ isActive: true }).select('_id');

  const results: ISyncResult = {
    synced: 0,
    failed: 0,
    errors: []
  };

  for (const category of categories) {
    try {
      await this.syncCategory(category._id.toString());
      results.synced++;
    } catch (error) {
      results.failed++;
      results.errors.push({ categoryId: category._id, error });
    }
  }

  return results;
};

// Static method to rebuild entire index
SearchIndexSchema.statics.rebuildIndex = async function () {
  // Clear existing index
  await this.deleteMany({});

  // Sync all products and categories
  const productResults = await this.syncAllProducts();
  const categoryResults = await this.syncAllCategories();

  return {
    products: productResults,
    categories: categoryResults,
    timestamp: new Date()
  };
};

// Model
const SearchIndex = mongoose.model<ISearchIndex, ISearchIndexModel>(
  'SearchIndex',
  SearchIndexSchema
);

export default SearchIndex;

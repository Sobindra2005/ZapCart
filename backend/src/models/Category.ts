import mongoose, { Schema, Document, Model } from 'mongoose';
import { QueueService } from 'service/queueService/searchIndexService';

// Category Interface
export interface ICategory extends Document {
    name: string;
    slug: string;
    description?: string;

    // Hierarchy
    parent?: mongoose.Types.ObjectId;
    ancestors: mongoose.Types.ObjectId[];
    level: number;

    // Display
    image?: string;
    icon?: string;
    color?: string;

    // SEO
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];

    // Status
    isActive: boolean;
    displayOrder: number;

    // Analytics
    productCount: number;

    // Virtual properties
    children?: any[];

    // Timestamps
    createdAt: Date;
    updatedAt: Date;
}

// Static methods interface
interface ICategoryModel extends Model<ICategory> {
    getDescendants(): Promise<ICategory[]>;
    getChildren(): Promise<ICategory[]>;
    getFullPath(): Promise<string>;
    updateProductCount(): Promise<ICategory>;
    getCategoryTree(parentId?: string | null): Promise<any[]>;
    getRootCategories(): Promise<ICategory[]>;
    getBreadcrumb(categoryId: string): Promise<any[]>;
}

const CategorySchema = new Schema<ICategory, ICategoryModel>(
    {
        name: {
            type: String,
            required: [true, 'Category name is required'],
            trim: true,
            unique: true,
            maxlength: [100, 'Category name cannot exceed 100 characters']
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
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        },

        // Hierarchy
        parent: {
            type: Schema.Types.ObjectId,
            ref: 'Category',
            default: null,
            index: true
        },
        ancestors: [{
            type: Schema.Types.ObjectId,
            ref: 'Category'
        }],
        level: {
            type: Number,
            default: 0,
            min: 0,
            index: true
        },

        image: String,
        icon: String,
        color: {
            type: String,
            match: [/^#[0-9A-F]{6}$/i, 'Please provide a valid hex color code']
        },

        // SEO
        metaTitle: {
            type: String,
            maxlength: [60, 'Meta title cannot exceed 60 characters']
        },
        metaDescription: {
            type: String,
            maxlength: [160, 'Meta description cannot exceed 160 characters']
        },
        metaKeywords: [String],

        // Status
        isActive: {
            type: Boolean,
            default: true,
            index: true
        },
        displayOrder: {
            type: Number,
            default: 0,
            index: true
        },

        // Analytics
        productCount: {
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

// Compound indexes for performance
CategorySchema.index({ parent: 1, displayOrder: 1 });
CategorySchema.index({ level: 1, isActive: 1 });
CategorySchema.index({ name: 'text', description: 'text' });

// Virtual for checking if category is root
CategorySchema.virtual('isRoot').get(function () {
    return !this.parent;
});

// Virtual for getting full path (requires population)
CategorySchema.virtual('children', {
    ref: 'Category',
    localField: '_id',
    foreignField: 'parent'
});

// Pre-save middleware to generate slug if not provided
CategorySchema.pre('save', async function (next) {
    // Generate slug from name if not provided
    if (!this.slug || this.isModified('name')) {
        this.slug = this.name
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/--+/g, '-')
            .trim();
    }

    // Calculate level and ancestors based on parent
    if (this.isModified('parent')) {
        if (this.parent) {
            const parentCategory = await mongoose.model('Category').findById(this.parent);
            if (parentCategory) {
                this.level = parentCategory.level + 1;
                this.ancestors = [...parentCategory.ancestors, parentCategory._id];
            }
        } else {
            this.level = 0;
            this.ancestors = [];
        }
    }

    // @ts-ignore
    next();
});

// Pre-save validation: prevent circular references
CategorySchema.pre('save', async function (next) {
    if (this.parent && this.isModified('parent')) {
        // Check if parent is the same as current category
        if (this.parent.equals(this._id)) {
            // @ts-ignore
            return next(new Error('A category cannot be its own parent'));
        }

        // Check if parent is one of the descendants
        const descendants = await mongoose.model('Category').find({
            ancestors: this._id
        }).select('_id');

        const descendantIds = descendants.map(d => d._id.toString());
        if (descendantIds.includes(this.parent.toString())) {
            // @ts-ignore
            return next(new Error('Cannot set a descendant category as parent (circular reference)'));
        }
    }
    // @ts-ignore
    next();
});

// Post-save middleware to update children when parent changes
CategorySchema.post('save', async function (doc) {
    // Update all children's ancestors when this category's hierarchy changes
    const children = await mongoose.model('Category').find({ parent: doc._id });

    for (const child of children) {
        child.ancestors = [...doc.ancestors, doc._id];
        child.level = doc.level + 1;
        await child.save();
    }
});

// Post-save hook to sync to search index
CategorySchema.post('save', async function (doc) {
    try {
        // Sync active categories or when status changes
        if (doc.isActive || (doc.isModified && doc.isModified('isActive'))) {
            await QueueService.syncCategoryToSearchIndex(doc._id.toString());
        }
    } catch (error) {
        console.error('Error syncing category to search index:', error);
        // Don't throw - sync failures shouldn't block category saves
    }
});

// Post-delete hook to remove from search index
CategorySchema.post('deleteOne', { document: true, query: false }, async function (doc) {
    try {
        const SearchIndex = (await import('@/models/SearchIndex')).default;
        await SearchIndex.deleteOne({ entityType: 'category', entityId: doc._id });
        console.log(`Removed category ${doc._id} from search index`);
    } catch (error) {
        console.error('Error removing category from search index:', error);
    }
});

CategorySchema.pre('deleteOne', { document: true, query: false }, async function (next) {
    const CategoryModel = mongoose.model('Category');

    // Option 1: Recursively update all descendants
    const descendants = await CategoryModel.find({ ancestors: this._id });

    for (const descendant of descendants) {
        // Remove this category from ancestors array
        descendant.ancestors = descendant.ancestors.filter(
            (id: any) => !id.equals(this._id)
        );

        // Recalculate level based on remaining ancestors
        descendant.level = descendant.ancestors.length;

        // If direct child, update parent
        if (descendant.parent?.equals(this._id)) {
            descendant.parent = this.parent || null;
        }

        await descendant.save();
    }
    // @ts-ignore
    next();
});

// Static method to get category tree
CategorySchema.statics.getCategoryTree = async function (parentId: mongoose.Types.ObjectId) {
    const categories = await this.find({
        parent: parentId,
        isActive: true
    })
        .sort({ displayOrder: 1, name: 1 })
        .lean();

    // Recursively fetch children
    for (const category of categories) {
        category.children = await this.getCategoryTree(category._id.toString());
    }

    return categories;
};

// Static method to get root categories
CategorySchema.statics.getRootCategories = function () {
    return this.find({
        parent: null,
        isActive: true
    })
        .sort({ displayOrder: 1, name: 1 });
};

// Static method to get breadcrumb path
CategorySchema.statics.getBreadcrumb = async function (categoryId: string) {
    const category = await this.findById(categoryId).populate('ancestors');
    if (!category) return [];

    const breadcrumb = [];
    for (const ancestorId of category.ancestors) {
        const ancestor = await this.findById(ancestorId).select('name slug');
        if (ancestor) breadcrumb.push(ancestor);
    }
    breadcrumb.push({ name: category.name, slug: category.slug, _id: category._id });

    return breadcrumb;
};

// Instance method to update product count
CategorySchema.methods.updateProductCount = async function () {
    const Product = mongoose.model('Product');
    this.productCount = await Product.countDocuments({
        category: this._id,
        status: 'active'
    });
    return this.save();
};

const Category = mongoose.model<ICategory, ICategoryModel>('Category', CategorySchema);

export default Category;
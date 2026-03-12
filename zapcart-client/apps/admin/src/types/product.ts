interface ICategory {
    _id?: string;
    id?: string;
    name?: string;
}

interface IProductVariant {
    _id?: string;
    sku?: string;
    price?: number;
    stock?: number;
}

interface IDimensions {
    length: number;
    width: number;
    height: number;
}

export interface Product {
    _id: string;
    id: string;
    name: string;
    slug: string;
    description: string;
    shortDescription?: string;
    basePrice: number;
    compareAtPrice?: number;
    costPrice?: number;
    category: ICategory | string;
    subcategories?: ICategory[] | string[];
    brand?: string;
    tags: string[];
    hasVariants: boolean;
    variants: IProductVariant[];
    totalStock: number;
    lowStockThreshold: number;
    trackInventory: boolean;
    allowBackorder: boolean;
    images: string[];
    thumbnail?: string;
    videoUrl?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string[];
    specifications?: Record<string, string>;
    features?: string[];
    weight?: number;
    dimensions?: IDimensions;
    status: "draft" | "active" | "archived";
    visibility: "public" | "hidden" | "featured";
    publishedAt?: string;
    viewCount: number;
    salesCount: number;
    averageRating: number;
    reviewCount: number;
    inStock: boolean;
    isLowStock: boolean;
    discountPercentage: number;
    createdAt: string;
    updatedAt: string;
}

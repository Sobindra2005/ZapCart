import { Product } from "@/types/product";

export const mockProducts: Product[] = [
    {
        id: "1",
        name: "Classic White Sneakers",
        description: "Minimalist white sneakers for everyday wear.",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=2012&auto=format&fit=crop",
        rating: 4.5,
        reviewCount: 120,
        category: "Footwear",
        sizes: ["US 8", "US 9", "US 10", "US 11"],
        shippingInfo: {
            discount: "10%",
            packageType: "Box",
            deliveryTime: "3-5 days",
            estimatedDelivery: "Sep 20"
        }
    },
    {
        id: "2",
        name: "Leather Messenger Bag",
        description: "Premium leather bag with multiple compartments.",
        price: 149.50,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?q=80&w=1974&auto=format&fit=crop",
        rating: 4.8,
        reviewCount: 45,
        category: "Accessories",
        tags: ["leather", "work", "bag"] // Adding tags even if not in interface yet, casting handled in map if needed or updated interface
    } as Product, // Cast to Product to avoid TS issues if I locally extended it in mind
    {
        id: "3",
        name: "Wireless Noise-Canceling Headphones",
        description: "Immersive sound with active noise cancellation.",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=2070&auto=format&fit=crop",
        rating: 4.2,
        reviewCount: 302,
        category: "Electronics"
    },
    {
        id: "4",
        name: "Cotton Crew Neck T-Shirt",
        description: "Soft, breathable cotton t-shirt in various colors.",
        price: 24.99,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=2080&auto=format&fit=crop",
        rating: 4.0,
        reviewCount: 89,
        category: "Apparel"
    },
    {
        id: "5",
        name: "Smart Fitness Watch",
        description: "Track your health and fitness goals.",
        price: 199.00,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=1999&auto=format&fit=crop",
        rating: 4.6,
        reviewCount: 215,
        category: "Electronics"
    },
    {
        id: "6",
        name: "Denim Jacket",
        description: "Classic denim jacket for a casual look.",
        price: 79.95,
        image: "https://images.unsplash.com/photo-1611312449412-6aefac5ef3cb?q=80&w=1974&auto=format&fit=crop",
        rating: 4.4,
        reviewCount: 67,
        category: "Apparel"
    }
];

export const mockFilters = {
    brands: ["Nike", "Adidas", "Apple", "Sony", "Levi's", "Zara"],
    categories: ["Electronics", "Apparel", "Footwear", "Accessories", "Home"],
    tags: ["Best Seller", "New Arrival", "Sale", "Limited Edition"],
    ratings: [4, 3, 2, 1],
    priceRange: { min: 0, max: 1000 }
};

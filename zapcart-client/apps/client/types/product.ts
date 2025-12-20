export interface Review {
    id: string;
    userId: string;
    userName: string;
    userAvatar?: string;
    rating: number;
    title?: string;
    comment: string;
    date: string;
}

export interface ShippingInfo {
    discount: string;
    packageType: string;
    deliveryTime: string;
    estimatedDelivery: string;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    detailedDescription?: string;
    price: number;
    image: string;
    images?: string[];
    rating: number;
    reviewCount: number;
    reviews?: Review[];
    category: string;
    sizes?: string[];
    tags?: string[];
    shippingInfo?: ShippingInfo;
}

import { Product } from "./product";

export interface Address {
    id: number;
    userId: number;
    fullName: string;
    phone: string;
    address: string;
    city: string;
    postalCode: string;
    location: {
        latitude: number;
        longitude: number;
    };
    isDefault: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface OrderItem {
    id: string;
    product: Product;
    quantity: number;
    price: number;
}

export interface Order {
    id: string;
    date: string;
    status: "Placed" | "Shipped" | "Delivered" | "Cancelled";
    total: number;
    items: OrderItem[];
    trackingNumber?: string;
}

export interface PaymentMethod {
    id: string;
    type: "Credit Card" | "PayPal";
    last4?: string;
    expiryDate?: string;
    brand?: string; // e.g., Visa, Mastercard
    isDefault: boolean;
}



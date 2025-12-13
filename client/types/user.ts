import { Product } from "./product";

export interface Address {
    id: string;
    type: "Home" | "Work" | "Other";
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
    isDefault: boolean;
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

export interface User {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar?: string;
    addresses: Address[];
    orders: Order[];
    wishlist: Product[]; // Reusing Product type
    paymentMethods: PaymentMethod[];
    notifications: {
        email: boolean;
        sms: boolean;
        promotional: boolean;
    };
}

import { Address } from "@/types/user";


export interface OrderItem {
    id: number;
    orderId: number;
    productId: string;
    sku: string;
    quantity: number;
    unitPrice: string;
    totalPrice: string;
    discount: string;
    createdAt: string;
    updatedAt: string;
    product:{
        id: string;
        name: string;
        slug: string;
        thumbnail: string;
    }
}

export interface Order {
    id: number;
    userId: number;
    orderNumber: string;
    status: string;
    shippingAddressId: number;
    billingAddressId: number;
    subtotal: string;
    shippingCost: string;
    tax: string;
    discount: string;
    totalAmount: string;
    trackingNumber: string;
    estimatedDelivery: string;
    deliveredAt: string | null;
    customerNotes: string | null;
    adminNotes: string | null;
    createdAt: string;
    updatedAt: string;
    orderItems: OrderItem[];
    shippingAddress: Address;
    billingAddress: Address;
}
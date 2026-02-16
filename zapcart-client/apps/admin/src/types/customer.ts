export type UserRole = "CUSTOMER" | "ADMIN" | "SUPERADMIN";
export type CustomerStatus = "ACTIVE" | "SUSPENDED" | "DELETED";
export type OrderStatus = "PENDING" | "PAYMENT_PENDING" | "PAYMENT_FAILED" | "CONFIRMED" | "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";

export interface Order {
    id: number;
    orderNumber: string;
    status: OrderStatus;
    totalAmount: string;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerCount {
    orders: number;
    addresses: number;
}

export interface Customer {
    id: number;
    email: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    status: CustomerStatus;
    emailVerified: boolean;
    lastLogin: string | null;
    createdAt: string;
    updatedAt: string;
    avatar: string;
    orders: Order[];
    _count: CustomerCount;
    totalSpent: number;
}
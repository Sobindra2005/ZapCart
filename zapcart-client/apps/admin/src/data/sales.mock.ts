/**
 * Sales Dashboard Mock Data
 * 
 * This file contains all mock/default data for the sales dashboard.
 * When integrating with real APIs, replace these with actual API responses.
 * The data structures match the expected API response formats.
 */

// ============================================
// Types
// ============================================

export interface RevenueTrendDataPoint {
    name: string;
    sales: number;
}

export interface TopProduct {
    id: string;
    name: string;
    sales: number;
    thumbnail?: string;
}

export interface ChannelData {
    name: string;
    value: number;
    color: string;
}

export interface KpiData {
    value: number;
    growthRate: number;
    comparisonRange: string;
    range: string;
}

export interface Order {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: 'Paid' | 'Pending' | 'Refunded';
    items: number;
}

export interface LiveActivity {
    user: string;
    action: string;
    time: string;
}

// ============================================
// Default/Empty Data
// ============================================

export const REVENUE_TREND_DEFAULT: RevenueTrendDataPoint[] = [
    { name: "Mon", sales: 0 },
    { name: "Tue", sales: 0 },
    { name: "Wed", sales: 0 },
    { name: "Thu", sales: 0 },
    { name: "Fri", sales: 0 },
    { name: "Sat", sales: 0 },
    { name: "Sun", sales: 0 },
];

export const TOP_PRODUCTS_DEFAULT: TopProduct[] = [];

export const CHANNEL_DATA_DEFAULT: ChannelData[] = [];

export const ORDERS_DEFAULT: Order[] = [];

// ============================================
// Mock Data (for development/testing)
// ============================================

export const REVENUE_TREND_MOCK: RevenueTrendDataPoint[] = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 5000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 2390 },
    { name: "Sun", sales: 3490 },
];

export const TOP_PRODUCTS_MOCK: TopProduct[] = [
    { id: "1", name: "iPhone 15 Pro", sales: 420 },
    { id: "2", name: "MacBook Air", sales: 380 },
    { id: "3", name: "AirPods Max", sales: 310 },
    { id: "4", name: "iPad Pro", sales: 290 },
    { id: "5", name: "Apple Watch", sales: 250 },
];

export const CHANNEL_DATA_MOCK: ChannelData[] = [
    { name: "Direct", value: 45, color: "#3b82f6" },
    { name: "Social", value: 30, color: "#10b981" },
    { name: "Email", value: 15, color: "#f59e0b" },
    { name: "Search", value: 10, color: "#ef4444" },
];

export const ORDERS_MOCK: Order[] = [
    { id: "ORD-7392", customer: "Amrita Shrestha", date: "2024-03-23", amount: "$129.00", status: "Paid", items: 2 },
    { id: "ORD-7391", customer: "Bibek Poudel", date: "2024-03-23", amount: "$45.50", status: "Pending", items: 1 },
    { id: "ORD-7390", customer: "Sita Thapa", date: "2024-03-22", amount: "$899.00", status: "Paid", items: 3 },
    { id: "ORD-7389", customer: "Rahul Gupta", date: "2024-03-22", amount: "$210.00", status: "Refunded", items: 2 },
    { id: "ORD-7388", customer: "Pooja Rai", date: "2024-03-21", amount: "$56.00", status: "Paid", items: 1 },
];

export const LIVE_ACTIVITY_MOCK: LiveActivity[] = [
    { user: "Ram", action: "purchased Airpods", time: "2m ago" },
    { user: "Gita", action: "ordered iPhone 15", time: "5m ago" },
    { user: "Shyam", action: "canceled a return", time: "12m ago" },
];

// ============================================
// Chart Colors
// ============================================

export const CHART_COLORS = {
    primary: "#3b82f6",
    secondary: "#6366f1",
    tertiary: "#06b6d4",
    quaternary: "#f59e42",
    quinary: "#10b981",
} as const;

export const BAR_CHART_COLORS = [
    CHART_COLORS.primary,
    CHART_COLORS.secondary,
    CHART_COLORS.tertiary,
    CHART_COLORS.quaternary,
    CHART_COLORS.quinary,
];

// ============================================
// Menu Items Configuration
// ============================================

export const TIME_RANGE_MENU_ITEMS = [
    { label: "Today", accessorKey: "today" },
    { label: "This Week", accessorKey: "week" },
    { label: "This Month", accessorKey: "month" },
    { label: "This Year", accessorKey: "year" },
] as const;

export const TOP_PRODUCTS_MENU_ITEMS = [
    { label: "Today", accessorKey: "today" },
    { label: "This Week", accessorKey: "week" },
    { label: "This Month", accessorKey: "month" },
    { label: "This Year", accessorKey: "year" },
] as const;

export const CHANNEL_MENU_ITEMS = [
    { label: "View Details", accessorKey: "viewDetails" },
    { label: "Export Data", accessorKey: "exportData" },
] as const;

/**
 * EmptyState Component
 * 
 * A reusable empty state component for displaying when no data is available.
 * Follows modern SaaS dashboard design patterns with clean typography and balanced spacing.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { PackageOpen, TrendingUp, PieChart, ShoppingCart, LucideIcon } from "lucide-react";

export type EmptyStateVariant = "products" | "revenue" | "channel" | "orders" | "default";

interface EmptyStateProps {
    variant?: EmptyStateVariant;
    title?: string;
    description?: string;
    icon?: LucideIcon;
    className?: string;
    action?: React.ReactNode;
}

const variantConfig: Record<EmptyStateVariant, { icon: LucideIcon; title: string; description: string }> = {
    products: {
        icon: PackageOpen,
        title: "No products sold yet",
        description: "Once products are sold, they'll appear here ranked by popularity.",
    },
    revenue: {
        icon: TrendingUp,
        title: "No revenue data",
        description: "Revenue insights will appear once sales are recorded.",
    },
    channel: {
        icon: PieChart,
        title: "No sales data available",
        description: "Channel breakdown will appear when sales data is available.",
    },
    orders: {
        icon: ShoppingCart,
        title: "No orders yet",
        description: "Recent orders will appear here once customers start ordering.",
    },
    default: {
        icon: PackageOpen,
        title: "No data available",
        description: "Data will appear here once it's available.",
    },
};

export function EmptyState({
    variant = "default",
    title,
    description,
    icon: CustomIcon,
    className,
    action,
}: EmptyStateProps) {
    const config = variantConfig[variant];
    const Icon = CustomIcon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4",
                "text-center",
                className
            )}
        >
            <div className="rounded-full bg-gray-100 p-4 mb-4">
                <Icon className="h-8 w-8 text-gray-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {displayTitle}
            </h3>
            <p className="text-xs text-gray-500 max-w-50">
                {displayDescription}
            </p>
            {action && <div className="mt-4">{action}</div>}
        </div>
    );
}

/**
 * Compact version for smaller containers
 */
export function EmptyStateCompact({
    variant = "default",
    title,
    description,
    icon: CustomIcon,
    className,
}: Omit<EmptyStateProps, "action">) {
    const config = variantConfig[variant];
    const Icon = CustomIcon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-8 px-4",
                "text-center",
                className
            )}
        >
            <div className="rounded-full bg-gray-50 p-3 mb-3">
                <Icon className="h-5 w-5 text-gray-400" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-medium text-gray-500">
                {displayTitle}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 max-w-45">
                {displayDescription}
            </p>
        </div>
    );
}

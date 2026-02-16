import React from "react";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { AdminCard } from "../AdminCard";
import { cn } from "@repo/lib/utils";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export interface MenuItem {
    /**
     * The text to display in the menu
     */
    label: string;

    /**
     * Unique identifier for the action
     */
    accessorKey: string;

    /**
     * Whether this menu item should be visible
     * @default true
     */
    visible?: boolean;
}

export interface StatCardProps {
    /**
     * The label/title of the stat (e.g., "Total Sales", "Monthly Revenue")
     */
    label: string;

    /**
     * The main value to display (e.g., "$34,456.00", "3456")
     */
    value: string | number;

    /**
     * The trend indicator text (e.g., "+ 14%", "- 17%")
     */
    trend: string;

    /**
     * Direction of the trend for visual styling
     */
    trendDir: "up" | "down";

    /**
     * Comparison context (e.g., "VS last week", "VS last month")
     */
    vs: string;

    /**
     * Optional additional CSS classes
     */
    className?: string;

    /**
     * Whether to show the more options button
     * @default true
     */
    showMoreButton?: boolean;

    /**
     * Menu items to display in the dropdown
     * If provided, renders a dropdown menu instead of simple button
     */
    menuItems?: MenuItem[];

    /**
     * Callback when a menu item is selected
     * Receives the accessorKey of the selected item
     */
    onMenuSelect?: (accessorKey: string) => void;

    /**
     * @deprecated Use menuItems and onMenuSelect instead
     * Callback when more options button is clicked (legacy support)
     */
    onMoreClick?: () => void;
}

/**
 * StatCard - A single, reusable KPI card component
 * 
 * Displays a key metric with its value, trend, and comparison context.
 * Use this component directly when you need fine-grained control over rendering.
 * 
 * @example
 * ```tsx
 * // Basic usage
 * <StatCard
 *   label="Total Sales"
 *   value="$34,456.00"
 *   trend="+ 14%"
 *   trendDir="up"
 *   vs="VS last week"
 * />
 * 
 * // With dropdown menu
 * <StatCard
 *   label="Total Sales"
 *   value="$34,456.00"
 *   trend="+ 14%"
 *   trendDir="up"
 *   vs="VS last week"
 *   menuItems={[
 *     { label: "View Details", accessorKey: "view" },
 *     { label: "Export Data", accessorKey: "export" },
 *     { label: "Share", accessorKey: "share", visible: false }
 *   ]}
 *   onMenuSelect={(key) => console.log('Selected:', key)}
 * />
 * ```
 */
export const StatCard = React.memo<StatCardProps>(({
    label,
    value,
    trend,
    trendDir,
    vs,
    className,
    showMoreButton = true,
    menuItems,
    onMenuSelect,
}) => {
    // Filter visible menu items
    const visibleMenuItems = menuItems?.filter(item => item.visible !== false) ?? [];
    const hasMenuItems = visibleMenuItems.length > 0;

    const handleMenuChange = (value: string) => {
        onMenuSelect?.(value);
    };

    return (
        <AdminCard hoverable className={cn("group", className)}>
            <div className="flex justify-between items-start mb-4">
                <span className="text-sm font-medium text-gray-500">{label}</span>
                {hasMenuItems && (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <button
                                className="text-gray-400 hover:text-gray-600 transition-colors"
                                aria-label="More options"
                                type="button"
                            >
                                <MoreHorizontal className="h-5 w-5" />
                            </button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent  align="end">
                            {visibleMenuItems.map((item) => (
                                <DropdownMenuItem
                                    key={item.accessorKey}
                                    onClick={() => handleMenuChange(item.accessorKey)}
                                >
                                    {item.label}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">{value}</h3>
            <div className="flex items-center gap-2">
                <div
                    className={cn(
                        "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold font-sans",
                        trendDir === "up"
                            ? "bg-green-50 text-green-600"
                            : "bg-red-50 text-red-600"
                    )}
                >
                    {trendDir === "up" ? (
                        <TrendingUp className="h-3 w-3" />
                    ) : (
                        <TrendingDown className="h-3 w-3" />
                    )}
                    {trend}
                </div>
                <span className="text-xs font-medium text-gray-400">{vs}</span>
            </div>
        </AdminCard>
    );
});

StatCard.displayName = "StatCard";

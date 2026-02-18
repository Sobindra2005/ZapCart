/**
 * Sales Dashboard Skeleton Components
 * 
 * Skeleton loading states for all sales dashboard sections.
 * Matches the exact layout of final UI to prevent layout shift.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { Skeleton } from "@repo/ui/ui/skeleton";
import { CardContent } from "@repo/ui/ui/card";

/**
 * Base shimmer effect for consistent animation
 */
const shimmerClass = "animate-pulse bg-gray-200";

/**
 * Revenue Insights Chart Skeleton
 * Matches the area chart layout
 */
export function RevenueInsightsSkeleton({ className }: { className?: string }) {
    return (
        <CardContent className={cn("h-87.5", className)}>
            <div className="w-full h-full flex flex-col">
                {/* Y-axis labels */}
                <div className="flex h-full">
                    <div className="flex flex-col justify-between pr-4 py-2">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-3 w-8" />
                        ))}
                    </div>
                    {/* Chart area */}
                    <div className="flex-1 relative">
                        {/* Grid lines */}
                        <div className="absolute inset-0 flex flex-col justify-between">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="border-b border-gray-100" />
                            ))}
                        </div>
                        {/* Chart wave placeholder */}
                        <div className="absolute inset-x-0 bottom-8 top-4">
                            <svg className="w-full h-full" viewBox="0 0 400 200" preserveAspectRatio="none">
                                <path
                                    d="M0,150 Q50,100 100,120 T200,80 T300,100 T400,60"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="3"
                                    className="text-gray-200"
                                />
                                <path
                                    d="M0,150 Q50,100 100,120 T200,80 T300,100 T400,60 L400,200 L0,200 Z"
                                    fill="currentColor"
                                    className="text-gray-100"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
                {/* X-axis labels */}
                <div className="flex justify-between pt-2 pl-12">
                    {[...Array(7)].map((_, i) => (
                        <Skeleton key={i} className="h-3 w-8" />
                    ))}
                </div>
            </div>
        </CardContent>
    );
}

/**
 * Top Selling Products Bar Chart Skeleton
 * Matches the horizontal bar chart layout
 */
export function TopProductsSkeleton({ className }: { className?: string }) {
    return (
        <CardContent className={cn("h-auto px-6 flex flex-col justify-between", className)}>
            <div className="h-[180px] flex flex-col justify-between py-2">
                {[...Array(5)].map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                        {/* Product name */}
                        <Skeleton className="h-3 w-24 shrink-0" />
                        {/* Bar */}
                        <Skeleton
                            className="h-4 rounded-r-xl"
                            style={{ width: `${80 - i * 12}%` }}
                        />
                        {/* Value */}
                        <Skeleton className="h-3 w-12 shrink-0" />
                    </div>
                ))}
            </div>
        </CardContent>
    );
}

/**
 * Sales by Channel Pie Chart Skeleton
 * Matches the donut chart + legend layout
 */
export function SalesByChannelSkeleton({ className }: { className?: string }) {
    return (
        <CardContent className={cn("flex items-center", className)}>
            {/* Donut chart placeholder */}
            <div className="h-30 w-30 relative">
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="h-24 w-24 rounded-full border-8 border-gray-200" />
                    <div className="absolute h-12 w-12 rounded-full bg-white" />
                </div>
            </div>
            {/* Legend */}
            <div className="space-y-3 flex-1 ml-6">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Skeleton className="h-2 w-2 rounded-full" />
                            <Skeleton className="h-3 w-14" />
                        </div>
                        <Skeleton className="h-3 w-8" />
                    </div>
                ))}
            </div>
        </CardContent>
    );
}

/**
 * Orders Table Skeleton
 * Matches the server table layout
 */
export function OrdersTableSkeleton({
    rows = 5,
    className,
}: {
    rows?: number;
    className?: string;
}) {
    return (
        <div className={cn("rounded-xl border border-gray-100 overflow-hidden", className)}>
            {/* Search bar */}
            <div className="p-4 border-b border-gray-100">
                <Skeleton className="h-9 w-64" />
            </div>
            {/* Table header */}
            <div className="grid grid-cols-6 gap-4 px-4 py-3 bg-gray-50 border-b border-gray-100">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-10" />
                <Skeleton className="h-3 w-14" />
                <Skeleton className="h-3 w-12" />
            </div>
            {/* Table rows */}
            {[...Array(rows)].map((_, i) => (
                <div
                    key={i}
                    className="grid grid-cols-6 gap-4 px-4 py-3 border-b border-gray-50 last:border-0"
                >
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-28" />
                    <Skeleton className="h-4 w-20" />
                    <Skeleton className="h-4 w-6" />
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-5 w-14 rounded-full" />
                </div>
            ))}
            {/* Pagination */}
            <div className="flex justify-between items-center px-4 py-3 border-t border-gray-100">
                <Skeleton className="h-4 w-32" />
                <div className="flex gap-2">
                    <Skeleton className="h-8 w-8" />
                    <Skeleton className="h-8 w-8" />
                </div>
            </div>
        </div>
    );
}

/**
 * Live Activity Ticker Skeleton
 */
export function LiveActivitySkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("space-y-1", className)}>
            {[...Array(3)].map((_, i) => (
                <div key={i} className="px-6 py-2 flex items-center justify-between">
                    <div className="flex items-center gap-1">
                        <Skeleton className="h-3 w-10" />
                        <Skeleton className="h-3 w-24" />
                    </div>
                    <Skeleton className="h-2 w-8" />
                </div>
            ))}
        </div>
    );
}

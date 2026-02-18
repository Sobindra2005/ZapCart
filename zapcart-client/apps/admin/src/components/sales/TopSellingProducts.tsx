/**
 * TopSellingProducts Component
 * 
 * Displays top selling products in a horizontal bar chart.
 * Handles loading, error, and empty states internally.
 */

"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/common/Date-Picker-Range";
import { ChartWrapper } from "@/components/wrapper";
import { CardContent } from "@repo/ui/ui/card";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    Cell,
    LabelList,
} from "recharts";
import { DataStateHandler } from "@/components/common/DataStateHandler";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { TopProductsSkeleton } from "@/components/sales/skeletons";
import {
    TopProduct,
    TOP_PRODUCTS_MENU_ITEMS,
    BAR_CHART_COLORS,
} from "@/data/sales.mock";

interface TopSellingProductsProps {
    data: TopProduct[];
    isLoading: boolean;
    isError: boolean;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onMenuSelect: (key: string) => void;
    onRetry?: () => void;
}

export function TopSellingProducts({
    data,
    isLoading,
    isError,
    dateRange,
    onDateRangeChange,
    onMenuSelect,
    onRetry,
}: TopSellingProductsProps) {
    const isEmpty = !isLoading && !isError && data.length === 0;

    return (
        <div>
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                Top Selling Products
            </h3>
            <ChartWrapper
                topComponent={
                    <div className="flex items-center justify-between">
                        <DatePickerWithRange date={dateRange} setDate={onDateRangeChange} />
                    </div>
                }
                menuItems={[...TOP_PRODUCTS_MENU_ITEMS]}
                onMenuSelect={onMenuSelect}
            >
                <DataStateHandler
                    isLoading={isLoading}
                    isError={isError}
                    isEmpty={isEmpty}
                    loadingComponent={<TopProductsSkeleton />}
                    errorComponent={
                        <CardContent className="h-45 flex items-center justify-center">
                            <ErrorState
                                title="Unable to load products"
                                description="We couldn't fetch top selling products."
                                onRetry={onRetry}
                                className="py-4"
                            />
                        </CardContent>
                    }
                    emptyComponent={
                        <CardContent className="h-45 flex items-center justify-center">
                            <EmptyState
                                variant="products"
                                title="No products sold yet"
                                description="Your best sellers will appear here once you make sales."
                                className="py-4"
                            />
                        </CardContent>
                    }
                >
                    <CardContent className="h-auto px-6 flex flex-col justify-between">
                        <ResponsiveContainer width="100%" height={180}>
                            <BarChart
                                data={data}
                                layout="vertical"
                                margin={{ top: 10, right: 20, left: 0, bottom: 10 }}
                                barCategoryGap={16}
                            >
                                <XAxis type="number" hide />
                                <YAxis
                                    dataKey="name"
                                    type="category"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: "#64748b", fontSize: 12, fontWeight: 700 }}
                                    width={110}
                                />
                                <Tooltip
                                    cursor={{ fill: "#f1f5f9" }}
                                    contentStyle={{
                                        borderRadius: "10px",
                                        border: "none",
                                        boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
                                        fontWeight: 700,
                                        fontSize: 13,
                                    }}
                                    formatter={(value) => [`${Number(value)} units`, "Sold"]}
                                />
                                <Bar
                                    dataKey="sales"
                                    radius={[0, 12, 12, 0]}
                                    barSize={18}
                                    fill="#3b82f6"
                                >
                                    {data.map((_, idx) => (
                                        <Cell
                                            key={`cell-${idx}`}
                                            fill={BAR_CHART_COLORS[idx % BAR_CHART_COLORS.length]}
                                        />
                                    ))}
                                    <LabelList
                                        dataKey="sales"
                                        position="right"
                                        style={{ fill: "#0f172a", fontWeight: 700, fontSize: 13 }}
                                        formatter={(value) => `${value} sold`}
                                    />
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </DataStateHandler>
            </ChartWrapper>
        </div>
    );
}

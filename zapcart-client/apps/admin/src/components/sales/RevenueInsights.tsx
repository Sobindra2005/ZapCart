/**
 * RevenueInsights Component
 * 
 * Displays revenue trends in an area chart with date range filtering.
 * Handles loading, error, and empty states internally.
 */

"use client";

import * as React from "react";
import { type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/common/Date-Picker-Range";
import { ChartWrapper } from "@/components/wrapper";
import { CardContent } from "@repo/ui/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
} from "recharts";
import { DataStateHandler } from "@/components/common/DataStateHandler";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { RevenueInsightsSkeleton } from "@/components/sales/skeletons";
import {
    RevenueTrendDataPoint,
    REVENUE_TREND_DEFAULT,
    TIME_RANGE_MENU_ITEMS,
} from "@/data/sales.mock";

interface RevenueInsightsProps {
    data: RevenueTrendDataPoint[];
    isLoading: boolean;
    isError: boolean;
    dateRange: DateRange | undefined;
    onDateRangeChange: (range: DateRange | undefined) => void;
    onMenuSelect: (key: string) => void;
    onRetry?: () => void;
}

export function RevenueInsights({
    data,
    isLoading,
    isError,
    dateRange,
    onDateRangeChange,
    onMenuSelect,
    onRetry,
}: RevenueInsightsProps) {
    const chartData = data.length > 0 ? data : REVENUE_TREND_DEFAULT;
    const isEmpty = !isLoading && !isError && data.every(d => d.sales === 0);

    return (
        <ChartWrapper
            className="lg:col-span-2"
            label="Revenue Insights"
            topComponent={
                <div className="flex items-center justify-between">
                    <DatePickerWithRange date={dateRange} setDate={onDateRangeChange} />
                </div>
            }
            menuItems={[...TIME_RANGE_MENU_ITEMS]}
            onMenuSelect={onMenuSelect}
        >
            <DataStateHandler
                isLoading={isLoading}
                isError={isError}
                isEmpty={isEmpty}
                loadingComponent={<RevenueInsightsSkeleton />}
                errorComponent={
                    <CardContent className="h-87.5 flex items-center justify-center">
                        <ErrorState
                            title="Unable to load revenue data"
                            description="We couldn't fetch your revenue insights. Please try again."
                            onRetry={onRetry}
                        />
                    </CardContent>
                }
                emptyComponent={
                    <CardContent className="h-87.5 flex items-center justify-center">
                        <EmptyState
                            variant="revenue"
                            title="No revenue data"
                            description="Start making sales to see your revenue trends here."
                        />
                    </CardContent>
                }
            >
                <CardContent className="h-87.5">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={chartData}>
                            <defs>
                                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1} />
                                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                                dy={10}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#94a3b8", fontSize: 12, fontWeight: 600 }}
                                tickFormatter={(val) => `$${val / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{
                                    borderRadius: "12px",
                                    border: "none",
                                    boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                                }}
                                formatter={(value) => [`$${Number(value).toLocaleString()}`, "Revenue"]}
                            />
                            <Area
                                type="monotone"
                                dataKey="sales"
                                stroke="#3b82f6"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorSales)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </CardContent>
            </DataStateHandler>
        </ChartWrapper>
    );
}

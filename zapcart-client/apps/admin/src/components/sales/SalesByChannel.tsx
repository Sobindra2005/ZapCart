/**
 * SalesByChannel Component
 * 
 * Displays sales distribution by channel in a donut chart with legend.
 * Handles loading, error, and empty states internally.
 */

"use client";

import * as React from "react";
import { ChartWrapper } from "@/components/wrapper";
import { CardContent } from "@repo/ui/ui/card";
import {
    PieChart,
    Pie,
    Cell,
    ResponsiveContainer,
} from "recharts";
import { DataStateHandler } from "@/components/common/DataStateHandler";
import { EmptyStateCompact } from "@/components/common/EmptyState";
import { ErrorStateCompact } from "@/components/common/ErrorState";
import { SalesByChannelSkeleton } from "@/components/sales/skeletons";
import {
    ChannelData,
    CHANNEL_MENU_ITEMS,
} from "@/data/sales.mock";

interface SalesByChannelProps {
    data: ChannelData[];
    isLoading: boolean;
    isError: boolean;
    onMenuSelect: (key: string) => void;
    onRetry?: () => void;
}

export function SalesByChannel({
    data,
    isLoading,
    isError,
    onMenuSelect,
    onRetry,
}: SalesByChannelProps) {
    const isEmpty = !isLoading && !isError && data.length === 0;

    return (
        <ChartWrapper
            label="Sales by Channel"
            menuItems={[...CHANNEL_MENU_ITEMS]}
            onMenuSelect={onMenuSelect}
        >
            <DataStateHandler
                isLoading={isLoading}
                isError={isError}
                isEmpty={isEmpty}
                loadingComponent={<SalesByChannelSkeleton />}
                errorComponent={
                    <CardContent className="flex items-center justify-center min-h-32">
                        <ErrorStateCompact
                            title="Unable to load"
                            description="Channel data unavailable"
                            onRetry={onRetry}
                        />
                    </CardContent>
                }
                emptyComponent={
                    <CardContent className="flex items-center justify-center min-h-32">
                        <EmptyStateCompact
                            variant="channel"
                            title="No sales data"
                            description="Channel breakdown will appear here"
                        />
                    </CardContent>
                }
            >
                <CardContent className="flex items-center">
                    <div className="h-30 w-30">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data as any[]}
                                    innerRadius={30}
                                    outerRadius={50}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-2 flex-1 ml-6">
                        {data.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-[10px] font-bold">
                                <div className="flex items-center gap-2">
                                    <div
                                        className="h-1.5 w-1.5 rounded-full"
                                        style={{ backgroundColor: item.color }}
                                    />
                                    <span className="text-gray-500 uppercase">{item.name}</span>
                                </div>
                                <span className="text-gray-900">{item.value}%</span>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </DataStateHandler>
        </ChartWrapper>
    );
}

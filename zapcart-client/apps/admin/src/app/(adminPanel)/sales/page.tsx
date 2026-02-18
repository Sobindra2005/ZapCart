/**
 * Sales Dashboard Page
 * 
 * Main sales analytics dashboard with KPIs, revenue insights, top products,
 * sales by channel, and recent logistics. All data fetching is done via
 * React Query with proper loading, error, and empty state handling.
 */

"use client";

import * as React from "react";
import { ChevronRight } from "lucide-react";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import { CardContent, CardHeader, CardTitle } from "@repo/ui/ui/card";
import { AdminCard } from "@/components/AdminCard";
import { FormPopup } from "@repo/ui/ui/form-popup";
import { CreateOrderForm } from "@/components/forms/CreateOrderForm";
import { StatCard, StatCardSkeleton } from "@/components/common/StatCard";
import { ServerTable, ServerTableColumn } from "@/components/common/ServerTable";
import { DataStateHandler } from "@/components/common/DataStateHandler";
import { EmptyState } from "@/components/common/EmptyState";
import { ErrorState } from "@/components/common/ErrorState";
import { useQuery } from "@tanstack/react-query";
import { salesApi } from "@/utils/api";

// Sales Components
import {
    RevenueInsights,
    TopSellingProducts,
    SalesByChannel,
    OrdersTableSkeleton,
    LiveActivitySkeleton,
} from "@/components/sales";

// Mock Data & Types
import {
    Order,
    KpiData,
    RevenueTrendDataPoint,
    TopProduct,
    ChannelData,
    REVENUE_TREND_DEFAULT,
    TOP_PRODUCTS_DEFAULT,
    CHANNEL_DATA_MOCK, // Using mock for now since channel API doesn't exist
    LIVE_ACTIVITY_MOCK,
    TIME_RANGE_MENU_ITEMS,
} from "@/data/sales.mock";

// ============================================
// Types
// ============================================

type FilterType = 'range' | 'date';

interface KpiRanges {
    totalSales: string;
    totalOrders: string;
    averageOrderValue: string;
    refundRate: string;
}

// ============================================
// Main Component
// ============================================

export default function SalesPage() {
    // KPI State
    const [kpiRange, setKpiRange] = React.useState<KpiRanges>({
        totalSales: "week",
        totalOrders: "week",
        averageOrderValue: "week",
        refundRate: "week"
    });

    // Date Ranges (isolated per section)
    const [revenueDateRange, setRevenueDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: addDays(new Date(new Date().getFullYear(), 0, 1), 30),
    });

    const [topProductsDateRange, setTopProductsDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: addDays(new Date(new Date().getFullYear(), 0, 1), 30),
    });

    // Range States
    const [chartRange, setChartRange] = React.useState("week");
    const [topProductsRange, setTopProductsRange] = React.useState("week");
    const [logisticsPage, setLogisticsPage] = React.useState(1);
    const logisticsLimit = 5;

    // Filter Type Tracking (range vs date picker)
    const [chartFilterType, setChartFilterType] = React.useState<FilterType>('range');
    const [topProductsFilterType, setTopProductsFilterType] = React.useState<FilterType>('range');

    // ============================================
    // Data Queries
    // ============================================

    // KPI Data
    const {
        data: kpiData,
        isLoading: isKpiLoading,
        isError: isKpiError,
        refetch: refetchKpi,
    } = useQuery({
        queryKey: ["sales-stats", kpiRange],
        queryFn: () => salesApi.getOrderAnalytics({
            aovRange: kpiRange.averageOrderValue,
            ordersRange: kpiRange.totalOrders,
            salesRange: kpiRange.totalSales,
            refundRange: kpiRange.refundRate
        }).then(res => res.data)
    });

    // Chart Data
    const {
        data: chartDataResponse,
        isLoading: isChartLoading,
        isError: isChartError,
        refetch: refetchChart,
    } = useQuery({
        queryKey: ["chart-data", chartRange, revenueDateRange, chartFilterType],
        queryFn: () => {
            const params: Record<string, string | undefined> = {};
            if (chartFilterType === 'range') {
                params.chartRange = chartRange;
            } else {
                params.startDate = revenueDateRange?.from?.toISOString();
                params.endDate = revenueDateRange?.to?.toISOString();
            }
            return salesApi.getChartData(params).then(res => res.data);
        }
    });

    // Top Products
    const {
        data: topProductsResponse,
        isLoading: isTopProductsLoading,
        isError: isTopProductsError,
        refetch: refetchTopProducts,
    } = useQuery({
        queryKey: ["top-products", topProductsRange, topProductsDateRange, topProductsFilterType],
        queryFn: () => {
            const params: Record<string, string | undefined> = {};
            if (topProductsFilterType === 'range') {
                params.productsRange = topProductsRange;
            } else {
                params.startDate = topProductsDateRange?.from?.toISOString();
                params.endDate = topProductsDateRange?.to?.toISOString();
            }
            return salesApi.getTopProducts(params).then(res => res.data);
        }
    });

    // Recent Logistics
    const {
        data: recentLogisticsResponse,
        isLoading: isLogisticsLoading,
        isError: isLogisticsError,
        refetch: refetchLogistics,
    } = useQuery({
        queryKey: ["recent-logistics", logisticsPage, logisticsLimit],
        queryFn: () => salesApi.getRecentLogisticsOrders({
            start: (logisticsPage - 1) * logisticsLimit,
            limit: logisticsLimit
        }).then(res => res.data)
    });

    // ============================================
    // Event Handlers
    // ============================================

    const handleKpiMenuSelect = (kpiKey: string, rangeKey: string) => {
        setKpiRange(prev => ({ ...prev, [kpiKey]: rangeKey }));
    };

    const handleChartMenuSelect = (key: string) => {
        setChartRange(key);
        setChartFilterType('range');
    };

    const handleTopProductsMenuSelect = (key: string) => {
        if (key === 'viewAll' || key === 'exportList') {
            console.log('Top Products action:', key);
            return;
        }
        setTopProductsRange(key);
        setTopProductsFilterType('range');
    };

    const handleRevenueDateChange = (range: DateRange | undefined) => {
        setRevenueDateRange(range);
        setChartFilterType('date');
    };

    const handleTopProductsDateChange = (range: DateRange | undefined) => {
        setTopProductsDateRange(range);
        setTopProductsFilterType('date');
    };

    // ============================================
    // Data Transformations
    // ============================================

    const transformedChartData = React.useMemo<RevenueTrendDataPoint[]>(() => {
        if (chartDataResponse?.data?.chartData) {
            const { labels, revenueData } = chartDataResponse.data.chartData;
            return labels.map((label: string, index: number) => ({
                name: label,
                sales: revenueData[index]
            }));
        }
        return REVENUE_TREND_DEFAULT;
    }, [chartDataResponse]);

    const transformedTopProducts = React.useMemo<TopProduct[]>(() => {
        if (topProductsResponse?.data?.topProducts && Array.isArray(topProductsResponse.data.topProducts)) {
            return topProductsResponse.data.topProducts.map((product: any) => ({
                id: product.id,
                name: product.name,
                sales: product.totalQuantitySold,
            }));
        }
        return TOP_PRODUCTS_DEFAULT;
    }, [topProductsResponse]);

    const transformedLogisticsOrders = React.useMemo<Order[]>(() => {
        if (recentLogisticsResponse?.data?.orders) {
            return recentLogisticsResponse.data.orders.map((order: any) => ({
                id: order.orderNumber,
                customer: order.userName,
                date: new Date(order.createdAt).toISOString().split('T')[0],
                amount: `$${order.totalAmount.toFixed(2)}`,
                status: order.status === 'COMPLETED' ? 'Paid' : order.status === 'PENDING' ? 'Pending' : 'Refunded',
                items: order.items.reduce((sum: number, item: any) => sum + item.quantity, 0)
            }));
        }
        return [];
    }, [recentLogisticsResponse]);

    // ============================================
    // Render
    // ============================================

    return (
        <div className="max-w-400 mx-auto space-y-8">
            {/* Header */}
            <Header />

            {/* KPI Row */}
            <KpiSection
                data={kpiData?.Kpis}
                isLoading={isKpiLoading}
                onMenuSelect={handleKpiMenuSelect}
                onRetry={() => refetchKpi()}
            />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Revenue Insights Chart */}
                <RevenueInsights
                    data={transformedChartData}
                    isLoading={isChartLoading}
                    isError={isChartError}
                    dateRange={revenueDateRange}
                    onDateRangeChange={handleRevenueDateChange}
                    onMenuSelect={handleChartMenuSelect}
                    onRetry={() => refetchChart()}
                />

                {/* Right Sidebar Widgets */}
                <div className="flex flex-col gap-6">
                    <SalesByChannel
                        data={CHANNEL_DATA_MOCK} // Using mock data - replace with API when available
                        isLoading={false}
                        isError={false}
                        onMenuSelect={(key) => console.log('Sales by Channel action:', key)}
                    />
                    <RealTimeTicker />
                </div>
            </div>

            {/* Bottom Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Orders Table */}
                <div className="lg:col-span-2">
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Recent Logistics
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-bold">
                            {recentLogisticsResponse?.data?.pendingOrdersCount || 0} Pending
                        </Badge>
                    </h3>
                    <DataStateHandler
                        isLoading={isLogisticsLoading}
                        isError={isLogisticsError}
                        isEmpty={transformedLogisticsOrders.length === 0}
                        loadingComponent={<OrdersTableSkeleton />}
                        errorComponent={
                            <div className="rounded-xl border border-gray-100 p-8">
                                <ErrorState
                                    title="Unable to load orders"
                                    description="We couldn't fetch recent logistics."
                                    onRetry={() => refetchLogistics()}
                                />
                            </div>
                        }
                        emptyComponent={
                            <div className="rounded-xl border border-gray-100 p-8">
                                <EmptyState
                                    variant="orders"
                                    title="No orders yet"
                                    description="Orders will appear here once customers start placing them."
                                />
                            </div>
                        }
                    >
                        <OrdersTable
                            data={transformedLogisticsOrders}
                            page={logisticsPage}
                            onPageChange={setLogisticsPage}
                            total={recentLogisticsResponse?.pagination?.total || 0}
                        />
                    </DataStateHandler>
                </div>

                {/* Top Selling Products */}
                <TopSellingProducts
                    data={transformedTopProducts}
                    isLoading={isTopProductsLoading}
                    isError={isTopProductsError}
                    dateRange={topProductsDateRange}
                    onDateRangeChange={handleTopProductsDateChange}
                    onMenuSelect={handleTopProductsMenuSelect}
                    onRetry={() => refetchTopProducts()}
                />
            </div>
        </div>
    );
}

// ============================================
// Sub-Components
// ============================================

function Header() {
    return (
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
            <div className="flex items-center gap-3">
                <FormPopup
                    title="Create New Order"
                    description="Manually create a new order."
                    className="max-w-4xl"
                    trigger={
                        <Button className="font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                            Create Order
                        </Button>
                    }
                >
                    <CreateOrderForm onSubmit={(data) => console.log(data)} />
                </FormPopup>
            </div>
        </div>
    );
}

interface KpiSectionProps {
    data: Record<string, KpiData> | undefined;
    isLoading: boolean;
    onMenuSelect: (kpiKey: string, rangeKey: string) => void;
    onRetry: () => void;
}

function KpiSection({ data, isLoading, onMenuSelect, onRetry }: KpiSectionProps) {
    if (isLoading) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
            </div>
        );
    }

    if (!data) {
        return (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)}
            </div>
        );
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.entries(data).map(([key, kpi]) => (
                <StatCard
                    key={`stat-${key}`}
                    label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                    value={`${kpi.value.toFixed(2)}`}
                    trend={`${kpi.growthRate > 0 ? '+' : ''}${kpi.growthRate.toFixed(1)}%`}
                    trendDir={kpi.growthRate > 0 ? "up" : "down"}
                    vs={`vs ${kpi.comparisonRange.replace(/_/g, ' ')}`}
                    onMenuSelect={(range) => onMenuSelect(key, range)}
                    menuItems={[...TIME_RANGE_MENU_ITEMS]}
                />
            ))}
        </div>
    );
}

interface OrdersTableProps {
    data: Order[];
    page: number;
    onPageChange: (page: number) => void;
    total: number;
}

function OrdersTable({ data, page, onPageChange, total }: OrdersTableProps) {
    const [searchValue, setSearchValue] = React.useState("");

    const getStatusColor = (status: Order['status']) => {
        switch (status) {
            case "Paid": return "bg-green-50 text-green-700 border-green-200";
            case "Pending": return "bg-orange-50 text-orange-700 border-orange-200";
            case "Refunded": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    const columns: ServerTableColumn<Order>[] = [
        {
            header: "Order ID",
            accessorKey: "id",
            cell: (row) => <span className="font-bold text-primary">#{row.id}</span>,
            sortable: true,
        },
        {
            header: "Customer",
            accessorKey: "customer",
            cell: (row) => <span className="font-semibold text-gray-900">{row.customer}</span>,
            sortable: true,
        },
        {
            header: "Date",
            accessorKey: "date",
            cell: (row) => <span className="text-gray-500">{row.date}</span>,
            sortable: true,
        },
        {
            header: "Items",
            accessorKey: "items",
            cell: (row) => <span className="text-gray-600 font-bold">{row.items}</span>,
            align: "center",
            sortable: true,
        },
        {
            header: "Amount",
            accessorKey: "amount",
            cell: (row) => <span className="font-bold text-gray-900">{row.amount}</span>,
            sortable: true,
        },
        {
            header: "Status",
            accessorKey: "status",
            cell: (row) => (
                <Badge variant="outline" className={cn("px-2 py-0.5 font-bold", getStatusColor(row.status))}>
                    {row.status}
                </Badge>
            ),
        }
    ];

    return (
        <ServerTable
            columns={columns}
            data={data}
            getRowId={(row) => row.id}
            page={page}
            limit={5}
            total={total}
            onPageChange={onPageChange}
            enableSearch
            searchValue={searchValue}
            searchPlaceholder="Search orders..."
            onSearchChange={setSearchValue}
            fileName="orders"
            containerClassName="shadow-none"
        />
    );
}

function RealTimeTicker() {
    // In a real app, this would be connected to a WebSocket or polling
    const activities = LIVE_ACTIVITY_MOCK;

    return (
        <AdminCard className="p-0 overflow-hidden flex-1 flex flex-col">
            <CardHeader className="py-1 flex flex-row items-center justify-between bg-green-500">
                <CardTitle className="text-sm font-bold flex items-center gap-2 justify-center text-white">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Live Sales Activity
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6">
                    <ChevronRight className="h-4 w-4" />
                </Button>
            </CardHeader>
            <CardContent className="px-0 flex-1 overflow-auto">
                <div className="space-y-1">
                    {activities.map((item, i) => (
                        <div
                            key={i}
                            className="px-6 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between text-xs"
                        >
                            <span className="text-gray-600 font-medium">
                                <b className="text-gray-900">{item.user}</b> {item.action}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">
                                {item.time}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </AdminCard>
    );
}

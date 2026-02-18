"use client";

import * as React from "react";
import {
    ChevronRight,
} from "lucide-react";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/common/Date-Picker-Range";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/ui/card";
import {
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    Cell,
    PieChart,
    Pie,
    LabelList
} from "recharts";
import { AdminCard } from "@/components/AdminCard";
import { ChartWrapper } from "@/components/wrapper";
import { FormPopup } from "@repo/ui/ui/form-popup";
import { CreateOrderForm } from "@/components/forms/CreateOrderForm";
import { StatCard, StatCardSkeleton } from "@/components/common/StatCard";
import { ServerTable, ServerTableColumn } from "@/components/common/ServerTable";
import { useQuery } from "@tanstack/react-query";
import { salesApi } from "@/utils/api";


const RevenueTrendDefaultData = [
    { name: "Mon", sales: 0 },
    { name: "Tue", sales: 0 },
    { name: "Wed", sales: 0 },
    { name: "Thu", sales: 0 },
    { name: "Fri", sales: 0 },
    { name: "Sat", sales: 0 },
    { name: "Sun", sales: 0 },
];

const topProductsDefaultData = [
    { name: "A", sales: 0 },
    { name: "B", sales: 0 },
    { name: "C", sales: 0 },
    { name: "D", sales: 0 },
    { name: "E", sales: 0 },
];

const channelData = [
    { name: "Direct", value: 45, color: "#3b82f6" },
    { name: "Social", value: 30, color: "#10b981" },
    { name: "Email", value: 15, color: "#f59e0b" },
    { name: "Search", value: 10, color: "#ef4444" },
];

type OrderStatus = "Paid" | "Pending" | "Refunded";

interface Order {
    id: string;
    customer: string;
    date: string;
    amount: string;
    status: OrderStatus;
    items: number;
}

type kpiType = {
    value: number;
    growthRate: number;
    comparisonRange: string;
    range: string;
}

export default function SalesPage() {
    const [kpiRange, setKpiRange] = React.useState({
        totalSales: "week",
        totalOrders: "week",
        averageOrderValue: "week",
        refundRate: "week"
    });
    const { data, isLoading } = useQuery({
        queryKey: ["sales-stats", kpiRange],
        queryFn: () => salesApi.getOrderAnalytics({
            aovRange: kpiRange.averageOrderValue,
            ordersRange: kpiRange.totalOrders,
            salesRange: kpiRange.totalSales,
            refundRange: kpiRange.refundRate
        }).then(res => res.data)
    })

    // Isolated date ranges
    const [revenueDateRange, setRevenueDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: addDays(new Date(new Date().getFullYear(), 0, 1), 30),
    });

    const [topProductsDateRange, setTopProductsDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: addDays(new Date(new Date().getFullYear(), 0, 1), 30),
    });

    const [chartRange, setChartRange] = React.useState("week");
    const [topProductsRange, setTopProductsRange] = React.useState("week");
    const [logisticsPage, setLogisticsPage] = React.useState(1);
    const logisticsLimit = 5;

    // Track which filter was last set (range or date picker)
    const [chartFilterType, setChartFilterType] = React.useState<'range' | 'date'>('range');
    const [topProductsFilterType, setTopProductsFilterType] = React.useState<'range' | 'date'>('range');

    // Fetch chart data
    const { data: chartDataResponse, isLoading: isChartLoading } = useQuery({
        queryKey: ["chart-data", chartRange, revenueDateRange, chartFilterType],
        queryFn: () => {
            const params: any = {};
            if (chartFilterType === 'range') {
                params.chartRange = chartRange;
            } else {
                params.startDate = revenueDateRange?.from?.toISOString();
                params.endDate = revenueDateRange?.to?.toISOString();
            }
            return salesApi.getChartData(params).then(res => res.data);
        }
    });

    // Fetch top products
    const { data: topProductsResponse, isLoading: isTopProductsLoading } = useQuery({
        queryKey: ["top-products", topProductsRange, topProductsDateRange, topProductsFilterType],
        queryFn: () => {
            const params: any = {};
            if (topProductsFilterType === 'range') {
                params.productsRange = topProductsRange;
            } else {
                params.startDate = topProductsDateRange?.from?.toISOString();
                params.endDate = topProductsDateRange?.to?.toISOString();
            }
            return salesApi.getTopProducts(params).then(res => res.data);
        }
    });

    // Fetch recent logistics
    const { data: recentLogisticsResponse, isLoading: isLogisticsLoading } = useQuery({
        queryKey: ["recent-logistics", logisticsPage, logisticsLimit],
        queryFn: () => salesApi.getRecentLogisticsOrders({
            start: (logisticsPage - 1) * logisticsLimit,
            limit: logisticsLimit
        }).then(res => res.data)
    });

    const handleKpiMenuSelect = (kpiKey: string, rangeKey: string) => {
        setKpiRange(prev => ({
            ...prev,
            [kpiKey]: rangeKey
        }));

        console.log(`Selected ${kpiKey} range: ${rangeKey}`,{
            kpiRange
        });
    };

    const handleChartMenuSelect = (key: string) => {
        setChartRange(key);
        setChartFilterType('range');
        console.log('Revenue Insights action:', key);
    };

    const handleTopProductsMenuSelect = (key: string) => {
        if (key === 'viewAll' || key === 'exportList') {
            console.log('Top Products action:', key);
        } else {
            setTopProductsRange(key);
            setTopProductsFilterType('range');
        }
    };

    const handleRevenueDateChange = (range: DateRange | undefined) => {
        setRevenueDateRange(range);
        setChartFilterType('date');
    };

    const handleTopProductsDateChange = (range: DateRange | undefined) => {
        setTopProductsDateRange(range);
        setTopProductsFilterType('date');
    };

    // Transform chart data for recharts
    const transformedChartData = React.useMemo(() => {
        if (chartDataResponse?.data?.chartData) {
            const { labels, revenueData } = chartDataResponse.data.chartData;
            return labels.map((label: string, index: number) => ({
                name: label,
                sales: revenueData[index]
            }));
        }
        return RevenueTrendDefaultData;
    }, [chartDataResponse]);

    // Transform top products data for recharts
    const transformedTopProducts = React.useMemo(() => {
        if (topProductsResponse?.data?.topProducts && Array.isArray(topProductsResponse.data.topProducts)) {
            return topProductsResponse.data.topProducts.map((product: any) => ({
                name: product.name,
                sales: product.totalQuantitySold,
                id: product.id
            }));
        }
        return topProductsDefaultData;
    }, [topProductsResponse]);

    // Transform logistics orders
    const transformedLogisticsOrders = React.useMemo(() => {
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

    return (
        <div className=" max-w-400 mx-auto space-y-8 " >
            {/* Header */}
            <Header />

            {/* KPI Row */}
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"}>
                {data?.Kpis && !isLoading ? Object.entries(data.Kpis).map(([key, kpi]) => {
                    const typedKpi = kpi as kpiType;
                    return (
                        <StatCard
                            key={`stat-${key}`}
                            label={key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                            value={`${typedKpi.value.toFixed(2)}`}
                            trend={`${typedKpi.growthRate > 0 ? '+' : ''}${typedKpi.growthRate.toFixed(1)}%`}
                            trendDir={typedKpi.growthRate > 0 ? "up" : "down"}
                            vs={`vs ${typedKpi.comparisonRange.replace(/_/g, ' ')}`}
                            onMenuSelect={(range) => handleKpiMenuSelect(key, range)}
                            menuItems={[
                                { label: "Today", accessorKey: "today" },
                                { label: "This Week", accessorKey: "week" },
                                { label: "This Month", accessorKey: "month" },
                                { label: "This Year", accessorKey: "year" },
                            ]}
                        />
                    );
                })
                    :
                    [0, 1, 2, 3].map((i) => <StatCardSkeleton key={i} />)
                }
            </div>


            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Trend Chart */}
                <ChartWrapper
                    className="lg:col-span-2 "
                    label="Revenue Insights"
                    topComponent={
                        <div className="flex items-center justify-between">
                            <DatePickerWithRange date={revenueDateRange} setDate={handleRevenueDateChange} />
                        </div>
                    }
                    menuItems={[
                        { label: "Today", accessorKey: "today" },
                        { label: "This week", accessorKey: "week" },
                        { label: "This Month", accessorKey: "month" },
                        { label: "This Year", accessorKey: "year" },

                    ]}
                    onMenuSelect={handleChartMenuSelect}
                >
                    <CardContent className="h-87.5">

                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={transformedChartData}>
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
                                    contentStyle={{ borderRadius: "12px", border: "none", boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.1)" }}
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
                </ChartWrapper>

                {/* Right Sidebar Widgets */}
                <div className="flex flex-col gap-6">
                    <SalesByChannel />
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
                    <OrdersTable 
                        data={transformedLogisticsOrders}
                        page={logisticsPage}
                        onPageChange={setLogisticsPage}
                        total={recentLogisticsResponse?.pagination?.total || 0}
                    />
                </div>

                {/* Secondary Charts */}
                <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                        Top Selling Products

                    </h3>
                    {/* Top Products */}
                    <ChartWrapper
                        topComponent={
                            <div className="flex items-center justify-between">
                                <DatePickerWithRange date={topProductsDateRange} setDate={handleTopProductsDateChange} />
                            </div>
                        }
                        menuItems={[
                            { label: "Today", accessorKey: "today" },
                            { label: "This Week", accessorKey: "week" },
                            { label: "This Month", accessorKey: "month" },
                            { label: "This Year", accessorKey: "year" },
                        ]}
                        onMenuSelect={handleTopProductsMenuSelect}
                    >
                        <CardContent className="h-auto px-6 flex flex-col justify-between">
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart
                                    data={transformedTopProducts}
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
                                    />
                                    <Bar dataKey="sales" radius={[0, 12, 12, 0]} barSize={18} fill="#3b82f6">
                                        {transformedTopProducts.map((entry: { name: string; sales: number; id?: string }, idx:number) => (
                                            <Cell
                                                key={`cell-${idx}`}
                                                fill={["#3b82f6", "#6366f1", "#06b6d4", "#f59e42", "#10b981"][idx % 5]}
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
                    </ChartWrapper>
                </div>
            </div>
        </div >
    );
}

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
    )
}

function OrdersTable({ 
    data, 
    page, 
    onPageChange,
    total
}: { 
    data: Order[]; 
    page: number; 
    onPageChange: (page: number) => void;
    total: number;
}) {
    const [searchValue, setSearchValue] = React.useState("");

    const getStatusColor = (status: OrderStatus) => {
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
};

function RealTimeTicker() {
    return (
        <AdminCard className="p-0 overflow-hidden flex-1 flex flex-col">
            <CardHeader className="py-1 flex flex-row items-center justify-between bg-green-500">
                <CardTitle className="text-sm font-bold flex items-center gap-2 justify-center text-white">
                    <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                    Live Sales Activity
                </CardTitle>
                <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-4 w-4" /></Button>
            </CardHeader>
            <CardContent className="px-0 flex-1 overflow-auto">
                <div className="space-y-1">
                    {[
                        { user: "Ram", action: "purchased Airpods", time: "2m ago" },
                        { user: "Gita", action: "ordered iPhone 15", time: "5m ago" },
                        { user: "Shyam", action: "canceled a return", time: "12m ago" }
                    ].map((item, i) => (
                        <div key={i} className="px-6 py-2 hover:bg-gray-50 transition-colors flex items-center justify-between text-xs">
                            <span className="text-gray-600 font-medium">
                                <b className="text-gray-900">{item.user}</b> {item.action}
                            </span>
                            <span className="text-[10px] text-gray-400 font-bold uppercase">{item.time}</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </AdminCard>
    )
};


function SalesByChannel() {
    return (
        <ChartWrapper
            label="Sales by Channel"
            menuItems={[
                { label: "View Details", accessorKey: "viewDetails" },
                { label: "Export Data", accessorKey: "exportData" },
            ]}
            onMenuSelect={(key) => console.log('Sales by Channel action:', key)}
        >
            <CardContent className="flex items-center">
                <div className="h-30 w-30">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={channelData}
                                innerRadius={30}
                                outerRadius={50}
                                paddingAngle={5}
                                dataKey="value"
                            >
                                {channelData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="space-y-2 flex-1 ml-6">
                    {channelData.map((item) => (
                        <div key={item.name} className="flex items-center justify-between text-[10px] font-bold">
                            <div className="flex items-center gap-2">
                                <div className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-gray-500 uppercase">{item.name}</span>
                            </div>
                            <span className="text-gray-900">{item.value}%</span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </ChartWrapper>
    )
}


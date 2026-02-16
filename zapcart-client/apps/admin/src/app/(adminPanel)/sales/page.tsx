"use client";

import * as React from "react";
import {
    Search,
    Filter,
    Download,
    MoreHorizontal,
    Calendar,
    ChevronRight,
} from "lucide-react";
import { addDays } from "date-fns";
import { type DateRange } from "react-day-picker";
import { DatePickerWithRange } from "@/components/common/Date-Picker-Range";
import { SectionDivider } from "@/components/common/SectionDivider";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
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
import { Stat } from "@/components/common/StatsCards";
import { ChartWrapper } from "@/components/wrapper";
import { FormPopup } from "@repo/ui/ui/form-popup";
import { CreateOrderForm } from "@/components/forms/CreateOrderForm";
import { StatCard } from "@/components/common/StatCard";
import { ServerTable, ServerTableColumn } from "@/components/common/ServerTable";

const stats: Stat[] = [
    { label: "Total Sales", value: "$124,592.00", trend: "+12.5%", trendDir: "up", vs: "vs last month" },
    { label: "Total Orders", value: "1,284", trend: "+8.2%", trendDir: "up", vs: "vs last month" },
    { label: "Avg. Order Value", value: "$97.03", trend: "-2.4%", trendDir: "down", vs: "vs last month" },
    { label: "Refund Rate", value: "1.2%", trend: "-0.5%", trendDir: "down", vs: "vs last month" },
];

const salesTrendData = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 5000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 2390 },
    { name: "Sun", sales: 3490 },
];

const topProductsData = [
    { name: "iPhone 15 Pro", sales: 420 },
    { name: "MacBook Air", sales: 380 },
    { name: "AirPods Max", sales: 310 },
    { name: "iPad Pro", sales: 290 },
    { name: "Apple Watch", sales: 250 },
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

const recentOrders: Order[] = [
    { id: "ORD-7392", customer: "Amrita Shrestha", date: "2024-03-23", amount: "$129.00", status: "Paid", items: 2 },
    { id: "ORD-7391", customer: "Bibek Poudel", date: "2024-03-23", amount: "$45.50", status: "Pending", items: 1 },
    { id: "ORD-7390", customer: "Sita Thapa", date: "2024-03-22", amount: "$899.00", status: "Paid", items: 3 },
    { id: "ORD-7389", customer: "Rahul Gupta", date: "2024-03-22", amount: "$210.00", status: "Refunded", items: 2 },
    { id: "ORD-7388", customer: "Pooja Rai", date: "2024-03-21", amount: "$56.00", status: "Paid", items: 1 },
];


const OrdersTable = () => {
    const [page, setPage] = React.useState(1);
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
            data={recentOrders}
            getRowId={(row) => row.id}
            page={page}
            limit={5}
            total={recentOrders.length}
            onPageChange={setPage}
            enableSearch
            searchValue={searchValue}
            searchPlaceholder="Search orders..."
            onSearchChange={setSearchValue}
            fileName="orders"
            containerClassName="shadow-none"
        />
    );
};

const RealTimeTicker = () => (
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
);


const SalesByChannel = () => {
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



export default function SalesPage() {
    const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
        from: new Date(new Date().getFullYear(), 0, 1),
        to: addDays(new Date(new Date().getFullYear(), 0, 1), 30),
    });

    return (
        <div className="p-8 max-w-400 mx-auto space-y-8 " >
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
                <div className="flex items-center gap-3">
                    <FormPopup
                        title="Create New Order"
                        description="Manually create a new order."
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

            {/* KPI Row */}
            <div className={"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"}>
                {stats.map((stat, i) => (
                    <StatCard
                        key={`stat-${i}-${stat.label}`}
                        label={stat.label}
                        value={stat.value}
                        trend={stat.trend}
                        trendDir={stat.trendDir}
                        vs={stat.vs}
                        menuItems={[
                            { label: "Today", accessorKey: "today" },
                            { label: "This Week", accessorKey: "thisWeek" },
                            { label: "This Month", accessorKey: "thisMonth" },
                            { label: "This Year", accessorKey: "thisYear" },
                        ]}

                    />
                ))}
            </div>



            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Trend Chart */}
                <ChartWrapper
                    className="lg:col-span-2 "
                    label="Revenue Insights"
                    topComponent={
                        <div className="flex items-center justify-between">
                            <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                        </div>
                    }
                    menuItems={[
                        { label: "Today", accessorKey: "today" },
                        { label: "This week", accessorKey: "thisWeek" },
                        { label: "This Month", accessorKey: "thisMonth" },
                    ]}
                    onMenuSelect={(key) => console.log('Revenue Insights action:', key)}
                >
                    <CardContent className="h-87.5">

                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={salesTrendData}>
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
                        <Badge variant="secondary" className="bg-gray-100 text-gray-600 font-bold">128 Pending</Badge>
                    </h3>
                    <OrdersTable />
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
                                <DatePickerWithRange date={dateRange} setDate={setDateRange} />
                            </div>
                        }
                        menuItems={[
                            { label: "View All Products", accessorKey: "viewAll" },
                            { label: "Export List", accessorKey: "exportList" },
                        ]}
                        onMenuSelect={(key) => console.log('Top Products action:', key)}
                    >
                        <CardContent className="h-auto px-6 flex flex-col justify-between">
                            <ResponsiveContainer width="100%" height={180}>
                                <BarChart
                                    data={topProductsData}
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
                                        {topProductsData.map((entry, idx) => (
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

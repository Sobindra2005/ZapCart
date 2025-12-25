"use client";

import {
    DollarSign,
    ShoppingBag,
    ArrowUpRight,
    ArrowDownRight,
    Search,
    Filter,
    Download,
    MoreHorizontal,
    TrendingUp,
    AlertCircle,
    Calendar,
    ChevronRight,
    Zap
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
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
    Pie
} from "recharts";
import { AdminCard } from "@/components/AdminCard";
import { Stat, StatsCards } from "@/components/common/StatsCards";

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

const recentOrders = [
    { id: "ORD-7392", customer: "Amrita Shrestha", date: "2024-03-23", amount: "$129.00", status: "Paid", items: 2 },
    { id: "ORD-7391", customer: "Bibek Poudel", date: "2024-03-23", amount: "$45.50", status: "Pending", items: 1 },
    { id: "ORD-7390", customer: "Sita Thapa", date: "2024-03-22", amount: "$899.00", status: "Paid", items: 3 },
    { id: "ORD-7389", customer: "Rahul Gupta", date: "2024-03-22", amount: "$210.00", status: "Refunded", items: 2 },
    { id: "ORD-7388", customer: "Pooja Rai", date: "2024-03-21", amount: "$56.00", status: "Paid", items: 1 },
];


const OrdersTable = () => {
    const getStatusColor = (status: string) => {
        switch (status) {
            case "Paid": return "bg-green-50 text-green-700 border-green-200";
            case "Pending": return "bg-orange-50 text-orange-700 border-orange-200";
            case "Refunded": return "bg-red-50 text-red-700 border-red-200";
            default: return "bg-gray-50 text-gray-700 border-gray-200";
        }
    };

    return (
        <AdminCard className="p-0">
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <Input placeholder="Search orders..." className="pl-10 bg-gray-50/50 border-gray-200" />
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-200">
                        <Filter className="h-4 w-4" />
                        Filter
                    </Button>
                    <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-200">
                        <Download className="h-4 w-4" />
                        Export
                    </Button>
                </div>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-500 border-b border-gray-100">
                        <tr>
                            <th className="px-6 py-4">Order ID</th>
                            <th className="px-6 py-4">Customer</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4 text-center">Items</th>
                            <th className="px-6 py-4">Amount</th>
                            <th className="px-6 py-4">Status</th>
                            <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {recentOrders.map((order) => (
                            <tr key={order.id} className="hover:bg-gray-50 transition-colors cursor-pointer group">
                                <td className="px-6 py-4 font-bold text-primary">#{order.id}</td>
                                <td className="px-6 py-4 font-semibold text-gray-900">{order.customer}</td>
                                <td className="px-6 py-4 text-gray-500">{order.date}</td>
                                <td className="px-6 py-4 text-center text-gray-600 font-bold">{order.items}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">{order.amount}</td>
                                <td className="px-6 py-4">
                                    <Badge variant="outline" className={cn("px-2 py-0.5 font-bold", getStatusColor(order.status))}>
                                        {order.status}
                                    </Badge>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary transition-opacity group-hover:opacity-100 sm:opacity-0 lg:opacity-100">
                                        <MoreHorizontal className="h-4 w-4" />
                                    </Button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminCard>
    );
};

const RealTimeTicker = () => (
    <AdminCard className="p-2 px-0">
        <CardHeader className="pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
                Live Sales Activity
            </CardTitle>
            <Button variant="ghost" size="icon" className="h-6 w-6"><ChevronRight className="h-4 w-4" /></Button>
        </CardHeader>
        <CardContent className="px-0">
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

const PredictiveSales = () => (
    <AdminCard className="p-2">
        <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Sales Forecast
            </CardTitle>
        </CardHeader>
        <CardContent>
            <div className="space-y-4">
                <div className="bg-primary/5 p-4 rounded-xl border border-primary/10">
                    <p className="text-[10px] text-primary uppercase tracking-widest font-bold mb-1">Expected this month</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-black text-gray-900">$142.8k</span>
                        <span className="text-xs font-bold text-green-600 flex items-center gap-0.5">
                            <ArrowUpRight className="h-3 w-3" /> +14%
                        </span>
                    </div>
                </div>
                <div className="space-y-2">
                    <div className="flex justify-between text-[10px] uppercase font-bold text-gray-500">
                        <span>Confidence Level</span>
                        <span>High (92%)</span>
                    </div>
                    <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-full bg-primary rounded-full transition-all duration-500" style={{ width: "92%" }} />
                    </div>
                </div>
            </div>
        </CardContent>
    </AdminCard>
);

const SalesByChannel = () => {
    return (
        <AdminCard className="p-2">
            <CardHeader>
                <CardTitle className="text-sm font-bold">Sales by Channel</CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between pt-0">
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
        </AdminCard>
    )
}



export default function SalesPage() {
    return (
        <div className="p-8 max-w-400 mx-auto space-y-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-end gap-4">
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="font-bold border-gray-200">
                        <Calendar className="h-4 w-4 mr-2" />
                        Last 30 Days
                    </Button>
                    <Button className="font-bold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/20">
                        Create Order
                    </Button>
                </div>
            </div>

            {/* KPI Row */}
            <StatsCards stats={stats} />

            {/* Main Content Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Sales Trend Chart */}
                <AdminCard className="lg:col-span-2 p-2">
                    <CardHeader className="pb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-lg font-bold">Revenue Insights</CardTitle>
                                <CardDescription>Sales growth trend across the current week.</CardDescription>
                            </div>
                            <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-lg">
                                <Button variant="ghost" size="sm" className="h-7 px-3 font-bold text-[10px] uppercase bg-white shadow-sm">Revenue</Button>
                                <Button variant="ghost" size="sm" className="h-7 px-3 font-bold text-[10px] uppercase text-gray-500">Volume</Button>
                            </div>
                        </div>
                    </CardHeader>
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
                </AdminCard>

                {/* Right Sidebar Widgets */}
                <div className="space-y-6">
                    <RealTimeTicker />
                    <PredictiveSales />
                    <SalesByChannel />
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
                <div className="space-y-6">
                    {/* Top Products */}
                    <AdminCard className="px-0">
                        <CardHeader>
                            <CardTitle className="text-sm font-bold">Best Selling Products</CardTitle>
                        </CardHeader>
                        <CardContent className="h-87.5 p-0 px-6">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={topProductsData} layout="vertical">
                                    <XAxis type="number" hide />
                                    <YAxis
                                        dataKey="name"
                                        type="category"
                                        axisLine={false}
                                        tickLine={false}
                                        tick={{ fill: "#64748b", fontSize: 10, fontWeight: 700 }}
                                        width={100}
                                    />
                                    <Tooltip />
                                    <Bar dataKey="sales" fill="#3b82f6" radius={[0, 4, 4, 0]} barSize={12} />
                                </BarChart>
                            </ResponsiveContainer>
                        </CardContent>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}

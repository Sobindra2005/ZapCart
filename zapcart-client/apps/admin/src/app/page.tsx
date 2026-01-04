"use client";

import {
    Filter,
    ChevronDown,
    ArrowUpRight,
} from "lucide-react";
import {
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Cell,
    PieChart,
    Pie,
    AreaChart,
    Area,
    Legend
} from "recharts";
import Image from "next/image";
import { AdminCard } from "@/components/AdminCard";
import { StatsCards, type Stat } from "@/components/common/StatsCards";
import { ChartWrapper } from "@/components/wrapper";

// Mock Data for Charts
const revenueData = [
    { name: "Dec 01", value: 3400 },
    { name: "Dec 05", value: 2800 },
    { name: "Dec 10", value: 1800 },
    { name: "Dec 15", value: 2600 },
    { name: "Dec 17", value: 2400 },
    { name: "Dec 19", value: 2100 },
    { name: "Dec 21", value: 2500 },
    { name: "Dec 22", value: 2600 },
];

const regionData = [
    { name: "North America", value: 35, color: "#7B5BE4" },
    { name: "Europe", value: 25, color: "#9333EA" },
    { name: "Asia", value: 20, color: "#C084FC" },
    { name: "Others", value: 20, color: "#EBE7FD" },
];

const targetData = [
    { name: "Completed", value: 75 },
    { name: "Remaining", value: 25 },
];

const TARGET_COLORS = ["#7B5BE4", "#F3F4F6"];

const topProducts = [
    { name: "T-Shirt", price: 79.80, category: "Women Cloths", quantity: 120, amount: 9576.00, image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Shirt", price: 76.89, category: "Man Cloths", quantity: 86, amount: 6612.54, image: "https://images.unsplash.com/photo-1596755094514-f87034a264c6?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Pant", price: 86.65, category: "Kid Cloths", quantity: 74, amount: 6412.10, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200&h=200" },
    { name: "Sweater", price: 56.07, category: "Man Cloths", quantity: 69, amount: 3868.83, image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=200&h=200" },
];

const stats: Stat[] = [
    { label: "Sales", value: "$34,456.00", trend: "+ 14%", trendDir: "up", vs: "VS last week" },
    { label: "Monthly Order", value: "3456", trend: "- 17%", trendDir: "down", vs: "VS last week" },
    { label: "Monthly Revenue", value: "$1,456.00", trend: "+ 14%", trendDir: "up", vs: "VS last week" },
    { label: "Online Visitors", value: "42,456", trend: "- 11%", trendDir: "down", vs: "VS last week" },
];

import { DataTable } from "@/components/common/DataTable";
import { useMemo, useState } from "react";


export default function DashboardPage() {
    const [sortConfig, setSortConfig] = useState<{ key: string | null; direction: "asc" | "desc" | null }>({
        key: null,
        direction: null,
    });

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" | null = "asc";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") direction = "desc";
            else if (sortConfig.direction === "desc") direction = null;
        }
        setSortConfig({ key, direction });
    };

    const sortedProducts = useMemo(() => {
        let result = [...topProducts];
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                const aValue = (a as any)[sortConfig.key!];
                const bValue = (b as any)[sortConfig.key!];

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }
        return result;
    }, [sortConfig]);

    return (
        <div className="flex flex-col gap-6 p-8 bg-gray-50/50 min-h-screen">

            {/* 1. Summary Stats Cards */}
            <StatsCards stats={stats} />

            {/* 2. Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <ChartWrapper label="Revenue Overview" topComponent={
                    <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full bg-[#10B981]" />
                        <span className="text-xs font-medium text-gray-400">Revenue</span>
                    </div>
                }>
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={revenueData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#10B981" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} opacity={0.3} />
                            <XAxis
                                dataKey="name"
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                                dy={10}
                                ticks={["Dec 10", "Dec 17", "Dec 19", "Dec 21", "Dec 22"]}
                            />
                            <YAxis
                                axisLine={false}
                                tickLine={false}
                                tick={{ fill: "#6B7280", fontSize: 12, fontWeight: 500 }}
                                tickFormatter={(val) => `$${val / 1000}k`}
                            />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#1F2937", border: "none", borderRadius: "8px", color: "#fff" }}
                                itemStyle={{ color: "#10B981" }}
                                cursor={{ stroke: "#374151", strokeWidth: 1 }}
                            />
                            <Area
                                type="monotone"
                                dataKey="value"
                                stroke="#10B981"
                                strokeWidth={3}
                                fillOpacity={1}
                                fill="url(#colorRevenue)"
                            />
                        </AreaChart>
                    </ResponsiveContainer>
                </ChartWrapper>

                {/* Regional Sales Pie Chart */}
                <ChartWrapper label="Regional Sales" className="lg:col-span-4 flex flex-col">
                    <div className="h-60 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={regionData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {regionData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ borderRadius: "8px", border: "none", boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)" }}
                                />
                                <Legend
                                    verticalAlign="bottom"
                                    align="center"
                                    iconType="circle"
                                    formatter={(value) => <span className="text-xs font-medium text-gray-500">{value}</span>}
                                />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </ChartWrapper>
            </div>

            {/* 3. Bottom Table Section */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 pb-8">
                {/* Product Table */}
                <AdminCard noPadding className="lg:col-span-9 overflow-hidden">
                    <div className="flex justify-between items-center px-6 pt-6 mb-8">
                        <h2 className="text-lg font-bold text-gray-900">Top Selling Products</h2>
                        <div className="flex items-center gap-3">
                            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                                <Filter className="h-4 w-4" />
                                Filter
                                <ChevronDown className="h-3 w-3" />
                            </button>
                            <button className="px-3 py-1.5 text-sm font-medium text-gray-600 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                See All
                            </button>
                        </div>
                    </div>
                    <DataTable
                        data={sortedProducts}
                        keyExtractor={(product) => product.name}
                        sortConfig={sortConfig as any}
                        onSort={handleSort as any}
                        columns={[
                            {
                                key: "name",
                                label: "Product Name",
                                sortKey: "name",
                                render: (product) => (
                                    <div className="flex items-center gap-3">
                                        <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                                            <Image
                                                src={product.image}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                className="object-cover h-full w-full"
                                            />
                                        </div>
                                        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">{product.name}</span>
                                    </div>
                                )
                            },
                            {
                                key: "price",
                                label: "Price",
                                sortKey: "price",
                                align: "right",
                                render: (product) => (
                                    <span className="text-sm text-gray-500 font-medium">${product.price.toFixed(2)}</span>
                                )
                            },
                            {
                                key: "category",
                                label: "Category",
                                sortKey: "category",
                                render: (product) => (
                                    <span className="text-sm text-gray-500 font-medium">{product.category}</span>
                                )
                            },
                            {
                                key: "quantity",
                                label: "Quantity",
                                sortKey: "quantity",
                                align: "right",
                                render: (product) => (
                                    <span className="text-sm text-gray-500 font-medium">{product.quantity}</span>
                                )
                            },
                            {
                                key: "amount",
                                label: "Amount",
                                sortKey: "amount",
                                align: "right",
                                render: (product) => (
                                    <span className="text-sm text-gray-900 font-bold">${product.amount.toFixed(2)}</span>
                                )
                            },
                            {
                                key: "action",
                                label: "Action",
                                align: "right",
                                render: () => (
                                    <button className="text-gray-400 hover:text-primary transition-colors">
                                        <ArrowUpRight className="h-5 w-5" />
                                    </button>
                                )
                            }
                        ]}
                    />
                </AdminCard>

                {/* Monthly Target Radial Chart */}

                <ChartWrapper label="Monthly Target" className="lg:col-span-3 flex flex-col">
                    <div className="relative w-48 h-48">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={targetData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    startAngle={90}
                                    endAngle={-270}
                                    dataKey="value"
                                    stroke="none"
                                >
                                    {targetData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={TARGET_COLORS[index % TARGET_COLORS.length]} />
                                    ))}
                                </Pie>
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <span className="text-3xl font-bold text-gray-900">75%</span>
                            <span className="text-xs font-semibold text-gray-400">Target reached</span>
                        </div>
                    </div>
                    <div className="mt-8 text-center">
                        <p className="text-sm font-medium text-gray-500 line-clamp-2 px-4 italic">
                            &quot;Target you&apos;ve set for each month&quot;
                        </p>
                        <button className="mt-6 px-6 py-2 bg-gray-50 text-gray-600 text-sm font-bold rounded-xl hover:bg-gray-100 transition-all border border-gray-100">
                            Manage Target
                        </button>
                    </div>
                </ChartWrapper>
            </div>
        </div>
    );
}

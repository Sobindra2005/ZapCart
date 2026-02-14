"use client";

import {
    Search,
    Plus,
    Filter,
    Calendar,
    Clock,
    Zap,
    BarChart3,
    Edit,
    Trash2,
    Eye,
    Tag,
    Timer
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import {
    Card,
    CardContent,
} from "@repo/ui/ui/card";
import { AdminCard } from "@/components/AdminCard";
import { Stat, StatsCards } from "@/components/common/StatsCards";
import { FormPopup } from "@repo/ui/ui/form-popup";
import { CreateCampaignForm } from "@/components/forms/CreateCampaignForm";

interface FlashSale {
    id: string;
    title: string;
    status: "Active" | "Upcoming" | "Ended";
    startTime: string;
    endTime: string;
    productsCount: number;
    totalRevenue: number;
    conversions: number;
    image: string;
}

const mockFlashSales: FlashSale[] = [
    {
        id: "1",
        title: "Midnight Tech Madness",
        status: "Active",
        startTime: "2025-12-23T00:00:00Z",
        endTime: "2025-12-24T00:00:00Z",
        productsCount: 45,
        totalRevenue: 12450.50,
        conversions: 320,
        image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
        id: "2",
        title: "Winter Fashion Blitz",
        status: "Upcoming",
        startTime: "2025-12-25T10:00:00Z",
        endTime: "2025-12-26T10:00:00Z",
        productsCount: 120,
        totalRevenue: 0,
        conversions: 0,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=200&h=200",
    },
    {
        id: "3",
        title: "Cyber Monday Extension",
        status: "Ended",
        startTime: "2025-12-01T00:00:00Z",
        endTime: "2025-12-02T00:00:00Z",
        productsCount: 85,
        totalRevenue: 45800.00,
        conversions: 1150,
        image: "https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&q=80&w=200&h=200",
    }
];

const stats: Stat[] = [
    {
        label: "Active Campaigns",
        value: "04",
        trend: "+2 new",
        trendDir: "up",
        vs: "Previous Week"
    },
    {
        label: "Avg. Conversion Rate",
        value: "12.4%",
        trend: "-1.2%",
        trendDir: "down",
        vs: "Previous Week"
    },
    {
        label: "Total Revenue",
        value: "$4,250.00",
        trend: "$1,250.00",
        trendDir: "up",
        vs: "Previous Week"
    },
    {
        label: "Items Sold Flash",
        value: "1,842",
        trend: "420 tps",
        trendDir: "up",
        vs: "Previous Week"
    }
]

export default function FlashSalesPage() {
    const [searchQuery, setSearchQuery] = useState("");

    const StatusBadge = ({ status }: { status: FlashSale["status"] }) => {
        const styles = {
            Active: "bg-green-50 text-green-700 border-green-200 ring-2 ring-green-500/20 animate-pulse",
            Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
            Ended: "bg-gray-50 text-gray-500 border-gray-200",
        };
        return (
            <Badge variant="outline" className={cn("px-2.5 py-0.5 font-bold", styles[status])}>
                {status}
            </Badge>
        );
    };

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 mb-8">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    <Button variant="outline" className="flex-1 md:flex-none gap-2 font-bold border-gray-200 bg-white shadow-sm">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </Button>
                    <FormPopup
                        title="Create New Campaign"
                        description="Set up a new flash sale campaign."
                        trigger={
                            <Button className="flex-1 md:flex-none gap-2 font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                                <Plus className="h-4 w-4" strokeWidth={3} />
                                Create Campaign
                            </Button>
                        }
                    >
                        <CreateCampaignForm onSubmit={(data) => console.log(data)} />
                    </FormPopup>
                </div>
            </div>

            {/* Quick Stats */}
            <StatsCards stats={stats} />

            {/* Campaign List */}
            <AdminCard className="p-0 ">
                <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="relative w-full sm:max-w-xs">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <Input
                            placeholder="Search campaigns..."
                            className="pl-10 bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-200">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-200">
                            <Calendar className="h-4 w-4" />
                            By Date
                        </Button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50/50 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                                <th className="px-6 py-4">Campaign Details</th>
                                <th className="px-6 py-4 text-center">Status</th>
                                <th className="px-6 py-4">Timing</th>
                                <th className="px-6 py-4 text-right">Performance</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockFlashSales.map((sale) => (
                                <tr key={sale.id} className="hover:bg-gray-50/80 transition-colors group">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="h-14 w-20 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm shrink-0">
                                                <Image src={sale.image} alt={sale.title} fill className="object-cover" />
                                                {sale.status === "Active" && (
                                                    <div className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full border border-white" />
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer">
                                                    {sale.title}
                                                </h3>
                                                <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                                                    <span className="flex items-center gap-1">
                                                        <Tag className="h-3 w-3" />
                                                        {sale.productsCount} Products
                                                    </span>
                                                    <span>•</span>
                                                    <span>ID: #{sale.id}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <StatusBadge status={sale.status} />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="space-y-1.5">
                                            <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                                                <Clock className="h-3.5 w-3.5 text-gray-400" />
                                                {new Date(sale.startTime).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden min-w-25">
                                                    <div
                                                        className={cn(
                                                            "h-full rounded-full",
                                                            sale.status === "Active" ? "bg-green-500" : sale.status === "Upcoming" ? "bg-blue-400" : "bg-gray-300"
                                                        )}
                                                        style={{ width: sale.status === "Ended" ? "100%" : sale.status === "Active" ? "65%" : "0%" }}
                                                    />
                                                </div>
                                                {sale.status === "Active" && (
                                                    <span className="text-[10px] font-black text-gray-500 animate-pulse">8h left</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex flex-col items-end">
                                            <span className="text-sm font-black text-gray-900">${sale.totalRevenue.toLocaleString()}</span>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase">{sale.conversions} orders</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1">
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                                                <Eye className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className="px-6 py-4 bg-gray-50/50 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs font-bold text-gray-400">Showing {mockFlashSales.length} of {mockFlashSales.length} campaigns</p>
                    <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-8 px-3 font-bold text-gray-500 border-gray-200" disabled>Previous</Button>
                        <Button variant="outline" size="sm" className="h-8 px-3 font-bold text-gray-500 border-gray-200" disabled>Next</Button>
                    </div>
                </div>
            </AdminCard>

            {/* Empty State Mockup Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-dashed border-2 border-gray-200 shadow-none bg-gray-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                            <Timer className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Queue Management</h3>
                        <p className="text-sm text-gray-500 text-center max-w-70">Automate your sale starts and ends with precision scheduling.</p>
                        <Button variant="link" className="mt-4 font-bold text-primary">Learn more</Button>
                    </CardContent>
                </Card>

                <Card className="border-dashed border-2 border-gray-200 shadow-none bg-gray-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                            <Zap className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Smart Discounts</h3>
                        <p className="text-sm text-gray-500 text-center max-w-70">Apply dynamic discounts based on stock levels and demand.</p>
                        <Button variant="link" className="mt-4 font-bold text-primary">Coming soon</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

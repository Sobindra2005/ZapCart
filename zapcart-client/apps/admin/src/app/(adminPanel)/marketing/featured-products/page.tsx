"use client";

import {
    Plus,
    GripVertical,
    Trash2,
    Settings,
    ArrowUpRight,
    LayoutGrid,
    Check
} from "lucide-react";
import Image from "next/image";
import { Input } from "@repo/ui/ui/input";
import { Button } from "@repo/ui/ui/button";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/ui/card";
import { AdminCard } from "@/components/AdminCard";

interface FeaturedProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    category: string;
    impressions: number;
    clicks: number;
    selected: boolean;
}

const mockFeaturedProducts: FeaturedProduct[] = [
    {
        id: "1",
        name: "Wireless Noise Cancelling Headphones",
        price: 349.99,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Electronics",
        impressions: 12450,
        clicks: 840,
        selected: true
    },
    {
        id: "2",
        name: "Premium Leather Satchel",
        price: 189.50,
        image: "https://images.unsplash.com/photo-1548036328-c9fa89d128fa?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Accessories",
        impressions: 8200,
        clicks: 430,
        selected: true
    },
    {
        id: "3",
        name: "Minimalist Desk Lamp",
        price: 59.00,
        image: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=100&h=100",
        category: "Home Decor",
        impressions: 4500,
        clicks: 210,
        selected: false
    }
];

export default function FeaturedProductsPage() {
    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 mb-8">
                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 font-bold border-gray-200">
                        <LayoutGrid className="h-4 w-4" />
                        Preview Layout
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Active Featured Products */}
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Spotlight</h2>
                        <span className="text-[10px] font-bold text-gray-500">8 / 12 slots used</span>
                    </div>

                    {mockFeaturedProducts.filter(p => p.selected).map((product) => (
                        <AdminCard key={product.id} className="p-4 flex items-center gap-4 group hover:border-primary/50 transition-colors shadow-sm">
                            <GripVertical className="h-4 w-4 text-gray-300 cursor-grab active:cursor-grabbing" />
                            <div className="h-12 w-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                                <Image src={product.image} alt={product.name} width={48} height={48} className="object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <h3 className="font-bold text-gray-900 truncate leading-snug">{product.name}</h3>
                                <p className="text-[10px] font-bold text-gray-400 uppercase">{product.category}</p>
                            </div>
                            <div className="hidden sm:flex flex-col items-end px-4 border-l border-gray-100">
                                <span className="text-xs font-black text-gray-900">{product.impressions.toLocaleString()}</span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase">Impressions</span>
                            </div>
                            <div className="hidden sm:flex flex-col items-end px-4 border-l border-gray-100">
                                <span className="text-xs font-black text-green-600 flex items-center gap-0.5">
                                    {(product.clicks / product.impressions * 100).toFixed(1)}%
                                    <ArrowUpRight className="h-3 w-3" />
                                </span>
                                <span className="text-[9px] font-bold text-gray-400 uppercase">CTR</span>
                            </div>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AdminCard>
                    ))}
                </div>

                {/* Recommendations / Performance */}
                <div className="space-y-6">
                    <AdminCard className=" px-0">
                        <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
                            <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Settings className="h-4 w-4 text-gray-400" />
                                Section Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-1">
                                <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Section Title</label>
                                <Input defaultValue="Recommended for You" className="font-bold text-sm bg-gray-50/50 border-gray-200" />
                            </div>
                            <Button className="w-full font-bold shadow-sm">Save Config</Button>
                        </CardContent>
                    </AdminCard>

                    <AdminCard className="bg-primary/5  p-6 border border-primary/10">
                        <div className="h-10 w-10 rounded-xl bg-primary text-white flex items-center justify-center mb-4">
                            <Check className="h-6 w-6" />
                        </div>
                        <h4 className="font-black text-primary text-lg mb-1 italic">Pro Tip</h4>
                        <p className="text-xs text-primary/70 leading-relaxed font-medium">Use high-quality lifestyle images for featured products. They tend to have 40% higher CTR than plain product shots.</p>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}

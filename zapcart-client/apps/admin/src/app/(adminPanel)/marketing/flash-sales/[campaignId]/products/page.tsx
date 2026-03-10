"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft, Plus, Search, Sparkles, Tag, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import { Input } from "@repo/ui/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@repo/ui/ui/card";
import { marketingApi } from "@/utils/api";


type CampaignStatus = "upcoming" | "active" | "expired" | "paused";
type CampaignDiscountType = "percentage" | "fixed" | "buy-one-get-one";

interface Campaign {
    _id: string;
    name: string;
    description: string;
    products: string[];
    status: CampaignStatus;
    discountType: CampaignDiscountType;
    discountValue: number;
    startDate: string;
    endDate: string;
    image: string;
}

interface ProductLibraryItem {
    id: string;
    name: string;
    category: string;
    price: number;
    stock: number;
    rating: number;
    image: string;
    shortDescription: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=200&h=200";

const PRODUCT_LIBRARY: ProductLibraryItem[] = [
    {
        id: "prod-wireless-headphones",
        name: "Wireless Headphones Pro",
        category: "Electronics",
        price: 129.99,
        stock: 42,
        rating: 4.8,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=400&h=300",
        shortDescription: "Active noise cancellation with 30-hour battery life.",
    },
    {
        id: "prod-smartwatch-neo",
        name: "Smartwatch Neo",
        category: "Electronics",
        price: 89.0,
        stock: 64,
        rating: 4.5,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=400&h=300",
        shortDescription: "Fitness tracking and smart notifications in one.",
    },
    {
        id: "prod-cotton-tee",
        name: "Organic Cotton Tee",
        category: "Fashion",
        price: 24.5,
        stock: 110,
        rating: 4.4,
        image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=400&h=300",
        shortDescription: "Soft, breathable fabric with a premium fit.",
    },
    {
        id: "prod-running-shoes",
        name: "Velocity Running Shoes",
        category: "Fashion",
        price: 74.99,
        stock: 58,
        rating: 4.7,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=400&h=300",
        shortDescription: "Lightweight cushioning for everyday training.",
    },
    {
        id: "prod-coffee-maker",
        name: "BrewMaster Coffee Maker",
        category: "Home",
        price: 56.75,
        stock: 26,
        rating: 4.2,
        image: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&q=80&w=400&h=300",
        shortDescription: "Programmable brewing with thermal carafe.",
    },
    {
        id: "prod-table-lamp",
        name: "Nordic Table Lamp",
        category: "Home",
        price: 39.99,
        stock: 73,
        rating: 4.6,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=400&h=300",
        shortDescription: "Warm lighting with minimalist Scandinavian style.",
    },
];

const normalizeCampaign = (raw: Partial<Campaign> & { id?: string; title?: string; bannerImage?: string }): Campaign => ({
    _id: raw._id ?? raw.id ?? "",
    name: raw.name ?? raw.title ?? "Untitled Campaign",
    description: raw.description ?? "",
    products: Array.isArray(raw.products) ? raw.products.map((item) => String(item)) : [],
    status:
        raw.status === "active" || raw.status === "paused" || raw.status === "expired" || raw.status === "upcoming"
            ? raw.status
            : "upcoming",
    discountType:
        raw.discountType === "fixed" || raw.discountType === "buy-one-get-one" || raw.discountType === "percentage"
            ? raw.discountType
            : "percentage",
    discountValue: Number(raw.discountValue ?? 0),
    startDate: raw.startDate ?? new Date().toISOString(),
    endDate: raw.endDate ?? new Date().toISOString(),
    image: raw.image ?? raw.bannerImage ?? FALLBACK_IMAGE,
});

const extractCampaignDetail = (response: unknown): Campaign | null => {
    const payload = (response as { data?: { data?: unknown } })?.data?.data;
    if (Array.isArray(payload)) {
        const first = payload[0] as (Partial<Campaign> & { id?: string; title?: string; bannerImage?: string }) | undefined;
        return first ? normalizeCampaign(first) : null;
    }
    if (payload && typeof payload === "object") {
        return normalizeCampaign(payload as Partial<Campaign> & { id?: string; title?: string; bannerImage?: string });
    }
    return null;
};

const buildCampaignFormData = (campaign: Campaign, products: string[]): FormData => {
    const formData = new FormData();
    formData.append("name", campaign.name);
    formData.append("description", campaign.description ?? "");
    formData.append("products", JSON.stringify(products));
    formData.append("status", campaign.status);
    formData.append("discountType", campaign.discountType);
    formData.append("discountValue", String(campaign.discountValue));
    formData.append("startDate", campaign.startDate);
    formData.append("endDate", campaign.endDate);
    formData.append("image", campaign.image ?? FALLBACK_IMAGE);
    return formData;
};

export default function FlashSaleProductsPage() {
    const params = useParams<{ campaignId: string }>();
    const campaignId = String(params?.campaignId ?? "");

    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState<string>("All");
    const [activeProductId, setActiveProductId] = useState<string | null>(null);

    const { data: campaignResponse, isLoading, isError, refetch } = useQuery({
        queryKey: ["flash-sales", "campaign", campaignId],
        queryFn: () => marketingApi.getCampaignById(campaignId),
        enabled: Boolean(campaignId),
    });

    const campaign = useMemo(() => extractCampaignDetail(campaignResponse), [campaignResponse]);

    const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);

    const hydratedSelectedProducts = useMemo(() => {
        const known = PRODUCT_LIBRARY.filter((item) => selectedProductIds.includes(item.id));
        const unknown = selectedProductIds
            .filter((id) => !known.some((item) => item.id === id))
            .map((id) => ({
                id,
                name: id,
                category: "Uncategorized",
                price: 0,
                stock: 0,
                rating: 0,
                image: FALLBACK_IMAGE,
                shortDescription: "This product is attached to the campaign but missing from local catalog preview.",
            }));
        return [...known, ...unknown];
    }, [selectedProductIds]);

    const activeProduct = useMemo(() => {
        if (!activeProductId) {
            return hydratedSelectedProducts[0] ?? PRODUCT_LIBRARY[0] ?? null;
        }
        return hydratedSelectedProducts.find((item) => item.id === activeProductId)
            ?? PRODUCT_LIBRARY.find((item) => item.id === activeProductId)
            ?? null;
    }, [activeProductId, hydratedSelectedProducts]);

    const categories = useMemo(() => {
        const base = PRODUCT_LIBRARY.map((item) => item.category);
        return ["All", ...Array.from(new Set(base))];
    }, []);

    const discoverProducts = useMemo(() => {
        return PRODUCT_LIBRARY.filter((item) => {
            const matchCategory = selectedCategory === "All" || item.category === selectedCategory;
            const query = searchQuery.trim().toLowerCase();
            const matchQuery = !query
                || item.name.toLowerCase().includes(query)
                || item.shortDescription.toLowerCase().includes(query)
                || item.id.toLowerCase().includes(query);
            return matchCategory && matchQuery;
        });
    }, [searchQuery, selectedCategory]);

    const updateProductsMutation = useMutation({
        mutationFn: ({ currentCampaign, products }: { currentCampaign: Campaign; products: string[] }) => {
            const formData = buildCampaignFormData(currentCampaign, products);
            return marketingApi.updateCampaign(currentCampaign._id, formData);
        },
        onSuccess: () => {
            toast.success("Campaign products updated successfully");
            queryClient.invalidateQueries({ queryKey: ["flash-sales", "campaign", campaignId] });
            queryClient.invalidateQueries({ queryKey: ["flash-sales", "campaigns"] });
        },
        onError: (error: unknown) => {
            toast.error("Failed to update campaign products", {
                description: error instanceof Error ? error.message : "Please try again.",
            });
        },
    });

    useEffect(() => {
        if (!campaign) {
            return;
        }
        setSelectedProductIds(campaign.products);
    }, [campaign]);

    const addProduct = (id: string) => {
        setSelectedProductIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    };

    const removeProduct = (id: string) => {
        setSelectedProductIds((prev) => prev.filter((productId) => productId !== id));
    };

    const canSave = Boolean(campaign) && selectedProductIds.length > 0 && !updateProductsMutation.isPending;

    if (!campaignId) {
        return <div className="p-8">Invalid campaign ID.</div>;
    }

    return (
        <div className="p-6 md:p-8 space-y-6">
            <div className="flex flex-col md:flex-row md:items-center md:justify-end gap-4">
                <Button
                    disabled={!canSave}
                    className="font-semibold"
                    onClick={() => {
                        if (!campaign) {
                            return;
                        }
                        updateProductsMutation.mutate({ currentCampaign: campaign, products: selectedProductIds });
                    }}
                >
                    {updateProductsMutation.isPending ? "Saving..." : "Save Product Changes"}
                </Button>
            </div>

            {isLoading ? (
                <Card>
                    <CardContent className="py-8 text-sm text-gray-500">Loading campaign products...</CardContent>
                </Card>
            ) : isError || !campaign ? (
                <Card>
                    <CardContent className="py-8 space-y-3">
                        <p className="text-sm text-red-600">Unable to load this campaign.</p>
                        <Button variant="outline" size="sm" onClick={() => refetch()}>
                            Retry
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
                    <Card className="xl:col-span-7 border-gray-200">
                        <CardHeader className="space-y-4">
                            <CardTitle className="flex items-center gap-2 text-lg">
                                Discover & Add Products
                            </CardTitle>
                            <div className="flex flex-col md:flex-row gap-3">
                                <div className="relative flex-1">
                                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                    <Input
                                        className="pl-9"
                                        placeholder="Search by name, ID, or product details"
                                        value={searchQuery}
                                        onChange={(event) => setSearchQuery(event.target.value)}
                                    />
                                </div>
                                <div className="flex gap-2 overflow-x-auto pb-1">
                                    {categories.map((category) => (
                                        <Button
                                            key={category}
                                            size="sm"
                                            variant={selectedCategory === category ? "default" : "outline"}
                                            onClick={() => setSelectedCategory(category)}
                                            className="whitespace-nowrap"
                                        >
                                            {category}
                                        </Button>
                                    ))}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="mt-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto pr-1">
                                {discoverProducts.map((item) => {
                                    const isSelected = selectedProductIds.includes(item.id);
                                    return (
                                        <div
                                            key={item.id}
                                            className="rounded-xl border border-gray-200 bg-white p-3 space-y-3 shadow-sm"
                                        >
                                            <div className="flex gap-3">
                                                <div className="relative h-16 w-20 rounded-lg overflow-hidden shrink-0">
                                                    <img src={item.image} alt={item.name} className="h-full w-full object-cover" />
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-bold text-gray-900 truncate">{item.name}</p>
                                                    <p className="text-xs text-gray-500 mt-1">{item.shortDescription}</p>
                                                </div>
                                            </div>
                                            <div className="flex items-center justify-between gap-2">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <Badge variant="outline">{item.category}</Badge>
                                                    <Badge variant="secondary">${item.price.toFixed(2)}</Badge>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    variant={isSelected ? "outline" : "default"}
                                                    onClick={() => (isSelected ? removeProduct(item.id) : addProduct(item.id))}
                                                    className="font-semibold"
                                                >
                                                    {isSelected ? (
                                                        <>
                                                            <Trash2 className="h-3.5 w-3.5 mr-1" />
                                                            Remove
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Plus className="h-3.5 w-3.5 mr-1" />
                                                            Add
                                                        </>
                                                    )}
                                                </Button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="xl:col-span-5 border-gray-200">
                        <CardHeader>
                            <CardTitle className="flex items-center justify-between text-lg">
                                <span>Selected Products</span>
                                <Badge>{selectedProductIds.length}</Badge>
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="max-h-[40vh] overflow-y-auto space-y-2 pr-1">
                                {hydratedSelectedProducts.length === 0 ? (
                                    <div className="text-sm text-gray-500 rounded-lg border border-dashed border-gray-300 p-4 text-center">
                                        No products selected yet.
                                    </div>
                                ) : (
                                    hydratedSelectedProducts.map((item) => (
                                        <div key={item.id} className="flex items-center justify-between gap-2 rounded-lg border border-gray-200 p-2">
                                            <button
                                                type="button"
                                                className="text-left min-w-0"
                                                onClick={() => setActiveProductId(item.id)}
                                            >
                                                <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500 truncate">{item.id}</p>
                                            </button>
                                            <Button size="icon" variant="ghost" onClick={() => removeProduct(item.id)} aria-label={`Remove ${item.name}`}>
                                                <Trash2 className="h-4 w-4 text-red-500" />
                                            </Button>
                                        </div>
                                    ))
                                )}
                            </div>

                            {activeProduct && (
                                <div className="rounded-xl border border-gray-200 bg-gray-50/60 p-3 space-y-3">
                                    <div className="flex gap-3">
                                        <div className="relative h-14 w-18 rounded-md overflow-hidden shrink-0">
                                            <img src={activeProduct.image} alt={activeProduct.name} className="h-full w-full object-cover" />
                                        </div>
                                        <div className="min-w-0">
                                            <p className="text-sm font-bold text-gray-900">{activeProduct.name}</p>
                                            <p className="text-xs text-gray-500 mt-1">{activeProduct.shortDescription}</p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-3 gap-2 text-xs">
                                        <div className="rounded-md bg-white border border-gray-200 p-2">
                                            <p className="text-gray-500">Category</p>
                                            <p className="font-semibold text-gray-900 flex items-center gap-1 mt-1">
                                                <Tag className="h-3 w-3" />
                                                {activeProduct.category}
                                            </p>
                                        </div>
                                        <div className="rounded-md bg-white border border-gray-200 p-2">
                                            <p className="text-gray-500">Price</p>
                                            <p className="font-semibold text-gray-900 mt-1">${activeProduct.price.toFixed(2)}</p>
                                        </div>
                                        <div className="rounded-md bg-white border border-gray-200 p-2">
                                            <p className="text-gray-500">Stock</p>
                                            <p className="font-semibold text-gray-900 mt-1">{activeProduct.stock}</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

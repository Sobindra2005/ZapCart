"use client";

import {
    Plus,
    Trash2,
    Settings,
    Search,
    Loader2,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Input } from "@repo/ui/ui/input";
import { Button } from "@repo/ui/ui/button";
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/ui/card";
import { AdminCard } from "@/components/AdminCard";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { marketingApi } from "@/utils/api";
import { toast } from "sonner";
import { Badge } from "@repo/ui/ui/badge";
import { Product, SearchProduct } from "@/types/product";

const FEATURED_PRODUCT_LIMIT = 7;

const pickProductId = (product: Partial<Product | SearchProduct> & { productId?: string; entityId?: string }) =>
    String(product.entityId ?? product._id ?? (product as Partial<Product>).id ?? product.productId ?? "");

const extractArrayData = <T,>(response: unknown): T[] => {
    const payload = (response as { data?: { data?: unknown } | unknown })?.data;

    if (Array.isArray(payload)) {
        return payload as T[];
    }

    if (payload && typeof payload === "object" && "data" in payload) {
        const nested = (payload as { data?: unknown }).data;
        if (Array.isArray(nested)) {
            return nested as T[];
        }
        if (nested && typeof nested === "object" && "items" in nested) {
            const items = (nested as { items?: unknown }).items;
            if (Array.isArray(items)) {
                return items as T[];
            }
        }
    }

    return [];
};

const getCategoryName = (category: Product["category"]) => {
    if (typeof category === "string") {
        return category;
    }

    return category?.name ?? "Uncategorized";
};

const getProductImage = (product: SearchProduct | Product) => {
    if ("images" in product) {
        return product.thumbnail ?? product.images?.[0] ?? "";
    }

    return product.thumbnail ?? "";
};

export default function FeaturedProductsPage() {
    const queryClient = useQueryClient();
    const [searchQuery, setSearchQuery] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");

    useEffect(() => {
        const timer = window.setTimeout(() => {
            setDebouncedSearch(searchQuery.trim());
        }, 350);

        return () => window.clearTimeout(timer);
    }, [searchQuery]);

    const {
        data: featuredResponse,
        isLoading: isFeaturedLoading,
        isFetching: isFeaturedFetching,
    } = useQuery({
        queryKey: ["marketing", "featured-products"],
        queryFn: () => marketingApi.getFeaturedProducts(),
    });

    const featuredProducts = useMemo(() => {
        return extractArrayData<Product>(featuredResponse);
    }, [featuredResponse]);

    const featuredProductIds = useMemo(() => {
        return new Set(featuredProducts.map((product) => pickProductId(product)));
    }, [featuredProducts]);

    const {
        data: searchResponse,
        isLoading: isSearchLoading,
        isFetching: isSearchFetching,
    } = useQuery({
        queryKey: ["products", "search", debouncedSearch],
        queryFn: () =>
            marketingApi.searchSuggestions(
                debouncedSearch
            ),
        enabled: debouncedSearch.length > 0,
    });

    const searchResults = useMemo(() => {
        const results = extractArrayData<SearchProduct>(searchResponse);
        return results.filter((product) => !featuredProductIds.has(pickProductId(product)));
    }, [featuredProductIds, searchResponse]);

    const addFeaturedMutation = useMutation({
        mutationFn: (productId: string) => marketingApi.addFeaturedProduct(productId),
        onSuccess: () => {
            toast.success("Product added to featured list");
            queryClient.invalidateQueries({ queryKey: ["marketing", "featured-products"] });
        },
        onError: (error: unknown) => {
            toast.error("Failed to add featured product", {
                description: error instanceof Error ? error.message : "Please try again.",
            });
        },
    });

    const removeFeaturedMutation = useMutation({
        mutationFn: (productId: string) => marketingApi.removeFeaturedProduct(productId),
        onSuccess: () => {
            toast.success("Product removed from featured list");
            queryClient.invalidateQueries({ queryKey: ["marketing", "featured-products"] });
        },
        onError: (error: unknown) => {
            toast.error("Failed to remove featured product", {
                description: error instanceof Error ? error.message : "Please try again.",
            });
        },
    });

    const isAtLimit = featuredProducts.length >= FEATURED_PRODUCT_LIMIT;

    const onAddFeatured = (productId: string) => {
        if (featuredProductIds.has(productId)) {
            return;
        }

        if (isAtLimit) {
            toast.error(`Featured products limit reached (${FEATURED_PRODUCT_LIMIT})`);
            return;
        }

        addFeaturedMutation.mutate(productId);
    };

    const onRemoveFeatured = (productId: string) => {
        removeFeaturedMutation.mutate(productId);
    };

    return (
        <div className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 mb-8">
                <Badge variant="outline" className="font-bold">
                    {featuredProducts.length} / {FEATURED_PRODUCT_LIMIT} slots used
                </Badge>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    <div className="flex items-center justify-between mb-4">
                        <h3 className="text-sm font-black text-gray-400 uppercase tracking-widest">Active Spotlight</h3>
                        {isFeaturedFetching && !isFeaturedLoading && (
                            <span className="text-[11px] text-gray-500">Refreshing...</span>
                        )}
                    </div>

                    {isFeaturedLoading ? (
                        <Card>
                            <CardContent className="py-8 text-sm text-gray-500 flex items-center gap-2">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading featured products...
                            </CardContent>
                        </Card>
                    ) : featuredProducts.length === 0 ? (
                        <AdminCard className="p-6 border border-dashed border-gray-300 text-center text-sm text-gray-500">
                            No featured products yet.
                        </AdminCard>
                    ) : (
                        featuredProducts.map((product) => {
                            const productId = pickProductId(product);
                            const image = getProductImage(product);

                            return (
                                <AdminCard key={productId} className="p-4 flex items-center gap-4 group hover:border-primary/50 transition-colors shadow-sm">
                                    <div className="h-12 w-12 rounded-lg bg-gray-50 overflow-hidden shrink-0 border border-gray-100">
                                        {image ? (
                                            <img src={image} alt={product.name} className="h-full w-full object-cover" />
                                        ) : (
                                            <div className="h-full w-full bg-gray-100" />
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-bold text-gray-900 truncate leading-snug">{product.name}</h4>
                                        <p className="text-[10px] font-bold text-gray-400 uppercase">{getCategoryName(product.category)}</p>
                                    </div>
                                    <div className="hidden sm:flex flex-col items-end px-4 border-l border-gray-100">
                                        <span className="text-xs font-black text-gray-900">${Number(product.basePrice || 0).toFixed(2)}</span>
                                        <span className="text-[9px] font-bold text-gray-400 uppercase">Price</span>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                                        onClick={() => onRemoveFeatured(productId)}
                                        disabled={removeFeaturedMutation.isPending}
                                        aria-label={`Remove ${product.name}`}
                                    >
                                        {removeFeaturedMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        ) : (
                                            <Trash2 className="h-4 w-4" />
                                        )}
                                    </Button>
                                </AdminCard>
                            );
                        })
                    )}
                </div>

                <div className="space-y-6">
                    <AdminCard className="px-0">
                        <CardHeader className="bg-gray-50/50 pb-4 border-b border-gray-100">
                            <CardTitle className="text-sm font-bold text-gray-900 flex items-center gap-2">
                                <Settings className="h-4 w-4 text-gray-400" />
                                Product Search
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="relative">
                                <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                                <Input
                                    value={searchQuery}
                                    onChange={(event) => setSearchQuery(event.target.value)}
                                    placeholder="Search products by name"
                                    className="pl-9"
                                />
                            </div>

                            <div className="max-h-[55vh] overflow-y-auto space-y-2">
                                {!debouncedSearch ? (
                                    <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        Start typing to search products.
                                    </div>
                                ) : (isSearchLoading || isSearchFetching) ? (
                                    <div className="text-sm text-gray-500 flex items-center gap-2 py-4">
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Loading products...
                                    </div>
                                ) : searchResults.length === 0 ? (
                                    <div className="text-sm text-gray-500 border border-dashed border-gray-300 rounded-lg p-4 text-center">
                                        No products found.
                                    </div>
                                ) : (
                                    searchResults.map((product) => {
                                        const productId = pickProductId(product);
                                        const image = getProductImage(product);
                                        const alreadyFeatured = featuredProductIds.has(productId);
                                        const disableAdd = alreadyFeatured || isAtLimit || addFeaturedMutation.isPending;

                                        return (
                                            <div
                                                key={productId}
                                                className="rounded-lg border border-gray-200 p-3 flex items-center gap-3"
                                            >
                                                <div className="h-10 w-10 rounded-md overflow-hidden bg-gray-100 shrink-0">
                                                    {image ? (
                                                        <img src={image} alt={product.name} className="h-full w-full object-cover" />
                                                    ) : null}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <p className="text-sm font-semibold text-gray-900 truncate">{product.name}</p>
                                                    <p className="text-xs text-gray-500">${Number(product.basePrice || 0).toFixed(2)}</p>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => onAddFeatured(productId)}
                                                    disabled={disableAdd}
                                                    className="font-semibold"
                                                >
                                                    {addFeaturedMutation.isPending ? (
                                                        <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                                    ) : (
                                                        <Plus className="h-3.5 w-3.5 mr-1" />
                                                    )}
                                                    Add
                                                </Button>
                                            </div>
                                        );
                                    })
                                )}
                            </div>

                            {isAtLimit && (
                                <p className="text-xs text-amber-600 font-semibold">
                                    Featured slots are full. Remove one to add another product.
                                </p>
                            )}
                        </CardContent>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}

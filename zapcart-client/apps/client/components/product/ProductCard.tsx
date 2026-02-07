"use client";

import { useState } from "react";
import Link from "next/link";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@repo/ui/ui/card";
import { Button } from "@repo/ui/ui/button";
import { Product } from "@/types/product";
import { cn } from "@repo/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { wishListApi } from "@/utils/api";

interface ProductCardProps {
    product: Product;
}


export function ProductCard({ product }: ProductCardProps) {
    const [imageError, setImageError] = useState(false);
    const queryClient = useQueryClient();
    const productId = product.id || product._id;

    // Check if product is in wishlist
    const { data: wishlistData, isLoading: isCheckingWishlist } = useQuery({
        queryKey: ['wishlist-check', productId],
        queryFn: () => wishListApi.checkWishlistItem(productId),
        enabled: !!productId,
        retry: false,
    });

    const isFavorite = wishlistData?.inWishlist || false;

    // Toggle wishlist mutation with optimistic updates
    const toggleWishlistMutation = useMutation({
        mutationFn: (productId: string) => wishListApi.toggleWishListItem(productId),
        // Optimistic update
        onMutate: async (productId: string) => {
            // Cancel any outgoing refetches to avoid overwriting optimistic update
            await queryClient.cancelQueries({ queryKey: ['wishlist-check', productId] });
            await queryClient.cancelQueries({ queryKey: ['wishlist'] });

            // Snapshot the previous value
            const previousWishlistCheck = queryClient.getQueryData(['wishlist-check', productId]);
            const previousWishlist = queryClient.getQueryData(['wishlist']);

            // Optimistically update the wishlist check
            queryClient.setQueryData(['wishlist-check', productId], (old: any) => {
                return {
                    ...old,
                    inWishlist: !isFavorite
                };
            });

            // Return context with the previous values to rollback on error
            return { previousWishlistCheck, previousWishlist };
        },
        onError: (error, productId, context) => {
            // Rollback to previous state on error
            if (context?.previousWishlistCheck) {
                queryClient.setQueryData(['wishlist-check', productId], context.previousWishlistCheck);
            }
            if (context?.previousWishlist) {
                queryClient.setQueryData(['wishlist'], context.previousWishlist);
            }
            console.error('Failed to toggle wishlist item:', error);
            // You can add toast notification here
        },
        onSettled: (data, error, productId) => {
            // Always refetch after error or success to ensure we're in sync with the server
            queryClient.invalidateQueries({ queryKey: ['wishlist-check', productId] });
            queryClient.invalidateQueries({ queryKey: ['wishlist'] });
        },
    });

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        if (!productId) return;

        toggleWishlistMutation.mutate(productId);
    };

    const isUpdatingWishlist = toggleWishlistMutation.isPending;

    return (
        <Link href={`/product/${product.id || product._id}`}>
            <Card className="group overflow-hidden transition-all ">
                <CardContent className="p-4 cursor-pointer ">
                    {/* Image Container */}
                    <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                        {/* Placeholder for product image */}
                        <div className="w-full h-full flex items-center justify-center  from-gray-100 to-gray-200">
                            {product.thumbnail && !imageError ? (
                                <img
                                    src={product.thumbnail}
                                    alt={product.name}
                                    className="object-cover w-full h-full"
                                    onError={() => setImageError(true)}
                                />
                            ) : (
                                <span className="text-gray-400 text-sm">No Image</span>
                            )}
                        </div>

                        {/* Wishlist Button */}
                        <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                                "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-colors",
                                isFavorite && "text-red-500"
                            )}
                            onClick={handleFavoriteClick}
                            disabled={isCheckingWishlist}
                        >
                            <Heart className={cn("h-4 w-4 transition-all", isFavorite && "fill-current")} />
                        </Button>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-2">
                        <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
                        <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                            {product.discountPercentage && product.compareAtPrice ? (
                                <div className="flex items-center gap-2">
                                    <span className="text-lg font-bold">
                                        ${product.basePrice?.toFixed(2)}
                                    </span>
                                    <span className="text-sm line-through text-muted-foreground">
                                        ${product.compareAtPrice?.toFixed(2)}
                                    </span>
                                    <span className="text-xs text-red-500 font-semibold">
                                        -{product.discountPercentage}%
                                    </span>
                                </div>
                            ) : (
                                <span className="text-lg font-bold">
                                    ${product.basePrice?.toFixed(2)}
                                </span>
                            )}

                            {/* Rating */}
                            {(product.averageRating ?? 0) > 0 && (
                                <div className="flex items-center gap-1">
                                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                    <span className="text-sm font-medium">{!product.reviewCount ? 0 : product.averageRating ?? 0}</span>
                                    {(product.reviewCount ?? 0) > 0 && (
                                        <span className="text-xs text-muted-foreground">({product.reviewCount})</span>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}

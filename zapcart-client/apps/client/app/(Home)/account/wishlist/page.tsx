"use client";

import { ProductCard } from "@/components/product/ProductCard";
import { Heart, Loader2 } from "lucide-react";
import { Button } from "@repo/ui/ui/button";
import { Product } from "@/types/product";
import { useQuery } from "@tanstack/react-query";
import { wishListApi } from "@/utils/api";
import { EmptySection } from "@/components/emptySection";
import Link from "next/link";

export default function WishlistPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ['wishlist'],
        queryFn: wishListApi.getWishlist,
    });

    const wishlistProducts: {
        id: string;
        product: Product;
    }[] = data?.data || [];
    console.log({ wishlistProducts, data });

    if (isLoading) {
        return (
            <EmptySection
                message="Loading your wishlist..."
                icon={<Loader2 size={48} className="animate-spin" />}
                minHeight="400px"
            />
        );
    }

    if (error) {
        return (
            <EmptySection
                message="Failed to load wishlist"
                icon={<Heart className="h-10 w-10 text-muted-foreground opacity-50" />}
                minHeight="400px"
            />
        );
    }

    return (
        <div className="space-y-6 max-h-screen overflow-auto">
            <h1 className="text-2xl font-bold">My Wishlist</h1>

            {wishlistProducts.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 ">
                    {wishlistProducts.map((product,index) => (
                        <ProductCard key={index} product={product.product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border rounded-lg border-dashed">
                    <Heart className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-6">Save items you want to buy later.</p>
                    <Link href="/">
                        <Button>Explore Products</Button>
                    </Link>
                </div>
            )}
        </div>
    );
}

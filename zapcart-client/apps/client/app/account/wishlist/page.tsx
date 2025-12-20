"use client";

import { mockUser } from "@/data/mockAccountData";
import { ProductCard } from "@/components/ProductCard";
import { Heart } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function WishlistPage() {
    const wishlist = mockUser.wishlist;

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">My Wishlist</h1>

            {wishlist.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {wishlist.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-16 border rounded-lg border-dashed">
                    <Heart className="h-10 w-10 mx-auto text-muted-foreground opacity-50 mb-4" />
                    <h3 className="text-lg font-medium">Your wishlist is empty</h3>
                    <p className="text-muted-foreground mb-6">Save items you want to buy later.</p>
                    <Button>Explore Products</Button>
                </div>
            )}
        </div>
    );
}

"use client";

import { useState } from "react";
import Image from "next/image";
import { Heart, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { cn } from "@/lib/utils";

interface ProductCardProps {
    product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
    const [isFavorite, setIsFavorite] = useState(false);

    return (
        <Card className="group overflow-hidden transition-all hover:shadow-lg">
            <CardContent className="p-4">
                {/* Image Container */}
                <div className="relative aspect-square mb-4 bg-gray-50 rounded-lg overflow-hidden">
                    {/* Placeholder for product image */}
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-200">
                        <span className="text-gray-400 text-sm">Product Image</span>
                    </div>

                    {/* Wishlist Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "absolute top-2 right-2 h-8 w-8 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white",
                            isFavorite && "text-red-500"
                        )}
                        onClick={() => setIsFavorite(!isFavorite)}
                    >
                        <Heart className={cn("h-4 w-4", isFavorite && "fill-current")} />
                    </Button>
                </div>

                {/* Product Info */}
                <div className="space-y-2">
                    <h3 className="font-semibold text-base line-clamp-1">{product.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-1">{product.description}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                        <span className="text-lg font-bold">${product.price.toFixed(2)}</span>

                        {/* Rating */}
                        {product.rating > 0 && (
                            <div className="flex items-center gap-1">
                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                <span className="text-sm font-medium">{product.rating}</span>
                                {product.reviews > 0 && (
                                    <span className="text-xs text-muted-foreground">({product.reviews})</span>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

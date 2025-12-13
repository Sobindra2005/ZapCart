"use client";

import { useState } from "react";
import { Heart, ChevronDown, Package, Truck, Calendar, Box, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Product } from "@/types/product";
import { SizeSelector } from "./SizeSelector";
import { cn } from "@/lib/utils";
import { useCart } from "@/contexts/CartContext";

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {
    const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || "");
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [descriptionOpen, setDescriptionOpen] = useState(true);
    const [shippingOpen, setShippingOpen] = useState(true);
    
    const { addToCart } = useCart();
    const router = useRouter();

    const handleIncrement = () => {
        setQuantity((prev) => prev + 1);
    };

    const handleDecrement = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleAddToCart = () => {
        addToCart({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: quantity,
            size: selectedSize,
        });
        router.push("/cart");
    };

    return (
        <div className="space-y-6">
            {/* Category */}
            <div className="text-sm text-muted-foreground">{product.category}</div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Price */}
            <div className="text-2xl font-bold">${product.price.toFixed(2)}</div>

            {/* Delivery Info */}
            {product.shippingInfo && (
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                        Order in <span className="font-semibold">{product.shippingInfo.estimatedDelivery}</span> to get next day delivery
                    </span>
                </div>
            )}

            {/* Size Selector */}
            {product.sizes && product.sizes.length > 0 && (
                <SizeSelector
                    sizes={product.sizes}
                    selectedSize={selectedSize}
                    onSizeChange={setSelectedSize}
                />
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>In stock (can be backordered)</span>
            </div>

            {/* Quantity Selector & Add to Cart */}
            <div className="flex gap-3">
                {/* Quantity Selector */}
                <div className="flex items-center border rounded-full overflow-hidden">
                    <button
                        onClick={handleDecrement}
                        className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Decrease quantity"
                    >
                        <Minus className="w-4 h-4" />
                    </button>
                    <div className="w-12 h-12 flex items-center justify-center border-x">
                        {quantity}
                    </div>
                    <button
                        onClick={handleIncrement}
                        className="w-10 h-12 flex items-center justify-center hover:bg-gray-100 transition-colors"
                        aria-label="Increase quantity"
                    >
                        <Plus className="w-4 h-4" />
                    </button>
                </div>
                
                {/* Add to Cart Button */}
                <Button
                    onClick={handleAddToCart}
                    className="flex-1 h-12 rounded-full bg-orange-700 text-white font-medium hover:bg-orange-800"
                    size="lg"
                >
                   Add to cart
                </Button>

                {/* Wishlist Button */}
                <Button
                    variant="outline"
                    size="icon"
                    className={cn(
                        "h-12 w-12 rounded-full",
                        isFavorite && "text-red-500 border-red-500"
                    )}
                    onClick={() => setIsFavorite(!isFavorite)}
                >
                    <Heart className={cn("h-5 w-5", isFavorite && "fill-current")} />
                </Button>
            </div>

            {/* Description & Fit */}
            <div className="border-t pt-6">
                <button
                    onClick={() => setDescriptionOpen(!descriptionOpen)}
                    className="w-full flex items-center justify-between py-3 text-left"
                >
                    <span className="font-semibold">Description & Fit</span>
                    <ChevronDown
                        className={cn(
                            "w-5 h-5 transition-transform",
                            descriptionOpen && "rotate-180"
                        )}
                    />
                </button>
                {descriptionOpen && (
                    <div className="py-3 text-sm text-muted-foreground leading-relaxed">
                        {product.detailedDescription || product.description}
                    </div>
                )}
            </div>

            {/* Shipping */}
            {product.shippingInfo && (
                <div className="border-t pt-6">
                    <button
                        onClick={() => setShippingOpen(!shippingOpen)}
                        className="w-full flex items-center justify-between py-3 text-left"
                    >
                        <span className="font-semibold">Shipping</span>
                        <ChevronDown
                            className={cn(
                                "w-5 h-5 transition-transform",
                                shippingOpen && "rotate-180"
                            )}
                        />
                    </button>
                    {shippingOpen && (
                        <div className="py-3 space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                        <Package className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Discount</div>
                                        <div className="text-sm text-muted-foreground">
                                            {product.shippingInfo.discount}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                        <Truck className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Package</div>
                                        <div className="text-sm text-muted-foreground">
                                            {product.shippingInfo.packageType}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                        <Calendar className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Delivery Time</div>
                                        <div className="text-sm text-muted-foreground">
                                            {product.shippingInfo.deliveryTime}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                        <Box className="w-5 h-5 text-white" />
                                    </div>
                                    <div>
                                        <div className="text-sm font-medium">Estimated Arrival</div>
                                        <div className="text-sm text-muted-foreground">
                                            {product.shippingInfo.estimatedDelivery}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

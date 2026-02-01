"use client";

import { useState } from "react";
import { Heart, ChevronDown, Package, Truck, Calendar, Box, Minus, Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@repo/ui/ui/button";
import { Product } from "@/types/product";
import { cn } from "@repo/lib/utils";
import { useCart } from "@/contexts/CartContext";
import { motion, AnimatePresence } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { systemSettingsApi } from "@/utils/api";
import { ShippingSettingsDescription, SystemSetting } from "@/types/systemSetting";
import { SizeSelector } from "../SizeSelector";

interface ProductInfoProps {
    product: Product;
}

export function ProductInfo({ product }: ProductInfoProps) {

    const availableSizes = product.hasVariants && product.variants
        && Array.from(new Set(product.variants.map(v => v.size).filter(Boolean))) || []

    // Check if product has variants but no sizes
    const hasVariantsWithoutSizes = product.hasVariants && product.variants && product.variants.length > 0 && availableSizes.length === 0;

    const [selectedSize, setSelectedSize] = useState(availableSizes[0] || "");
    const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
    const [isFavorite, setIsFavorite] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [descriptionOpen, setDescriptionOpen] = useState(true);
    const [shippingOpen, setShippingOpen] = useState(true);

    const { addToCart } = useCart();
    const router = useRouter();

    // Get current variant based on selected size or index
    const currentVariant = product.hasVariants && product.variants
        ? (selectedSize
            ? product.variants.find(v => v.size === selectedSize)
            : product.variants[selectedVariantIndex])
        : null;

    // Determine price and stock based on variant or product
    const currentPrice = currentVariant?.price ?? product.basePrice;
    const currentStock = currentVariant?.stock ?? product.totalStock;

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
            price: currentPrice,
            image: currentVariant?.images?.[0] ?? product.thumbnail ?? "",
            quantity: quantity,
            size: selectedSize,
            variant: currentVariant ? {
                sku: currentVariant.sku,
                color: currentVariant.color,
                material: currentVariant.material,
            } as any : 'N/A',
        });
        router.push("/cart");
    };

    // Generate variant display label
    const getVariantLabel = (variant: any, index: number) => {
        const parts = [];
        if (variant.color) parts.push(variant.color);
        if (variant.material) parts.push(variant.material);
        if (variant.sku) parts.push(`SKU: ${variant.sku}`);
        return parts.length > 0 ? parts.join(' - ') : `Variant ${index + 1}`;
    };

    const { data } = useQuery({
        queryKey: ['systemSettings'],
        queryFn: systemSettingsApi.getSettings
    })

    const settings = data?.settings || data?.data?.settings;
    const shippingInfo = (settings as SystemSetting[] | undefined)?.find(s => s.key === "SHIPPING_INFO");
    const shippingInfoDescription: ShippingSettingsDescription | undefined =
        shippingInfo && typeof shippingInfo.description === 'string'
            ? JSON.parse(shippingInfo.description)
            : undefined;

    return (
        <div className="space-y-6 min-h-screen">
            {/* Category */}
            <div className="text-sm text-muted-foreground">{typeof product.category === "string" ? product.category : product.category.name}</div>

            {/* Product Name */}
            <h1 className="text-3xl font-bold">{product.name}</h1>

            {/* Price */}
            <div className="text-2xl font-bold">${currentPrice.toFixed(2)}</div>

            {/* Delivery Info */}
            {shippingInfo?.value && (
                <div className="flex items-center gap-2 text-sm">
                    <Calendar className="w-4 h-4" />
                    <span>
                        Order in <span className="font-semibold">{shippingInfo.value}</span> to get next day delivery
                    </span>
                </div>
            )}

            {/* Size Selector */}
            {availableSizes && availableSizes.length > 0 && (
                <SizeSelector
                    sizes={availableSizes as string[]}
                    selectedSize={selectedSize}
                    onSizeChange={setSelectedSize}
                />
            )}

            {/* Variant Selector (when no sizes) */}
            {hasVariantsWithoutSizes && product.variants && (
                <div className="space-y-2">
                    <label className="text-sm font-medium">Select Variant</label>
                    <select
                        value={selectedVariantIndex}
                        onChange={(e) => setSelectedVariantIndex(Number(e.target.value))}
                        className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-black"
                    >
                        {product.variants.map((variant, index) => (
                            <option key={variant.sku} value={index}>
                                {getVariantLabel(variant, index)} - ${variant.price.toFixed(2)}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Stock Status */}
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>
                    {currentStock && currentStock > 0
                        ? `In stock (${currentStock} available)`
                        : "Out of stock (can be backordered)"}
                </span>
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
                <AnimatePresence>
                    {descriptionOpen && (
                        <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: "auto" }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-hidden">
                            <div className="py-3 text-sm text-muted-foreground leading-relaxed">
                                {product.description || product.shortDescription || "No description available."}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Shipping */}
            {shippingInfoDescription && (
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
                    <AnimatePresence>
                        {shippingOpen && (
                            <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden">
                                <div className="py-3 space-y-4">
                                    {/* Shipping Methods */}
                                    {shippingInfoDescription.methods?.filter(m => m.active).map((method) => {
                                        const freeOverRule = method.costRules?.find(r => r.type === "FREE_OVER");
                                        const flatRateRule = method.costRules?.find(r => r.type === "FLAT_RATE");

                                        return (
                                            <div key={method.code} className="space-y-3">
                                                <div className="flex items-center gap-2">
                                                    <Truck className="w-4 h-4" />
                                                    <span className="font-medium">{method.label}</span>
                                                </div>
                                                <p className="text-sm text-muted-foreground">{method.description}</p>

                                                <div className="grid grid-cols-2 gap-4">
                                                    {/* Free Shipping Info */}
                                                    {freeOverRule && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                                                <Package className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium">Free Shipping</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    Orders over {freeOverRule.currency}{freeOverRule.value}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Flat Rate */}
                                                    {flatRateRule && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                                                <Box className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium">Shipping Cost</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {flatRateRule.currency}{flatRateRule.value}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {/* Delivery Time */}
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                                            <Calendar className="w-5 h-5 text-white" />
                                                        </div>
                                                        <div>
                                                            <div className="text-sm font-medium">Delivery Time</div>
                                                            <div className="text-sm text-muted-foreground">
                                                                {method.deliveryTimeInDays.min}-{method.deliveryTimeInDays.max} business days
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Handling Time */}
                                                    {shippingInfoDescription.general?.handlingTimeInDays && (
                                                        <div className="flex items-start gap-3">
                                                            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center shrink-0">
                                                                <Truck className="w-5 h-5 text-white" />
                                                            </div>
                                                            <div>
                                                                <div className="text-sm font-medium">Processing Time</div>
                                                                <div className="text-sm text-muted-foreground">
                                                                    {shippingInfoDescription.general.handlingTimeInDays[0]}-{shippingInfoDescription.general.handlingTimeInDays[1]} business days
                                                                </div>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Business Days */}
                                    {shippingInfoDescription.general?.shippingBusinessDays && (
                                        <div className="text-xs text-muted-foreground pt-2 border-t">
                                            Ships on: {shippingInfoDescription.general.shippingBusinessDays.join(", ")}
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
}

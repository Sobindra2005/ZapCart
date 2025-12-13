"use client";

import { Minus, Plus, Trash2 } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { CartItem as CartItemType } from "@/contexts/CartContext";

interface CartItemProps {
    item: CartItemType;
    onUpdateQuantity: (id: string, quantity: number) => void;
    onRemove: (id: string) => void;
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
    const handleDecrement = () => {
        onUpdateQuantity(item.id, item.quantity - 1);
    };

    const handleIncrement = () => {
        onUpdateQuantity(item.id, item.quantity + 1);
    };

    return (
        <div className="flex items-center gap-4 py-6 border-b">
            {/* Product Image */}
            <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-100 shrink-0">
                <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-base mb-1 truncate">{item.name}</h3>
                {item.size && (
                    <p className="text-sm text-muted-foreground">Size: {item.size}</p>
                )}
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center border rounded-full overflow-hidden">
                <button
                    onClick={handleDecrement}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Decrease quantity"
                >
                    <Minus className="w-4 h-4" />
                </button>
                <div className="w-10 h-8 flex items-center justify-center border-x text-sm">
                    {item.quantity}
                </div>
                <button
                    onClick={handleIncrement}
                    className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 transition-colors"
                    aria-label="Increase quantity"
                >
                    <Plus className="w-4 h-4" />
                </button>
            </div>

            {/* Delete Button */}
            <Button
                variant="outline"
                size="icon"
                className="rounded-lg"
                onClick={() => onRemove(item.id)}
            >
                <Trash2 className="w-4 h-4" />
            </Button>

            {/* Price */}
            <div className="font-semibold text-base w-24 text-right">
                ${(item.price * item.quantity).toFixed(2)}
            </div>
        </div>
    );
}

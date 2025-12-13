"use client";

import { ArrowLeft, ShoppingCart, ShoppingBag, Receipt } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/contexts/CartContext";
import { CartItem } from "@/components/CartItem";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@/components/ui/button";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, getSubtotal } = useCart();

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Progress Steps */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                        {/* Cart Step */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center">
                                <ShoppingCart className="w-5 h-5 text-white" />
                            </div>
                            <span className="font-semibold hidden sm:inline">Cart</span>
                        </div>

                        {/* Divider */}
                        <div className="flex-1 h-px bg-gray-300 border-t-2 border-dashed max-w-[100px]" />

                        {/* Checkout Step */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                <ShoppingBag className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-400 hidden sm:inline">Checkout</span>
                        </div>

                        {/* Divider */}
                        <div className="flex-1 h-px bg-gray-300 border-t-2 border-dashed max-w-[100px]" />

                        {/* Order Step */}
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                                <Receipt className="w-5 h-5 text-gray-600" />
                            </div>
                            <span className="font-medium text-gray-400 hidden sm:inline">Order</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container  mx-auto px-4 py-8">
                {items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20 ">
                        <ShoppingCart className="w-20 h-20 text-gray-400 mb-6" />
                        <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
                        <p className="text-gray-600 mb-8 text-center">
                            Looks like you haven’t added anything to your cart yet. Start exploring our products!
                        </p>
                       
                    </div>
                ) : (
                    <div className="flex gap-8 ">
                        {/* Cart Items */}
                        <div className="bg-white rounded-lg p-6 w-full">
                            <div className="flex items-center justify-between mb-6">
                                <h1 className="text-2xl font-bold">Product</h1>
                                <span className="text-xl font-bold">Total</span>
                            </div>

                            <div className="space-y-0">
                                {items.map((item) => (
                                    <CartItem
                                        key={item.id}
                                        item={item}
                                        onUpdateQuantity={updateQuantity}
                                        onRemove={removeFromCart}
                                    />
                                ))}
                            </div>
                        </div>
                        <OrderSummary subtotal={getSubtotal()} />
                    </div>
                )}
            </div>
        </div>
    );
}

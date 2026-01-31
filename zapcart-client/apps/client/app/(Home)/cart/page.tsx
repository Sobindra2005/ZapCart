"use client";

import { useState } from "react";
import { ShoppingCart, ShoppingBag, Receipt } from "lucide-react";
import Link from "next/link";
import { useCart, CartItem as CartItemType } from "@/contexts/CartContext";
import { CartItem } from "@/components/CartItem";
import { OrderSummary } from "@/components/OrderSummary";
import { Button } from "@repo/ui/ui/button";
import { CheckoutForm } from "@/components/CheckoutForm";
import { OrderConfirmation } from "@/components/OrderConfirmation";
import { orderApi } from "@/utils/api";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { AxiosError } from "axios";

export default function CartPage() {
    const { items, updateQuantity, removeFromCart, getSubtotal, clearCart } = useCart();
    const [step, setStep] = useState<"cart" | "checkout" | "order">("cart");

    const createOrderMutation = useMutation({
            mutationFn: async ({ details, addressIds }: { details: { paymentMethod: string }; addressIds: { billingAddressId: string | undefined; shippingAddressId: string | undefined } }) => {
                const orderItems = items.map((item) => ({
                    productId: item.id,
                    sku: item.variant?.sku || "",
                    quantity: item.quantity,
                    unitPrice: item.price,
                    //individual item level discount, not cart level discount
                    discount: 0,
                }));
                
                //will use this data from the system
                const shippingCost = 100;
                const tax = 13;
                //this is a coupon discount placeholder
                const discount = 0;

                return orderApi.createOrder({
                    shippingAddressId: parseInt(addressIds.shippingAddressId || "0"),
                    billingAddressId: parseInt(addressIds.billingAddressId || "0"),
                    items: orderItems,
                    shippingCost,
                    tax,
                    discount,
                    paymentMethod: details.paymentMethod,
                });
            },
            onSuccess: () => {
                toast.success("Order placed successfully!");
                clearCart();
                setStep("order");
                window.scrollTo({ top: 0, behavior: "smooth" });
            },
            onError: (error:AxiosError) => {
                console.error("Order creation failed:", error);
                const errorMessage = (error?.response?.data as { message?: string })?.message || "Failed to place order. Please try again.";
                toast.error(errorMessage);
            },
        });

    const handleCheckout = () => {
        setStep("checkout");
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handlePlaceOrder = (details: { paymentMethod: string }, addressIds: { billingAddressId: string | undefined; shippingAddressId: string | undefined }) => {
        createOrderMutation.mutate({ details, addressIds });
    };

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Progress Steps */}
            <div className="bg-white border-b">
                <div className="container mx-auto px-4 py-6">
                    <div className="flex items-center justify-center gap-4 max-w-2xl mx-auto">
                        {/* Cart Step */}
                        <div className={`flex items-center gap-3 ${step === 'cart' ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step === 'cart' || step === 'checkout' || step === 'order' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                                <ShoppingCart className="w-5 h-5" />
                            </div>
                            <span className="font-semibold hidden sm:inline">Cart</span>
                        </div>

                        {/* Divider */}
                        <div className={`flex-1 h-px border-t-2 border-dashed max-w-25 ${step === 'checkout' || step === 'order' ? 'border-black' : 'border-gray-300'}`} />

                        {/* Checkout Step */}
                        <div className={`flex items-center gap-3 ${step === 'checkout' ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step === 'checkout' || step === 'order' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                                <ShoppingBag className="w-5 h-5" />
                            </div>
                            <span className="font-medium hidden sm:inline">Checkout</span>
                        </div>

                        {/* Divider */}
                        <div className={`flex-1 h-px border-t-2 border-dashed max-w-25 ${step === 'order' ? 'border-black' : 'border-gray-300'}`} />

                        {/* Order Step */}
                        <div className={`flex items-center gap-3 ${step === 'order' ? 'opacity-100' : 'opacity-50'}`}>
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center ${step === 'order' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                                <Receipt className="w-5 h-5" />
                            </div>
                            <span className="font-medium hidden sm:inline">Order</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="container mx-auto px-4 py-8">
                {step === 'cart' && (
                    items.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <ShoppingCart className="w-20 h-20 text-gray-400 mb-6" />
                            <h2 className="text-3xl font-semibold text-gray-800 mb-4">Your cart is empty</h2>
                            <p className="text-gray-600 mb-8 text-center">
                                Looks like you haven’t added anything to your cart yet. Start exploring our products!
                            </p>
                            <Link href="/">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="flex flex-col lg:flex-row gap-8">
                            {/* Cart Items */}
                            <div className="bg-white rounded-lg p-6 w-full lg:w-2/3">
                                <div className="flex items-center justify-between mb-6">
                                    <h1 className="text-2xl font-bold">Shopping Cart ({items.length} items)</h1>
                                </div>

                                <div className="divide-y">
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
                            <div className="w-full lg:w-1/3">
                                <OrderSummary subtotal={getSubtotal()} onCheckout={handleCheckout} />
                            </div>
                        </div>
                    )
                )}

                {step === 'checkout' && (
                    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                        <div className="w-full lg:w-2/3">
                            <CheckoutForm onPlaceOrder={handlePlaceOrder} onBack={() => setStep('cart')} />
                        </div>
                        <div className="w-full lg:w-1/3">
                            {/* Read-only summary or simplified version could go here */}
                            <OrderSummary subtotal={getSubtotal()} />
                        </div>
                    </div>
                )}

                {step === 'order' && (
                    <OrderConfirmation />
                )}
            </div>
        </div>
    );
}

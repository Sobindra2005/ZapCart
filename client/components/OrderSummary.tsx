"use client";

import { useState } from "react";
import { ArrowRight, Minus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

interface OrderSummaryProps {
    subtotal: number;
    vatRate?: number;
}

export function OrderSummary({ subtotal, vatRate = 0.05 }: OrderSummaryProps) {
    const [couponCode, setCouponCode] = useState("");
    const [showCouponInput, setShowCouponInput] = useState(false);
    
    const vat = subtotal * vatRate;
    const total = subtotal + vat;

    const handleApplyCoupon = () => {
        // Add coupon logic here
        console.log("Applying coupon:", couponCode);
    };

    return (
        <Card className="p-6 bg-blue-900 text-white h-fit sticky top-4 rounded-md">
            <h2 className="text-2xl font-bold mb-6">Order Summary</h2>

            {/* Subtotal */}
            <div className="flex justify-between mb-4">
                <span className="text-blue-100">Subtotal</span>
                <span className="font-semibold">${subtotal.toFixed(2)}</span>
            </div>

            {/* VAT */}
            <div className="flex justify-between mb-6">
                <span className="text-blue-100">V.A.T</span>
                <span className="font-semibold">${vat.toFixed(2)}</span>
            </div>

            {/* Coupon Section */}
            <div className="mb-6">
                <button
                    onClick={() => setShowCouponInput(!showCouponInput)}
                    className="flex items-center justify-between w-full py-3 border-t border-b border-blue-700"
                >
                    <span className="font-medium">Add a coupon</span>
                    <Minus className={`w-5 h-5 transition-transform ${showCouponInput ? 'rotate-0' : 'rotate-90'}`} />
                </button>
                
                {showCouponInput && (
                    <div className="mt-4 flex gap-2">
                        <Input
                            type="text"
                            placeholder="Enter your code"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            className="bg-blue-800 border-blue-700 text-white placeholder:text-blue-300 focus-visible:ring-blue-500"
                        />
                        <Button
                            onClick={handleApplyCoupon}
                            className="bg-blue-700 hover:bg-blue-600 shrink-0"
                        >
                            <ArrowRight className="w-4 h-4" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Total */}
            <div className="flex justify-between mb-6 pt-4 border-t border-blue-700">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-xl font-bold">${total.toFixed(2)}</span>
            </div>

            {/* Checkout Button */}
            <Button 
                className="w-full h-12 rounded-full bg-yellow-400 text-black font-semibold hover:bg-yellow-500"
                size="lg"
            >
                Proceed to checkout
            </Button>
        </Card>
    );
}

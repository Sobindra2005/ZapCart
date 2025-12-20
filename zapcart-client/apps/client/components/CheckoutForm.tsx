"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { motion } from "framer-motion";

interface OrderDetails {
    paymentMethod: string;
}

interface CheckoutFormProps {
    onPlaceOrder: (details: OrderDetails) => void;
    onBack: () => void;
}

export function CheckoutForm({ onPlaceOrder, onBack }: CheckoutFormProps) {
    const [paymentMethod, setPaymentMethod] = useState("card");

    // Using simple form handling for now, can be upgraded to zod/react-hook-form later if needed
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Simulate processing
        setTimeout(() => {
            onPlaceOrder({ paymentMethod });
        }, 1000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-lg p-6 shadow-sm"
        >
            <h2 className="text-2xl font-bold mb-6">Checkout Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Shipping Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="firstName">First Name</Label>
                            <Input id="firstName" required placeholder="John" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input id="lastName" required placeholder="Doe" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" required placeholder="john@example.com" />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input id="address" required placeholder="123 Main St" />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="city">City</Label>
                            <Input id="city" required placeholder="New York" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="zip">ZIP Code</Label>
                            <Input id="zip" required placeholder="10001" />
                        </div>
                    </div>
                </div>

                <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Payment Method</h3>
                    <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod} className="flex flex-col space-y-2">
                        <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                            <RadioGroupItem value="card" id="card" />
                            <Label htmlFor="card" className="flex-1 cursor-pointer">Credit Card</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                            <RadioGroupItem value="paypal" id="paypal" />
                            <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                        </div>
                        <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                            <RadioGroupItem value="cod" id="cod" />
                            <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                        </div>
                    </RadioGroup>
                </div>

                <div className="flex gap-4 pt-4">
                    <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                        Back to Cart
                    </Button>
                    <Button type="submit" className="flex-1 bg-black text-white hover:bg-gray-800">
                        Place Order
                    </Button>
                </div>
            </form>
        </motion.div>
    );
}

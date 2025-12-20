"use client";

import { motion } from "framer-motion";
import { CheckCircle, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function OrderConfirmation() {
    return (
        <div className="flex flex-col items-center justify-center py-12 text-center">
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                    type: "spring",
                    stiffness: 260,
                    damping: 20
                }}
                className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6"
            >
                <CheckCircle className="w-10 h-10 text-green-600" />
            </motion.div>

            <motion.h1
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="text-3xl font-bold text-gray-900 mb-4"
            >
                Order Confirmed!
            </motion.h1>

            <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-gray-500 max-w-md mb-8"
            >
                Thank you for your purchase. We have received your order and will send you a confirmation email shortly.
            </motion.p>

            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
            >
                <Link href="/">
                    <Button size="lg" className="gap-2">
                        <ShoppingBag className="w-4 h-4" />
                        Continue Shopping
                    </Button>
                </Link>
            </motion.div>
        </div>
    );
}

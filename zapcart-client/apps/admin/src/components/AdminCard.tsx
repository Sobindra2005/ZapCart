import React from "react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface AdminCardProps {
    children: React.ReactNode;
    className?: string;
    noPadding?: boolean;
    hoverable?: boolean;
}

export function AdminCard({
    children,
    className,
    noPadding = false,
    hoverable = false,
}: AdminCardProps) {
    return (
        <motion.div
            layout
            transition={{
                layout: {
                    duration: 0.3,
                    ease: [0.4, 0, 0.2, 1], // easeInOut cubic bezier
                },
            }}
            className={cn(
                "bg-white rounded-2xl border border-gray-100 shadow-sm transition-shadow",
                !noPadding && "p-6",
                hoverable && "hover:shadow-md",
                className
            )}
        >
           
                {children}
           
        </motion.div>
    );
}
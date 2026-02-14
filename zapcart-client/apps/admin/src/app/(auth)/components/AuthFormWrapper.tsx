"use client";

import { motion, AnimatePresence } from "motion/react";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";

interface AuthFormWrapperProps {
    children: ReactNode;
}

export function AuthFormWrapper({ children }: AuthFormWrapperProps) {
    const pathname = usePathname();

    return (
        <AnimatePresence mode="wait">
            <motion.div
                key={pathname}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{
                    duration: 0.4,
                    ease: [0.4, 0, 0.2, 1],
                }}
            >
                {children}
            </motion.div>
        </AnimatePresence>
    );
}

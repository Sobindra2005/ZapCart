"use client";

import { motion } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";

type AuthMode = "login" | "signup";

export function AuthToggle() {
    const pathname = usePathname();
    const router = useRouter();

    // Determine current mode from pathname
    const currentMode: AuthMode = pathname?.includes("signup") ? "signup" : "login";

    // Local state for animation - syncs with route
    const [animatedMode, setAnimatedMode] = useState<AuthMode>(currentMode);

    // Sync animated state with route changes
    useEffect(() => {
        setAnimatedMode(currentMode);
    }, [currentMode]);

    const handleToggle = (mode: AuthMode) => {
        if (mode === currentMode) return;

        setAnimatedMode(mode);

        setTimeout(() => {
            router.push(mode === "login" ? "/login" : "/signup");
        }, 100);
    };

    return (
        <div className="bg-muted/50 p-1 rounded-lg grid grid-cols-2 gap-1 relative">
            <motion.div
                className="absolute top-1 bottom-1 bg-background rounded-md shadow-sm"
                initial={false}
                animate={{
                    left: animatedMode === "login" ? "4px" : "calc(50% + 2px)",
                    width: "calc(50% - 6px)",
                }}
                transition={{
                    duration: 0.35,
                    ease: [0.34, 1.56, 0.64, 1], 
                }}
            />
            <button
                type="button"
                onClick={() => handleToggle("login")}
                className="relative flex items-center justify-center py-2 px-4 transition-colors z-10"
            >
                <motion.span
                    className="text-sm"
                    animate={{
                        fontWeight: animatedMode === "login" ? 600 : 500,
                        color: animatedMode === "login" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    }}
                    transition={{ duration: 0.2 }}
                >
                    Sign In
                </motion.span>
            </button>

            {/* Signup Button */}
            <button
                type="button"
                onClick={() => handleToggle("signup")}
                className="relative flex items-center justify-center py-2 px-4 transition-colors z-10"
            >
                <motion.span
                    className="text-sm"
                    animate={{
                        fontWeight: animatedMode === "signup" ? 600 : 500,
                        color: animatedMode === "signup" ? "hsl(var(--foreground))" : "hsl(var(--muted-foreground))",
                    }}
                    transition={{ duration: 0.2 }}
                >
                    Signup
                </motion.span>
            </button>
        </div>
    );
}

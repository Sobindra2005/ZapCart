/**
 * ErrorState Component
 * 
 * A reusable error state component for displaying when data fetching fails.
 * Includes optional retry functionality and follows modern SaaS dashboard design.
 */

import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, RefreshCcw, WifiOff, ServerCrash, LucideIcon } from "lucide-react";
import { Button } from "@repo/ui/ui/button";

export type ErrorStateVariant = "network" | "server" | "default";

interface ErrorStateProps {
    variant?: ErrorStateVariant;
    title?: string;
    description?: string;
    icon?: LucideIcon;
    className?: string;
    onRetry?: () => void;
    retryLabel?: string;
    error?: Error | null;
}

const variantConfig: Record<ErrorStateVariant, { icon: LucideIcon; title: string; description: string }> = {
    network: {
        icon: WifiOff,
        title: "Connection failed",
        description: "Please check your internet connection and try again.",
    },
    server: {
        icon: ServerCrash,
        title: "Server error",
        description: "Something went wrong on our end. Please try again later.",
    },
    default: {
        icon: AlertCircle,
        title: "Failed to load data",
        description: "An unexpected error occurred. Please try again.",
    },
};

export function ErrorState({
    variant = "default",
    title,
    description,
    icon: CustomIcon,
    className,
    onRetry,
    retryLabel = "Try again",
    error,
}: ErrorStateProps) {
    const config = variantConfig[variant];
    const Icon = CustomIcon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || (error?.message ? error.message : config.description);

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-12 px-4",
                "text-center",
                className
            )}
        >
            <div className="rounded-full bg-red-50 p-4 mb-4">
                <Icon className="h-8 w-8 text-red-400" strokeWidth={1.5} />
            </div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
                {displayTitle}
            </h3>
            <p className="text-xs text-gray-500 max-w-55 mb-4">
                {displayDescription}
            </p>
            {onRetry && (
                <Button
                    variant="outline"
                    size="sm"
                    onClick={onRetry}
                    className="text-xs font-medium"
                >
                    <RefreshCcw className="h-3 w-3 mr-1.5" />
                    {retryLabel}
                </Button>
            )}
        </div>
    );
}

/**
 * Compact version for smaller containers
 */
export function ErrorStateCompact({
    variant = "default",
    title,
    description,
    icon: CustomIcon,
    className,
    onRetry,
}: Omit<ErrorStateProps, "retryLabel" | "error">) {
    const config = variantConfig[variant];
    const Icon = CustomIcon || config.icon;
    const displayTitle = title || config.title;
    const displayDescription = description || config.description;

    return (
        <div
            className={cn(
                "flex flex-col items-center justify-center py-8 px-4",
                "text-center",
                className
            )}
        >
            <div className="rounded-full bg-red-50 p-3 mb-3">
                <Icon className="h-5 w-5 text-red-400" strokeWidth={1.5} />
            </div>
            <p className="text-xs font-medium text-gray-600">
                {displayTitle}
            </p>
            <p className="text-[10px] text-gray-400 mt-0.5 max-w-45">
                {displayDescription}
            </p>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="mt-3 text-[10px] font-medium text-primary hover:text-primary/80 flex items-center gap-1 transition-colors"
                >
                    <RefreshCcw className="h-3 w-3" />
                    Retry
                </button>
            )}
        </div>
    );
}

/**
 * Inline error for minimal intrusion
 */
export function ErrorStateInline({
    message = "Failed to load",
    onRetry,
    className,
}: {
    message?: string;
    onRetry?: () => void;
    className?: string;
}) {
    return (
        <div className={cn("flex items-center justify-center gap-2 py-4 text-xs text-gray-500", className)}>
            <AlertCircle className="h-4 w-4 text-red-400" />
            <span>{message}</span>
            {onRetry && (
                <button
                    onClick={onRetry}
                    className="text-primary hover:text-primary/80 font-medium flex items-center gap-1 transition-colors"
                >
                    <RefreshCcw className="h-3 w-3" />
                    Retry
                </button>
            )}
        </div>
    );
}

/**
 * DataStateHandler Component
 * 
 * A reusable wrapper component that handles loading, error, and empty states
 * in a consistent and clean manner. Reduces boilerplate in data-driven components.
 * 
 * Usage:
 * ```tsx
 * <DataStateHandler
 *   isLoading={isLoading}
 *   isError={isError}
 *   isEmpty={data?.length === 0}
 *   loadingComponent={<MySkeleton />}
 *   errorComponent={<ErrorState onRetry={refetch} />}
 *   emptyComponent={<EmptyState variant="products" />}
 * >
 *   <MyActualContent data={data} />
 * </DataStateHandler>
 * ```
 */

import * as React from "react";
import { cn } from "@/lib/utils";

interface DataStateHandlerProps {
    /** Whether data is currently loading */
    isLoading?: boolean;
    /** Whether an error occurred during data fetching */
    isError?: boolean;
    /** Whether the data is empty (after successful fetch) */
    isEmpty?: boolean;
    /** Component to show during loading state */
    loadingComponent?: React.ReactNode;
    /** Component to show when an error occurs */
    errorComponent?: React.ReactNode;
    /** Component to show when data is empty */
    emptyComponent?: React.ReactNode;
    /** The actual content to render when data is available */
    children: React.ReactNode;
    /** Additional className for the wrapper */
    className?: string;
    /** Minimum height to prevent layout shift */
    minHeight?: string | number;
}

export function DataStateHandler({
    isLoading = false,
    isError = false,
    isEmpty = false,
    loadingComponent,
    errorComponent,
    emptyComponent,
    children,
    className,
    minHeight,
}: DataStateHandlerProps) {
    const style = minHeight ? { minHeight } : undefined;

    // Priority: Loading > Error > Empty > Content
    if (isLoading && loadingComponent) {
        return (
            <div className={cn("w-full", className)} style={style}>
                {loadingComponent}
            </div>
        );
    }

    if (isError && errorComponent) {
        return (
            <div className={cn("w-full", className)} style={style}>
                {errorComponent}
            </div>
        );
    }

    if (isEmpty && emptyComponent) {
        return (
            <div className={cn("w-full", className)} style={style}>
                {emptyComponent}
            </div>
        );
    }

    return <>{children}</>;
}

/**
 * Hook for managing data state
 * Provides a clean API for determining component state
 */
export function useDataState<T>({
    data,
    isLoading,
    isError,
    checkEmpty,
}: {
    data: T | undefined;
    isLoading: boolean;
    isError: boolean;
    checkEmpty?: (data: T) => boolean;
}) {
    const isEmpty = React.useMemo(() => {
        if (!data) return false;
        if (checkEmpty) return checkEmpty(data);
        if (Array.isArray(data)) return data.length === 0;
        return false;
    }, [data, checkEmpty]);

    return {
        isLoading,
        isError,
        isEmpty,
        hasData: !isLoading && !isError && !isEmpty && !!data,
    };
}

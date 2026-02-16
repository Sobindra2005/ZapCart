import React from "react";
import { cn } from "@repo/lib/utils";
import { StatCard} from "./StatCard";

/**
 * @deprecated Use StatCardProps instead
 */
export interface Stat {
    label: string;
    value: string | number;
    trend: string;
    trendDir: "up" | "down";
    vs: string;
}

interface StatsCardsProps {
    /**
     * Array of stat objects to render as cards
     */
    stats: Stat[];
    
    /**
     * Optional CSS classes for the grid container
     * @default "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
     */
    className?: string;
    
    /**
     * Callback when a stat card's more button is clicked
     */
    onStatMoreClick?: (stat: Stat, index: number) => void;
}

/**
 * StatsCards - Convenience wrapper that renders multiple StatCard components in a grid
 * 
 * This is a convenience component for rendering multiple KPI cards at once.
 * For more control, you can map over your stats array and render StatCard components directly.
 * 
 * @example
 * ```tsx
 * // Using the wrapper
 * <StatsCards stats={stats} />
 * 
 * // Or render individually for more control
 * <div className="grid grid-cols-4 gap-6">
 *   {stats.map((stat) => (
 *     <StatCard key={stat.label} {...stat} />
 *   ))}
 * </div>
 * ```
 */
export const StatsCards: React.FC<StatsCardsProps> = ({ 
    stats, 
    className,
    onStatMoreClick 
}) => {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
            {stats.map((stat, i) => (
                <StatCard
                    key={`stat-${i}-${stat.label}`}
                    label={stat.label}
                    value={stat.value}
                    trend={stat.trend}
                    trendDir={stat.trendDir}
                    vs={stat.vs}
                    onMoreClick={() => onStatMoreClick?.(stat, i)}
                />
            ))}
        </div>
    );
};

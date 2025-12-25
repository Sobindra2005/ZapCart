import React from "react";
import { MoreHorizontal, TrendingUp, TrendingDown } from "lucide-react";
import { AdminCard } from "../AdminCard";
import { cn } from "@repo/lib/utils";


export interface Stat {
    label: string;
    value: string | number;
    trend: string;
    trendDir: "up" | "down";
    vs: string;
}

interface StatsCardsProps {
    stats: Stat[];
    className?: string;
}

export const StatsCards: React.FC<StatsCardsProps> = ({ stats ,className }) => {
    return (
        <div className={cn("grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6", className)}>
            {stats.map((stat, i) => (
                <AdminCard key={i} hoverable className="group">
                    <div className="flex justify-between items-start mb-4">
                        <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                        <button className="text-gray-400 hover:text-gray-600 transition-colors">
                            <MoreHorizontal className="h-5 w-5" />
                        </button>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-4">{stat.value}</h3>
                    <div className="flex items-center gap-2">
                        <div
                            className={cn(
                                "flex items-center gap-1 px-1.5 py-0.5 rounded-md text-xs font-bold font-sans",
                                stat.trendDir === "up" ? "bg-green-50 text-green-600" : "bg-red-50 text-red-600"
                            )}
                        >
                            {stat.trendDir === "up" ? (
                                <TrendingUp className="h-3 w-3" />
                            ) : (
                                <TrendingDown className="h-3 w-3" />
                            )}
                            {stat.trend}
                        </div>
                        <span className="text-xs font-medium text-gray-400">{stat.vs}</span>
                    </div>
                </AdminCard>
            ))}
        </div>
    );
};

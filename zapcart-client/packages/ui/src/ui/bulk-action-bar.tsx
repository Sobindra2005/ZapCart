"use client";

import * as React from "react";
import { Button } from "./button";
import { cn } from "@repo/lib/utils";

export interface BulkAction {
    icon?: React.ElementType;
    label: string;
    onClick: () => void;
    variant?: "ghost" | "default" | "destructive" | "outline" | "secondary" | "link";
    className?: string;
}

interface BulkActionBarProps {
    selectedCount: number;
    onDeselectAll: () => void;
    label?: string;
    actions: BulkAction[];
    className?: string;
}

export function BulkActionBar({
    selectedCount,
    onDeselectAll,
    label = "Items Selected",
    actions,
    className,
}: BulkActionBarProps) {
    console.log("BulkActionBar Rendering, count:", selectedCount);
    if (selectedCount === 0) return null;

    return (
        <div
            className={cn(
                "fixed bottom-8 left-1/2 -translate-x-1/2 bg-white text-black px-6 py-4 rounded-2xl shadow-xl flex items-center gap-8",
                className
            )}
            style={{ position: 'fixed', bottom: '2rem', left: '50%', transform: '', zIndex: 9999, display: 'flex' }}
        >
            <div className="flex items-center gap-3  pr-8">
                <div className="bg-primary text-white h-6 w-6 rounded-full flex items-center justify-center text-xs font-bold">
                    {selectedCount}
                </div>
                <span className="text-sm font-bold tracking-wide">{label}</span>
            </div>

            <div className="flex items-center gap-2 font-bold">
                {actions.map((action, index) => (
                    <Button
                        key={index}
                        variant={action.variant || "ghost"}
                        size="sm"
                        className={cn(
                            "text-black hover:bg-black/10 gap-2 h-9 px-4",
                            action.variant === "destructive" && "text-red-500 hover:bg-red-500/10",
                            action.className
                        )}
                        onClick={action.onClick}
                    >
                        {action.icon && <action.icon className="h-4 w-4" />}
                        {action.label}
                    </Button>
                ))}
            </div>

            <div className=" pl-8">
                <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-400 hover:text-white hover:bg-transparent px-0 font-bold"
                    onClick={onDeselectAll}
                >
                    Deselect all
                </Button>
            </div>
        </div>
    );
}

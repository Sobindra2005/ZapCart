"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface SizeSelectorProps {
    sizes: string[];
    selectedSize: string;
    onSizeChange: (size: string) => void;
}

export function SizeSelector({ sizes, selectedSize, onSizeChange }: SizeSelectorProps) {
    return (
        <div className="space-y-3">
            <label className="text-sm font-medium">Select Size</label>
            <div className="flex gap-2">
                {sizes.map((size) => (
                    <Button
                        key={size}
                        variant={selectedSize === size ? "default" : "outline"}
                        className={cn(
                            "min-w-[60px] h-11 rounded-full",
                            selectedSize === size
                                ? "bg-black text-white hover:bg-black/90"
                                : "hover:border-black"
                        )}
                        onClick={() => onSizeChange(size)}
                    >
                        {size}
                    </Button>
                ))}
            </div>
        </div>
    );
}

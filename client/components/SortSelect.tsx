"use client";

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";

export interface SortOption {
    value: string;
    label: string;
}

interface SortSelectProps {
    options: SortOption[];
    value?: string;
    onValueChange?: (value: string) => void;
    placeholder?: string;
    label?: string;
    className?: string;
}

export function SortSelect({
    options,
    value,
    onValueChange,
    placeholder = "Select option",
    label = "Sort by:",
    className,
}: SortSelectProps) {
    return (
        <div className={`flex items-center gap-2 ${className || ""}`}>
            {label && (
                <span className="text-sm text-muted-foreground whitespace-nowrap">
                    {label}
                </span>
            )}
            <Select value={value} onValueChange={onValueChange}>
                <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder={placeholder} />
                </SelectTrigger>
                <SelectContent>
                    {options.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                            {option.label}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>
        </div>
    );
}

// Pre-defined sort options for common use cases
export const productSortOptions: SortOption[] = [
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

export const offerSortOptions: SortOption[] = [
    { value: "discount", label: "Biggest Discount" },
    { value: "popular", label: "Most Popular" },
    { value: "newest", label: "Newest" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

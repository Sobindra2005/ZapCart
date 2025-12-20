"use client";

import { useState } from "react";
import { Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { mockFilters } from "@/data/mockSearchData";

interface FilterState {
    brands: string[];
    categories: string[];
    minPrice: number | "";
    maxPrice: number | "";
    minRating: number | null;
    tags: string[];
}

interface FilterSidebarProps {
    onFilterChange: (filters: FilterState) => void;
    className?: string;
}

export function FilterSidebar({ onFilterChange, className }: FilterSidebarProps) {
    const [filters, setFilters] = useState<FilterState>({
        brands: [],
        categories: [],
        minPrice: "",
        maxPrice: "",
        minRating: null,
        tags: []
    });

    const handleFilterChange = (newFilters: FilterState) => {
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const toggleBrand = (brand: string) => {
        const newBrands = filters.brands.includes(brand)
            ? filters.brands.filter(b => b !== brand)
            : [...filters.brands, brand];
        handleFilterChange({ ...filters, brands: newBrands });
    };

    const toggleCategory = (category: string) => {
        const newCategories = filters.categories.includes(category)
            ? filters.categories.filter(c => c !== category)
            : [...filters.categories, category];
        handleFilterChange({ ...filters, categories: newCategories });
    };

    const toggleTag = (tag: string) => {
        const newTags = filters.tags.includes(tag)
            ? filters.tags.filter(t => t !== tag)
            : [...filters.tags, tag];
        handleFilterChange({ ...filters, tags: newTags });
    };

    const setPrice = (type: "min" | "max", value: string) => {
        const numValue = value === "" ? "" : Number(value);
        handleFilterChange({ ...filters, [type === "min" ? "minPrice" : "maxPrice"]: numValue });
    };

    const toggleRating = (rating: number) => {
        // If clicking the same rating, clear it (toggle off), otherwise set it
        const newRating = filters.minRating === rating ? null : rating;
        handleFilterChange({ ...filters, minRating: newRating });
    };

    const clearFilters = () => {
        const resetFilters: FilterState = {
            brands: [],
            categories: [],
            minPrice: "",
            maxPrice: "",
            minRating: null,
            tags: []
        };
        handleFilterChange(resetFilters);
    };

    return (
        <div className={cn("space-y-6 w-full max-w-xs", className)}>
            <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold">Filters</h2>
                <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearFilters}
                    className="text-muted-foreground hover:text-foreground h-auto p-0"
                >
                    Clear All
                </Button>
            </div>

            {/* Categories */}
            <div className="space-y-4">
                <h3 className="font-medium text-base">Categories</h3>
                <div className="space-y-2">
                    {mockFilters.categories.map((category) => (
                        <div key={category} className="flex items-center space-x-2">
                            <div
                                className={cn(
                                    "h-4 w-4 rounded border border-primary flex items-center justify-center cursor-pointer transition-colors",
                                    filters.categories.includes(category) ? "bg-primary text-primary-foreground" : "bg-transparent"
                                )}
                                onClick={() => toggleCategory(category)}
                            >
                                {filters.categories.includes(category) && <Check className="h-3 w-3" />}
                            </div>
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                onClick={() => toggleCategory(category)}
                            >
                                {category}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Price Range */}
            <div className="space-y-4">
                <h3 className="font-medium text-base">Price Range</h3>
                <div className="flex items-center gap-2">
                    <Input
                        type="number"
                        placeholder="Min"
                        value={filters.minPrice}
                        onChange={(e) => setPrice("min", e.target.value)}
                        className="w-full"
                        min={0}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                        type="number"
                        placeholder="Max"
                        value={filters.maxPrice}
                        onChange={(e) => setPrice("max", e.target.value)}
                        className="w-full"
                        min={0}
                    />
                </div>
            </div>

            {/* Brands */}
            <div className="space-y-4">
                <h3 className="font-medium text-base">Brands</h3>
                <div className="space-y-2">
                    {mockFilters.brands.map((brand) => (
                        <div key={brand} className="flex items-center space-x-2">
                            <div
                                className={cn(
                                    "h-4 w-4 rounded border border-primary flex items-center justify-center cursor-pointer transition-colors",
                                    filters.brands.includes(brand) ? "bg-primary text-primary-foreground" : "bg-transparent"
                                )}
                                onClick={() => toggleBrand(brand)}
                            >
                                {filters.brands.includes(brand) && <Check className="h-3 w-3" />}
                            </div>
                            <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                                onClick={() => toggleBrand(brand)}
                            >
                                {brand}
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Rating */}
            <div className="space-y-4">
                <h3 className="font-medium text-base">Rating</h3>
                <div className="space-y-2">
                    {mockFilters.ratings.map((rating) => (
                        <div
                            key={rating}
                            className={cn(
                                "flex items-center cursor-pointer rounded-md p-1.5 -ml-1.5 hover:bg-muted transition-colors",
                                filters.minRating === rating && "bg-muted font-medium"
                            )}
                            onClick={() => toggleRating(rating)}
                        >
                            <div className="flex items-center gap-1 mr-2">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={cn(
                                            "h-4 w-4",
                                            i < rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"
                                        )}
                                    />
                                ))}
                            </div>
                            <span className="text-sm text-foreground">& Up</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Tags */}
            <div className="space-y-4">
                <h3 className="font-medium text-base">Tags</h3>
                <div className="flex flex-wrap gap-2">
                    {mockFilters.tags.map((tag) => (
                        <div
                            key={tag}
                            className={cn(
                                "px-3 py-1 rounded-full text-xs border cursor-pointer transition-all hover:border-primary",
                                filters.tags.includes(tag)
                                    ? "bg-primary text-primary-foreground border-primary"
                                    : "bg-background text-foreground border-input"
                            )}
                            onClick={() => toggleTag(tag)}
                        >
                            {tag}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

"use client";

import { ChevronDown, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";

const filters = [
    { label: "Headphone Type", hasDropdown: true },
    { label: "Price", hasDropdown: true },
    { label: "Review", hasDropdown: true },
    { label: "Color", hasDropdown: true },
    { label: "Material", hasDropdown: true },
    { label: "Offer", hasDropdown: true },
];

export function FilterBar() {
    return (
        <div className="w-full border-b bg-white">
            <div className="container mx-auto px-4 md:px-6 py-4">
                <div className="flex items-center gap-3 overflow-x-auto">
                    {/* All Filters Button */}
                    <Button variant="outline" size="sm" className="flex items-center gap-2 shrink-0">
                        <SlidersHorizontal className="h-4 w-4" />
                        All Filters
                    </Button>

                    {/* Filter Chips */}
                    <div className="flex items-center gap-2 overflow-x-auto">
                        {filters.map((filter) => (
                            <Button
                                key={filter.label}
                                variant="outline"
                                size="sm"
                                className="flex items-center gap-1 shrink-0 hover:bg-gray-50"
                            >
                                {filter.label}
                                {filter.hasDropdown && <ChevronDown className="h-3 w-3" />}
                            </Button>
                        ))}
                    </div>

                    {/* Sort By */}
                    <div className="ml-auto flex items-center gap-2 shrink-0">
                        <Button variant="outline" size="sm" className="flex items-center gap-1">
                            Sort by
                            <ChevronDown className="h-3 w-3" />
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}

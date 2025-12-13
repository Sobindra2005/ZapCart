"use client";

import { useState, useMemo } from "react";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/data/mockSearchData";
import { Button } from "@/components/ui/button";
import { Filter, SlidersHorizontal } from "lucide-react";
// import { Sheet, SheetContent, SheetTrigger, SheetTitle } from "@/components/ui/sheet"; // Using Sheet if available, assume it might not be since not listed, but I'll try standard conditional rendering first to be safe as per my previous tool result which showed NO sheet.tsx

// Re-checking tool output: badge, button, card, carousel, input. Sheet is NOT there.
// So I will implement a custom mobile drawer using standard React/Tailwind variables.

export default function SearchPage() {
    const [filters, setFilters] = useState({
        brands: [] as string[],
        categories: [] as string[],
        minPrice: "" as number | "",
        maxPrice: "" as number | "",
        minRating: null as number | null,
        tags: [] as string[]
    });

    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        return mockProducts.filter(product => {
            // Brand Filter
            if (filters.brands.length > 0 && !filters.brands.includes(product.name.split(' ')[0])) { // Simple mock brand check (first word) or just ignore brand match for now since data doesn't have brand field explicitly? 
                // Wait, mock data didn't have brand field. I should update mock data or infer it. 
                // Let's infer brand from first word of name or add brand to mock data. 
                // Actually, mockProducts definition I wrote earlier, I just used `Product` interface. 
                // Let's assume for this mock data that Brand is checked against a hardcoded list or mapped.
                // For safer implementation with current data, I'll check if any brand string is part of the product name.
                const productBrand = filters.brands.find(brand => product.name.toLowerCase().includes(brand.toLowerCase()));
                if (!productBrand) return false;
            }

            // Category Filter
            if (filters.categories.length > 0 && !filters.categories.includes(product.category)) {
                return false;
            }

            // Price Filter
            if (filters.minPrice !== "" && product.price < filters.minPrice) return false;
            if (filters.maxPrice !== "" && product.price > filters.maxPrice) return false;

            // Rating Filter
            if (filters.minRating !== null && product.rating < filters.minRating) return false;

            // Tags Filter - simplified check (if product has tags)
            // My mock data interface didn't have tags in `Product` (it was optional/custom). 
            // I'll skip strict tag filtering if the field is missing on Product type, or cast it.
            // In Javascript/Typescript, I can just check if property exists.
            if (filters.tags.length > 0) {
                // @ts-ignore
                const productTags = product.tags as string[] | undefined;
                if (!productTags || !filters.tags.some(tag => productTags.includes(tag))) {
                    // For strict filtering: return false;
                    // But for demo if data is sparse, maybe lenient? No, sticky to logic.
                    // If product has no tags, and we actived tag filter, it should be hidden.
                    // Note: Only product 2 has tags in my mock data.
                    if (!productTags) return false;
                }
            }

            return true;
        });
    }, [filters]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row gap-8 relative">

                {/* Mobile Filter Button */}
                <div className="md:hidden mb-4 flex justify-between items-center">
                    <h1 className="text-2xl font-bold">Search Results</h1>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setIsMobileFiltersOpen(true)}
                        className="flex items-center gap-2"
                    >
                        <Filter className="h-4 w-4" />
                        Filters
                    </Button>
                </div>

                {/* Mobile Filter Overlay */}
                {isMobileFiltersOpen && (
                    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm md:hidden">
                        <div className="fixed inset-y-0 right-0 z-50 h-full w-3/4 bg-background border-l p-6 shadow-lg sm:max-w-sm overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-lg font-semibold">Filters</h2>
                                <Button variant="ghost" size="icon" onClick={() => setIsMobileFiltersOpen(false)}>
                                    <span className="text-xl">×</span>
                                </Button>
                            </div>
                            <FilterSidebar onFilterChange={setFilters} />
                            <div className="mt-6 pt-4 border-t">
                                <Button className="w-full" onClick={() => setIsMobileFiltersOpen(false)}>
                                    Show Results ({filteredProducts.length})
                                </Button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Desktop Sidebar */}
                <aside className="hidden md:block w-64 flex-shrink-0">
                    <div className="sticky top-20">
                        <FilterSidebar onFilterChange={setFilters} />
                    </div>
                </aside>

                {/* Main Content */}
                <main className="flex-1">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
                        <h1 className="text-3xl font-bold hidden md:block">Search Results</h1>
                        <p className="text-muted-foreground">
                            Showing {filteredProducts.length} results
                        </p>

                        {/* Sort Dropdown (Mock UI) */}
                        <div className="flex items-center gap-2 ml-auto">
                            <span className="text-sm text-muted-foreground whitespace-nowrap">Sort by:</span>
                            <select className="h-9 w-[180px] rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50">
                                <option value="popular">Most Popular</option>
                                <option value="newest">Newest</option>
                                <option value="price-asc">Price: Low to High</option>
                                <option value="price-desc">Price: High to Low</option>
                            </select>
                        </div>
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-muted/30 rounded-lg border border-dashed">
                            <div className="flex justify-center mb-4">
                                <SlidersHorizontal className="h-10 w-10 text-muted-foreground/50" />
                            </div>
                            <h3 className="text-lg font-medium">No results found</h3>
                            <p className="text-muted-foreground mt-1">Try adjusting your filters or search query.</p>
                            <Button
                                variant="link"
                                onClick={() => setFilters({ brands: [], categories: [], minPrice: "", maxPrice: "", minRating: null, tags: [] })}
                                className="mt-4"
                            >
                                Clear all filters
                            </Button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}

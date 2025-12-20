"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { FilterSidebar } from "@/components/search/FilterSidebar";
import { ProductCard } from "@/components/ProductCard";
import { mockProducts } from "@/data/mockSearchData";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";
import { SortSelect, productSortOptions } from "@/components/SortSelect";

export default function SearchPage() {
    const [filters, setFilters] = useState({
        brands: [] as string[],
        categories: [] as string[],
        minPrice: "" as number | "",
        maxPrice: "" as number | "",
        minRating: null as number | null,
        tags: [] as string[]
    });

    const [sortBy, setSortBy] = useState("popular");
    const [isMobileFiltersOpen, setIsMobileFiltersOpen] = useState(false);

    const filteredProducts = useMemo(() => {
        return mockProducts.filter(product => {
            // Brand Filter
            if (filters.brands.length > 0 && !filters.brands.includes(product.name.split(' ')[0])) {

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

            if (filters.tags.length > 0) {
                const productTags = product.tags as string[] | undefined;
                if (!productTags || !filters.tags.some(tag => productTags.includes(tag))) {

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
                <aside className="hidden md:block w-64 shrink-0">
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

                        {/* Sort Dropdown */}
                        <SortSelect
                            options={productSortOptions}
                            value={sortBy}
                            onValueChange={setSortBy}
                            className="ml-auto"
                        />
                    </div>

                    {/* Product Grid */}
                    {filteredProducts.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {filteredProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center py-16 text-center">
                            <div className="relative mb-6 h-48 w-48 sm:h-64 sm:w-64">
                                <Image
                                    src="/images/no-search-results.png"
                                    alt="No Results Found"
                                    fill
                                    className="object-contain"
                                />
                            </div>
                            <h3 className="text-xl font-semibold mb-2">No results found</h3>
                            <p className="text-muted-foreground mb-6 max-w-sm">
                                We couldn&apos;t find any products matching your search. Try checking for typos or using different keywords.
                            </p>
                            <Button
                                variant="outline"
                                onClick={() => setFilters({ brands: [], categories: [], minPrice: "", maxPrice: "", minRating: null, tags: [] })}
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

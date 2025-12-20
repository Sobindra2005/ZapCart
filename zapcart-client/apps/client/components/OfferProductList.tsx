"use client";

import { useState } from "react";
import { Product } from "@/types/product";
import { ProductCard } from "@/components/ProductCard";
import { MainContainer } from "./wrapper";
import { SortSelect, SortOption } from "@/components/SortSelect";

// Custom sort options for offers page
const offerSortOptions: SortOption[] = [
    { value: "relevance", label: "Relevance" },
    { value: "price-asc", label: "Price: Low to High" },
    { value: "price-desc", label: "Price: High to Low" },
];

interface OfferProductListProps {
    title: string;
    products: Product[];
}

export function OfferProductList({ title, products }: OfferProductListProps) {
    const [sortOption, setSortOption] = useState<string>("relevance");

    const getSortedProducts = () => {
        const sorted = [...products];
        switch (sortOption) {
            case "price-asc":
                return sorted.sort((a, b) => a.price - b.price);
            case "price-desc":
                return sorted.sort((a, b) => b.price - a.price);
            default:
                return sorted; // "relevance" or default order
        }
    };

    const sortedProducts = getSortedProducts();

    return (
        <section className="w-full py-12 bg-gray-50/50 min-h-screen">
            <MainContainer className="container">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{title}</h1>

                    <div className="flex items-center gap-3">
                        <SortSelect
                            options={offerSortOptions}
                            value={sortOption}
                            onValueChange={setSortOption}
                        />
                    </div>
                </div>

                {sortedProducts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {sortedProducts.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-xl text-gray-500">No products found for this offer.</p>
                    </div>
                )}
            </MainContainer>
        </section>
    );
}

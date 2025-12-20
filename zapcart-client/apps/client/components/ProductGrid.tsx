"use client";

import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";
import { MainContainer } from "./wrapper";
import { SectionHeader } from "./SectionHeader";

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <section className="w-full bg-background">
            <MainContainer className="container" spacing={true}>
                <SectionHeader title="Products For You" viewAllLink="/products" />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </MainContainer>
        </section>
    );
}

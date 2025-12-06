"use client";

import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/types/product";
import { MainContainer } from "./wrapper";

interface ProductGridProps {
    products: Product[];
}

export function ProductGrid({ products }: ProductGridProps) {
    return (
        <section className="w-full py-12 bg-white">
            <MainContainer className="container">
                <h2 className="text-2xl md:text-3xl font-bold mb-8">Product For You</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            </MainContainer>
        </section>
    );
}

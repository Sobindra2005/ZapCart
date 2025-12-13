import { Hero } from "@/components/Hero";
import { FlashSaleCard } from "@/components/FlashSaleCard";
import { PopularCategories } from "@/components/PopularCategories";
import { ProductGrid } from "@/components/ProductGrid";
import { sampleProducts } from "@/data/products";
import { FeaturedProducts } from "@/components/featuredProduct";

export default function Home() {
  return (
      <main>
        <Hero />
        <PopularCategories />
        <FlashSaleCard />
        <FeaturedProducts />
        <ProductGrid products={sampleProducts} />
      </main>
  );
}
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import { FlashSaleCard } from "@/components/FlashSaleCard";
import { PopularCategories } from "@/components/PopularCategories";
import { ProductGrid } from "@/components/ProductGrid";
import { sampleProducts } from "@/data/products";
import { FeaturedProducts } from "@/components/featuredProduct";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main>
        <Hero />
        <PopularCategories />
        <FlashSaleCard />
        <FeaturedProducts />
        <ProductGrid products={sampleProducts} />
      </main>
    </div>
  );
}

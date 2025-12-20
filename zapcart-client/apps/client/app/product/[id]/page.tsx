import { notFound } from "next/navigation";
import { sampleProducts } from "@/data/products";
import { ProductImageGallery } from "@/components/ProductImageGallery";
import { ProductInfo } from "@/components/ProductInfo";
import { ReviewsSection } from "@/components/ReviewsSection";
import { MainContainer } from "@/components/wrapper";

interface ProductPageProps {
    params: Promise<{
        id: string;
    }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
    const { id } = await params;
    const product = sampleProducts.find((p) => p.id === id);

    if (!product) {
        notFound();
    }

    // Default images if not provided
    const images = product.images || [product.image, product.image, product.image, product.image];

    return (
        <MainContainer className="max-w-7xl">
            <div className="py-8 md:py-12">
                <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
                    {/* Left: Image Gallery */}
                    <ProductImageGallery images={images}  />

                    {/* Right: Product Info */}
                    <ProductInfo product={product} />
                </div>

                {/* Reviews Section */}
                {product.reviews && product.reviews.length > 0 && (
                    <ReviewsSection
                        rating={product.rating}
                        reviewCount={product.reviewCount}
                        reviews={product.reviews}
                    />
                )}
            </div>
        </MainContainer>
    );
}

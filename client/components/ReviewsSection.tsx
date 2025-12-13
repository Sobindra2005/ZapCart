"use client";

import { Star } from "lucide-react";
import { Review } from "@/types/product";
import { ReviewCard } from "./ReviewCard";
import { Button } from "@/components/ui/button";

interface ReviewsSectionProps {
    rating: number;
    reviewCount: number;
    reviews: Review[];
}

export function ReviewsSection({ rating, reviewCount, reviews }: ReviewsSectionProps) {
    // Calculate rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating === stars).length;
        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
        return { stars, count, percentage };
    });

    return (
        <div className="mt-12">
            <h2 className="text-2xl font-bold mb-8">Rating & Reviews</h2>

            <div className="grid md:grid-cols-2 gap-12">
                {/* Rating Summary */}
                <div className="space-y-6">
                    <div>
                        <div className="flex items-baseline gap-2 mb-2">
                            <span className="text-6xl font-bold">{rating.toFixed(1)}</span>
                            <span className="text-2xl text-muted-foreground">/5</span>
                        </div>
                        <p className="text-sm text-muted-foreground">({reviewCount} New Reviews)</p>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                        {ratingBreakdown.map(({ stars, percentage }) => (
                            <div key={stars} className="flex items-center gap-3">
                                <div className="flex items-center gap-1 w-20">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            className={`w-3.5 h-3.5 ${
                                                i < stars
                                                    ? "fill-yellow-400 text-yellow-400"
                                                    : "fill-gray-300 text-gray-300"
                                            }`}
                                        />
                                    ))}
                                </div>
                                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-black rounded-full transition-all"
                                        style={{ width: `${percentage}%` }}
                                    />
                                </div>
                                <span className="text-sm text-muted-foreground w-10 text-right">
                                    {Math.round(percentage)}%
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Reviews List */}
                <div className="space-y-0 w-full">
                    <Button 
                        className="h-12 mx-auto rounded-full bg-black text-white font-medium hover:bg-black/90 mb-6"
                        size="lg"
                    >
                        Add Your Review
                    </Button>
                    
                    <div className="space-y-0">
                        {reviews.length > 0 ? (
                            reviews.map((review) => (
                                <ReviewCard key={review.id} review={review} />
                            ))
                        ) : (
                            <p className="text-muted-foreground text-center py-8">
                                No reviews yet. Be the first to review this product!
                            </p>
                        )}
                    </div>

                    {reviews.length > 0 && (
                        <div className="flex justify-center pt-6">
                            <Button 
                                variant="outline" 
                                className="rounded-full px-8 h-12 font-medium"
                            >
                                View More Reviews
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

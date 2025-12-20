"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Star, X } from "lucide-react";
import { Review } from "@/types/product";
import { ReviewCard } from "./ReviewCard";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import {motion} from "framer-motion"

// Review form validation schema
const reviewSchema = z.object({
    rating: z.number().min(1, "Please select a rating").max(5),
    title: z.string().min(3, "Title must be at least 3 characters").max(100, "Title must be less than 100 characters"),
    comment: z.string().min(10, "Review must be at least 10 characters").max(500, "Review must be less than 500 characters"),
});

type ReviewFormData = z.infer<typeof reviewSchema>;

interface ReviewsSectionProps {
    rating: number;
    reviewCount: number;
    reviews: Review[];
}

export function ReviewsSection({ rating, reviewCount, reviews }: ReviewsSectionProps) {
    const [showReviewForm, setShowReviewForm] = useState(false);

    const form = useForm<ReviewFormData>({
        resolver: zodResolver(reviewSchema),
        defaultValues: {
            rating: 0,
            title: "",
            comment: "",
        },
    });

    // Calculate rating breakdown
    const ratingBreakdown = [5, 4, 3, 2, 1].map(stars => {
        const count = reviews.filter(r => r.rating === stars).length;
        const percentage = reviewCount > 0 ? (count / reviewCount) * 100 : 0;
        return { stars, count, percentage };
    });

    const handleSubmitReview = (data: ReviewFormData) => {
        console.log("Review submitted:", {
            ...data,
            userId: "mock-user-id",
            userName: "Current User",
            date: new Date().toISOString(),
            id: crypto.randomUUID(),
        });

        // Reset form and hide it
        form.reset();
        setShowReviewForm(false);
    };

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
                                            className={`w-3.5 h-3.5 ${i < stars
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
                        onClick={() => setShowReviewForm(!showReviewForm)}
                    >
                        {showReviewForm ? "Cancel" : "Add Your Review"}
                    </Button>

                    {/* Review Form */}
                    {showReviewForm && (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            className="bg-muted/30 border border-border rounded-lg p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h3 className="text-lg font-semibold">Write a Review</h3>
                            </div>

                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(handleSubmitReview)} className="space-y-4">
                                    {/* Rating Field */}
                                    <FormField
                                        control={form.control}
                                        name="rating"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Rating *</FormLabel>
                                                <FormControl>
                                                    <div className="flex gap-2">
                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                            <button
                                                                key={star}
                                                                type="button"
                                                                onClick={() => field.onChange(star)}
                                                                className="transition-transform hover:scale-110"
                                                            >
                                                                <Star
                                                                    className={cn(
                                                                        "w-8 h-8 cursor-pointer transition-colors",
                                                                        star <= field.value
                                                                            ? "fill-yellow-400 text-yellow-400"
                                                                            : "fill-gray-300 text-gray-300 hover:fill-yellow-200 hover:text-yellow-200"
                                                                    )}
                                                                />
                                                            </button>
                                                        ))}
                                                    </div>
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Title Field */}
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Review Title *</FormLabel>
                                                <FormControl>
                                                    <Input
                                                        placeholder="Summarize your review"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    {/* Comment Field */}
                                    <FormField
                                        control={form.control}
                                        name="comment"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Your Review *</FormLabel>
                                                <FormControl>
                                                    <Textarea
                                                        placeholder="Share your experience with this product..."
                                                        className="min-h-[120px] resize-none"
                                                        {...field}
                                                    />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="flex justify-end gap-3 pt-2">
                                        <Button type="submit">
                                            Submit Review
                                        </Button>
                                    </div>
                                </form>
                            </Form>
                        </motion.div>
                    )}

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

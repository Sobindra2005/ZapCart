"use client";

import { Star } from "lucide-react";
import { Review } from "@/types/product";

interface ReviewCardProps {
    review: Review;
}

export function ReviewCard({ review }: ReviewCardProps) {
    // Get initials from userName
    const getInitials = (name: string) => {
        const parts = name.split(' ');
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[1].charAt(0)).toUpperCase();
        }
        return name.substring(0, 2).toUpperCase();
    };

    return (
        <div className="py-6 border rounded-lg p-6 mb-4 bg-gray-50">
            <div className="flex items-start gap-4 mb-3">
                <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center shrink-0">
                    <span className="text-sm font-semibold text-white">
                        {getInitials(review.userName)}
                    </span>
                </div>
                <div className="flex-1">
                    <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold text-base">{review.userName}</h4>
                    </div>
                    <span className="text-sm text-muted-foreground">{review.date}</span>
                    <div className="flex items-center gap-1 mt-2">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-4 h-4 ${
                                    i < review.rating
                                        ? "fill-yellow-400 text-yellow-400"
                                        : "fill-gray-300 text-gray-300"
                                }`}
                            />
                        ))}
                    </div>
                </div>
            </div>
            {review.title && (
                <h5 className="font-semibold text-base mb-2 ml-16">{review.title}</h5>
            )}
            <p className="text-sm text-gray-600 leading-relaxed ml-16">{review.comment}</p>
        </div>
    );
}

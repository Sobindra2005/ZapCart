"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

interface ProductImageGalleryProps {
    images: string[];
}

export function ProductImageGallery({ images }: ProductImageGalleryProps) {
    const [selectedImage, setSelectedImage] = useState(0);

    return (
        <div className="space-y-4">
            {/* Main Image */}
            <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
                <div className="w-full h-full flex items-center justify-center">
                    <span className="text-gray-400 text-sm">Product Image {selectedImage + 1}</span>
                </div>
            </div>

            {/* Thumbnail Images */}
            <div className="grid grid-cols-4 gap-3">
                {images.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedImage(index)}
                        className={cn(
                            "relative aspect-square bg-gray-100 rounded-lg overflow-hidden transition-all",
                            selectedImage === index
                                ? "ring-2 ring-black"
                                : "hover:ring-2 hover:ring-gray-300"
                        )}
                    >
                        <div className="w-full h-full flex items-center justify-center">
                            <span className="text-gray-400 text-xs">{index + 1}</span>
                        </div>
                    </button>
                ))}
            </div>
        </div>
    );
}

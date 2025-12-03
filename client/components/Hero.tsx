"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";

export function Hero() {
    return (
        <section className="w-full bg-gradient-to-r from-amber-50 to-orange-50">
            <div className="container mx-auto px-4 md:px-6">
                <div className="grid gap-6 lg:grid-cols-2 lg:gap-12 items-center py-12 md:py-16">
                    {/* Content */}
                    <div className="flex flex-col justify-center space-y-6">
                        <div className="space-y-4">
                            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl xl:text-6xl text-emerald-900">
                                Grab Upto 50% Off On Selected Headphone
                            </h1>
                        </div>
                        <Button
                            size="lg"
                            className="w-fit bg-emerald-700 hover:bg-emerald-800 text-white px-8 rounded-full"
                        >
                            Buy Now
                        </Button>
                    </div>

                    {/* Hero Image */}
                    <div className="relative h-[300px] md:h-[400px] lg:h-[450px]">
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="relative w-full h-full">
                                {/* Placeholder for hero image - you can replace with actual image */}
                                <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-blue-200 rounded-full opacity-30 blur-3xl" />
                                <div className="relative h-full flex items-center justify-center">
                                    <div className="text-center text-gray-400">
                                        {/* Hero image will go here */}
                                        <p className="text-sm">Hero Image Placeholder</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

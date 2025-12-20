"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MainContainer } from "./wrapper";

export function FlashSaleCard() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 3,
        minutes: 21,
        seconds: 48,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                let { hours, minutes, seconds } = prev;

                if (seconds > 0) {
                    seconds--;
                } else if (minutes > 0) {
                    minutes--;
                    seconds = 59;
                } else if (hours > 0) {
                    hours--;
                    minutes = 59;
                    seconds = 59;
                }

                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <MainContainer spacing={true}>
            <Card className="overflow-hidden border-0">
                <CardContent className="p-0">
                    <div className="relative bg-linear-to-r from-red-500 via-orange-500 to-orange-400 rounded-2xl overflow-hidden">
                        {/* Background Image with Overlay */}
                        <div className="absolute inset-0 opacity-20">
                            <Image
                                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200&q=80"
                                alt="Flash Sale Background"
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* Content */}
                        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-8 p-8 lg:p-12">
                            {/* Left Side - Text Content */}
                            <div className="flex flex-col justify-center text-white space-y-6">
                                {/* Limited Time Badge */}
                                <Badge className="bg-white/20 backdrop-blur-sm text-white border-0 w-fit px-4 py-2 text-sm font-semibold uppercase tracking-wider">
                                    Limited Time
                                </Badge>

                                {/* Title */}
                                <div>
                                    <h2 className="text-5xl lg:text-6xl font-bold mb-3">
                                        Flash Sale
                                    </h2>
                                    <p className="text-xl lg:text-2xl text-white/90">
                                        Save up to 70% on selected items
                                    </p>
                                </div>

                                {/* Countdown Timer */}
                                <div className="flex items-center gap-3">
                                    <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]">
                                        <span className="text-3xl font-bold">
                                            {String(timeLeft.hours).padStart(2, "0")}
                                        </span>
                                        <span className="text-xs font-medium uppercase">Hours</span>
                                    </div>
                                    <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]">
                                        <span className="text-3xl font-bold">
                                            {String(timeLeft.minutes).padStart(2, "0")}
                                        </span>
                                        <span className="text-xs font-medium uppercase">Minutes</span>
                                    </div>
                                    <div className="flex flex-col items-center bg-white/20 backdrop-blur-sm rounded-lg px-4 py-3 min-w-[70px]">
                                        <span className="text-3xl font-bold">
                                            {String(timeLeft.seconds).padStart(2, "0")}
                                        </span>
                                        <span className="text-xs font-medium uppercase">Seconds</span>
                                    </div>
                                </div>

                                {/* CTA Button */}
                                <Link href="/offers/flash-sale">
                                    <Button className="bg-white text-red-500 hover:bg-white/90 font-bold text-lg px-8 py-6 w-fit rounded-lg shadow-lg">
                                        Shop Flash Sale
                                    </Button>
                                </Link>
                            </div>

                            {/* Right Side - Product Image */}
                            <div className="relative flex items-center justify-center">
                                <div className="relative w-full h-[300px] lg:h-[400px]">
                                    {/* <Image
                                        src="https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80"
                                        alt="Featured Product"
                                        fill
                                        className="object-contain drop-shadow-2xl"
                                        priority
                                    /> */}
                                </div>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </MainContainer>
    );
}

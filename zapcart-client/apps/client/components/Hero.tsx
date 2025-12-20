"use client"

import * as React from "react"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    type CarouselApi,
} from "@/components/ui/carousel"
import { Button } from "@/components/ui/button"

const heroSlides = [
    {
        id: 1,
        title: "Summer Collection 2024",
        subtitle: "Discover the latest trends",
        cta: "Shop Now",
        link: "/collections/summer",
        gradient: "from-orange-400 to-orange-600",
        image: "/hero-1.jpg",
    },
    {
        id: 2,
        title: "Exclusive Deals",
        subtitle: "Up to 50% off on selected items",
        cta: "View Deals",
        link: "/collections/deals",
        gradient: "from-amber-400 to-orange-500",
        image: "/hero-2.jpg",
    },
    {
        id: 3,
        title: "New Arrivals",
        subtitle: "Fresh products every week",
        cta: "Explore",
        link: "/collections/new-arrivals",
        gradient: "from-orange-500 to-red-500",
        image: "/hero-3.jpg",
    },
    {
        id: 4,
        title: "Best Sellers",
        subtitle: "Most popular items this season",
        cta: "Shop Now",
        link: "/collections/best-sellers",
        gradient: "from-pink-400 to-orange-400",
        image: "/hero-4.jpg",
    },
    {
        id: 5,
        title: "Limited Edition",
        subtitle: "Exclusive products available now",
        cta: "Discover",
        link: "/collections/limited",
        gradient: "from-purple-400 to-orange-500",
        image: "/hero-5.jpg",
    },
]

export function Hero() {
    const [api, setApi] = React.useState<CarouselApi>()
    const [current, setCurrent] = React.useState(0)

    React.useEffect(() => {
        if (!api) {
            return
        }

        setCurrent(api.selectedScrollSnap())

        api.on("select", () => {
            setCurrent(api.selectedScrollSnap())
        })
    }, [api])

    // Auto-play functionality
    React.useEffect(() => {
        if (!api) {
            return
        }

        const interval = setInterval(() => {
            api.scrollNext()
        }, 8000)

        return () => clearInterval(interval)
    }, [api])

    const goToSlide = (index: number) => {
        api?.scrollTo(index)
    }

    return (
        <section className="relative overflow-hidden container">
            <Carousel 
                setApi={setApi} 
                className=" border-2 border-white "
                opts={{
                    loop: true,
                }}
            >
                    <CarouselContent>
                    {heroSlides.map((slide, index) => (
                        <CarouselItem key={slide.id}>
                            <Card className="border-0 rounded-none p-0">
                                <CardContent className="p-0 relative h-96 md:h-[500px] lg:h-[600px]">
                                    {/* Background Gradient */}
                                    <div className={`absolute inset-0 bg-linear-to-r ${slide.gradient}`}>
                                        {/* Image */}
                                        <Image
                                            src={slide.image}
                                            alt={slide.title || `Slide ${index + 1}`}
                                            fill
                                            className="object-cover mix-blend-overlay"
                                            priority={index === 0}
                                        />
                                    </div>

                                    {/* Conditional Content Overlay */}
                                    {(slide.title || slide.subtitle || slide.cta) ? (
                                        // Show content overlay if any text content exists
                                        <div className="relative h-full flex items-center">
                                            <div className="container mx-auto px-4 md:px-6 w-full">
                                                <div className="max-w-md">
                                                    {slide.title && (
                                                        <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 text-balance">
                                                            {slide.title}
                                                        </h2>
                                                    )}
                                                    {slide.subtitle && (
                                                        <p className="text-lg md:text-xl text-white/90 mb-8">
                                                            {slide.subtitle}
                                                        </p>
                                                    )}
                                                    {slide.cta && slide.link && (
                                                        <Link href={slide.link}>
                                                            <Button className="bg-white text-foreground hover:bg-white/90">
                                                                {slide.cta}
                                                            </Button>
                                                        </Link>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        // If no text content, make entire image clickable
                                        slide.link && (
                                            <Link href={slide.link} className="absolute inset-0 z-10">
                                                <span className="sr-only">View {slide.link}</span>
                                            </Link>
                                        )
                                    )}
                                </CardContent>
                            </Card>
                        </CarouselItem>
                    ))}
                </CarouselContent>
                
                {/* Indicator Dots - Bottom Center */}
                <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10 flex gap-3">
                    {heroSlides.map((_, index) => (
                        <button
                            key={index}
                            onClick={() => goToSlide(index)}
                            className={`h-3 rounded-full transition-all duration-300 ${
                                index === current
                                    ? "bg-white w-8"
                                    : "bg-white/50 hover:bg-white/70 w-3"
                            }`}
                            aria-label={`Go to slide ${index + 1}`}
                        />
                    ))}
                </div>
            </Carousel>
        </section>
    )
}
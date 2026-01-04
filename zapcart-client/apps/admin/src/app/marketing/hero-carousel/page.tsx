"use client";

import {
    Plus,
    GripVertical,
    ExternalLink,
    Settings,
    Eye,
    Edit,
    Trash2,
    Save,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import {
    CardContent,
    CardHeader,
    CardTitle,
} from "@repo/ui/ui/card";
import { AdminCard } from "@/components/AdminCard";
import { FormPopup } from "@repo/ui/ui/form-popup";
import { AddNewSlideForm } from "@/components/forms/AddNewSlideForm";

interface CarouselSlide {
    id: string;
    title: string;
    subtitle: string;
    buttonText: string;
    buttonLink: string;
    image: string;
    status: "Published" | "Draft" | "Scheduled";
    order: number;
}

const mockSlides: CarouselSlide[] = [
    {
        id: "1",
        title: "Summer Collection 2024",
        subtitle: "Up to 50% Off on all summer essentials",
        buttonText: "Shop Now",
        buttonLink: "/collections/summer",
        image: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&q=80&w=800&h=400",
        status: "Published",
        order: 1
    },
    {
        id: "2",
        title: "New Tech Arrivals",
        subtitle: "Experience the future of electronics today",
        buttonText: "Explore More",
        buttonLink: "/categories/electronics",
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=800&h=400",
        status: "Published",
        order: 2
    },
    {
        id: "3",
        title: "Sustainable Living",
        subtitle: "Eco-friendly products for a better tomorrow",
        buttonText: "Read Story",
        buttonLink: "/blogs/sustainability",
        image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800&h=400",
        status: "Draft",
        order: 3
    }
];

export default function HeroCarouselPage() {
    const slides: CarouselSlide[] = mockSlides;

    return (
        <div className="p-8">
            <div className="flex items-center justify-end mb-8">

                <div className="flex items-center gap-3">
                    <Button variant="outline" className="gap-2 font-bold border-gray-200">
                        <Settings className="h-4 w-4" />
                        Settings
                    </Button>
                    <FormPopup
                        title="Add New Slide"
                        description="Add a new slide to the hero carousel."
                        trigger={
                            <Button className="gap-2 font-bold bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4" />
                                Add New Slide
                            </Button>
                        }
                    >
                        <AddNewSlideForm onSubmit={(data) => console.log(data)} />
                    </FormPopup>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* List View */}
                <div className="xl:col-span-2 space-y-6">
                    {slides.map((slide) => (
                        <AdminCard key={slide.id} className="p-0 overflow-hidden group">
                            <div className="flex flex-col md:flex-row h-full">
                                <div className="md:w-64 h-40 md:h-auto relative shrink-0">
                                    <Image src={slide.image} alt={slide.title} fill className="object-cover" />
                                    <div className="absolute top-2 left-2">
                                        <Badge className={cn(
                                            "font-bold",
                                            slide.status === "Published" ? "bg-green-500" : "bg-gray-400"
                                        )}>
                                            {slide.status}
                                        </Badge>
                                    </div>
                                </div>
                                <div className="flex-1 p-6 relative">
                                    <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Edit className="h-4 w-4 text-gray-400" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                            <Trash2 className="h-4 w-4 text-red-400" />
                                        </Button>
                                        <div className="h-4 w-px bg-gray-200 mx-2" />
                                        <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" />
                                    </div>

                                    <div className="pr-16">
                                        <h3 className="text-lg font-bold text-gray-900 mb-1">{slide.title}</h3>
                                        <p className="text-sm text-gray-500 mb-4 font-medium">{slide.subtitle}</p>

                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600">
                                                <ExternalLink className="h-3 w-3" />
                                                {slide.buttonText} → {slide.buttonLink}
                                            </div>
                                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Order: {slide.order}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </AdminCard>
                    ))}
                </div>

                {/* Live Preview / Tools */}
                <div className="space-y-6">
                    <AdminCard className="px-0 sticky top-8">
                        <CardHeader className="pb-4 border-b border-gray-100">
                            <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                <Eye className="h-4 w-4" />
                                Mobile Preview
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="pt-6">
                            <div className="aspect-9/16 bg-gray-900 rounded-4xl border-[6px] border-gray-800 relative overflow-hidden shadow-2xl mx-auto max-w-60">
                                {/* Screen Content */}
                                <div className="absolute inset-0 bg-white">
                                    <div className="h-32 relative">
                                        <Image src={slides[0].image} alt="preview" fill className="object-cover" />
                                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                                            <h4 className="text-white text-xs font-black">{slides[0].title}</h4>
                                            <p className="text-white/80 text-[8px] mt-1">{slides[0].subtitle}</p>
                                        </div>
                                    </div>
                                    <div className="p-4 space-y-3">
                                        {[1, 2, 3].map(i => (
                                            <div key={i} className="h-2 w-full bg-gray-100 rounded-full" />
                                        ))}
                                    </div>
                                </div>
                                {/* Header bar */}
                                <div className="absolute top-2 left-1/2 -translate-x-1/2 w-16 h-4 bg-gray-800 rounded-full" />
                            </div>
                            <p className="text-center text-[10px] font-bold text-gray-400 mt-4 uppercase tracking-widest">Real-time simulator</p>
                        </CardContent>
                    </AdminCard>

                    <AdminCard className="px-0">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold text-gray-900">Slide Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                                <span>Autoplay Duration</span>
                                <span className="text-primary">5,000ms</span>
                            </div>
                            <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                <div className="h-full bg-primary rounded-full w-[60%]" />
                            </div>

                            <div className="flex items-center justify-between text-xs font-bold text-gray-600 pt-2">
                                <span>Transition Effect</span>
                                <span className="text-gray-900">Fade In</span>
                            </div>

                            <Button className="w-full mt-4 gap-2 font-bold shadow-sm">
                                <Save className="h-4 w-4" />
                                Save Changes
                            </Button>
                        </CardContent>
                    </AdminCard>
                </div>
            </div>
        </div>
    );
}

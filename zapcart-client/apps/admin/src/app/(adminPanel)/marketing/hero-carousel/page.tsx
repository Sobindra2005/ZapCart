"use client";

import {
    Plus,
    GripVertical,
    ExternalLink,
    Edit,
    Trash2,
    Save,
    Wallpaper,
    Images,
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
import { useRef, useState, useEffect } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { marketingApi } from "@/utils/api";
import { Camera, Check, Eye } from "iconsax-react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSortable } from '@dnd-kit/react/sortable';
import { move } from '@dnd-kit/helpers';
import { DragDropProvider } from '@dnd-kit/react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Slider } from "@/components/ui/slider";
import { getQueryClient } from "../../../../../../../packages/ui/src/get-query-client";

interface CarouselSlide {
    _id: string;
    title: string | null;
    description: string | null;
    image: string;
    buttonLabel: string | null;
    link: string;
    status: "draft" | "published";
    createdBy: number;
    order: number;
    createdAt: string;
    updatedAt: string;
    __v: number;
    id?: string;
}

export default function HeroCarouselPage() {
    const [slides, setSlides] = useState<CarouselSlide[]>([]);
    const [slidesImages, setSlidesImages] = useState<{ [key: string]: string }>({});
    const [open, setOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    // State for settings
    const [autoplayDuration, setAutoplayDuration] = useState(5000);
    const [transitionEffect, setTransitionEffect] = useState("fade");
    const transitionOptions = [
        { label: "Fade In", value: "fade" },
        { label: "Slide", value: "slide" },
        { label: "Zoom", value: "zoom" },
    ];

    const queryClient  = getQueryClient();

    const {
        data: carouselData,
        isLoading: isCarouselLoading,
        isError: isCarouselError,
        error: carouselError
    } = useQuery({
        queryKey: ["hero-carousel"],
        queryFn: () => marketingApi.getHeroCarousel(),
    });

    useEffect(() => {
        if (carouselData && Array.isArray(carouselData.data.data)) {
            setSlides(carouselData.data.data);
        }
    }, [carouselData]);

    // React Query mutation for creating hero carousel
    const createCarouselMutation = useMutation({
        mutationFn: (formData: FormData) => marketingApi.createHeroCarousel(formData),
        onSuccess: (data) => {
            toast.success("Slide created successfully");
            setIsSubmitting(false);
            setOpen(false);
            queryClient.invalidateQueries({ queryKey: ["hero-carousel"] });
        },
        onError: (error: Error) => {
            toast.error(`Failed to Create Slide`, {
                description: error.message || "An error occurred while creating the slide. Please try again.",
            });
            setIsSubmitting(false);
        }
    });

    const handleSlideForm = (data: Omit<CarouselSlide, "id" | "order">) => {
        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("title", data.title ?? "");
        formData.append("description", data.description ?? "");
        formData.append("link", data.link ?? "");
        formData.append("status", data.status ?? "");
        formData.append("buttonLabel", data.buttonLabel ?? "");
        if ((data as any).imageFile) {
            formData.append("image", (data as any).imageFile);
        }
        createCarouselMutation.mutate(formData);
    }

    return (
        <div className="p-8">
            <div className="flex items-center justify-end mb-8">
                <div className="flex items-center gap-3">
                    <FormPopup
                        open={open}
                        onOpenChange={setOpen}
                        title="Add New Slide"
                        description="Add a new slide to the hero carousel."
                        className="max-w-4xl"
                        trigger={
                            <Button className="gap-2 font-bold bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4" />
                                Add New Slide
                            </Button>
                        }
                    >
                        <AddNewSlideForm isSubmitting={isSubmitting} onSubmit={handleSlideForm} />
                    </FormPopup>
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* List View */}
                <DragDropProvider
                    onDragEnd={(event) => {
                        setSlides((prevSlides) => {
                            // Get array of slide IDs
                            const slideIds = prevSlides.map(slide => slide._id);
                            // Move IDs based on event
                            const newOrderIds = move(slideIds, event);
                            // Reorder slides based on newOrderIds
                            const reorderedSlides = newOrderIds.map((id, index) => {
                                const slide = prevSlides.find(s => s._id === id)!;
                                return { ...slide, order: index + 1 };
                            });
                            return reorderedSlides;
                        });
                    }}
                >
                    <ul className="xl:col-span-2 space-y-6">
                        {/* < SlideSkeleton/> */}
                        {isCarouselLoading ? [0, 1, 2].map((_, index) => <SlideSkeleton key={index} />) : slides && slides.length > 0 && Array.isArray(slides) ? slides.map((slide, index) => (
                            <SlideCard key={slide._id} slide={slide} setSlides={setSlides} setSlidesImages={setSlidesImages} slidesImages={slidesImages} index={index} />
                        ))
                            :
                            <EmptySlidesList />
                        }
                    </ul>
                </DragDropProvider>

                {/* Live Preview / Tools */}
                <div className="space-y-6">
                    <AdminCard className="px-0 sticky top-8 z-10">
                        <Accordion
                            type="single"
                            collapsible
                            className="border-0"
                        >
                            <AccordionItem value="preview">
                                <AccordionTrigger className="p-0 pr-5">
                                    <CardHeader className="border-b border-gray-100">
                                        <CardTitle className="text-sm font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                                            <Eye size="20" color="#99a1af" variant="Bold" />
                                            Preview
                                        </CardTitle>
                                    </CardHeader>
                                </AccordionTrigger>
                                <AccordionContent>
                                    <CardContent className="pt-6">
                                        {slides.length > 0 ? (
                                            <div className="aspect-9/16 bg-gray-900 rounded-4xl border-[6px] border-gray-800 relative overflow-hidden mx-auto max-w-60">
                                                {/* Screen Content */}
                                                <div className="absolute inset-0 bg-white">
                                                    <div className="h-32 relative">
                                                        <Image src={slides[0].image} alt="preview" fill className="object-cover" />
                                                        <div className="absolute inset-0 bg-black/30 flex flex-col justify-end p-4">
                                                            <h4 className="text-white text-xs font-black">{slides[0].title}</h4>
                                                            <p className="text-white/80 text-[8px] mt-1">{slides[0].description}</p>
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
                                        ) : (
                                            <div className="flex flex-col items-center justify-center h-60 text-gray-400">
                                                <Wallpaper size="32" />
                                                <p className="text-sm font-semibold">No slides to preview</p>
                                                <p className="text-xs">Add a new slide to see the preview here.</p>
                                            </div>
                                        )}

                                    </CardContent>
                                </AccordionContent>
                            </AccordionItem>
                        </Accordion>
                    </AdminCard>

                    <AdminCard className="px-0 z-0">
                        <CardHeader className="pb-4">
                            <CardTitle className="text-sm font-bold text-gray-900">Slide Settings</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {/* Autoplay Duration Slider */}
                            <div className="flex items-center justify-between text-xs font-bold text-gray-600">
                                <span>Autoplay Duration</span>
                                <span className="text-primary">{autoplayDuration}ms</span>
                            </div>
                            <div className="px-1">
                                <Slider
                                    min={1000}
                                    max={10000}
                                    step={100}
                                    value={[autoplayDuration]}
                                    onValueChange={([val]) => setAutoplayDuration(val)}
                                />
                            </div>

                            {/* Transition Effect Select */}
                            <div className="flex items-center justify-between text-xs font-bold text-gray-600 pt-2">
                                <span>Transition Effect</span>
                                <Select value={transitionEffect} onValueChange={setTransitionEffect}>
                                    <SelectTrigger className="w-32">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {transitionOptions.map(opt => (
                                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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

function SlideSkeleton() {
    return (
        <AdminCard className="p-0 overflow-hidden group animate-pulse">
            <div className="flex flex-col md:flex-row h-full">
                <div className="md:w-64 h-40 md:h-auto relative shrink-0 bg-gray-200">
                    <div className="absolute top-2 left-2">
                        <div className="h-6 w-20 rounded-full bg-gray-300" />
                    </div>
                </div>
                <div className="flex-1 p-6 relative">
                    <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div className="h-8 w-8 rounded-full bg-gray-200" />
                        <div className="h-4 w-px bg-gray-200 mx-2" />
                        <div className="h-4 w-4 rounded bg-gray-200" />
                    </div>
                    <div className="pr-16">
                        <div className="h-6 w-40 bg-gray-300 rounded mb-2" />
                        <div className="h-4 w-64 bg-gray-200 rounded mb-4" />
                        <div className="flex flex-wrap items-center gap-4">
                            <div className="h-6 w-32 bg-gray-200 rounded-lg" />
                        </div>
                    </div>
                </div>
            </div>
        </AdminCard>
    );
}

function EmptySlidesList() {
    // For when the slides array is empty
    return (
        <div className="flex flex-col items-center justify-center min-h-90 rounded-3xl border-2 border-gray-100  text-gray-400">
            <Images size="40" />
            <p className="text-base font-semibold mt-2">No slides found</p>
            <p className="text-xs">Add a new slide to get started.</p>
        </div>
    );
}


const cardVariants: Variants = {
    initial: { opacity: 0, y: 12, scale: 0.98 },
    animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.28, ease: [0.4, 0, 0.2, 1] } },
    exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } },
};

const fieldVariants: Variants = {
    initial: { opacity: 0, x: -6 },
    animate: (i: number) => ({
        opacity: 1,
        x: 0,
        transition: { delay: i * 0.045, duration: 0.22, ease: "easeOut" },
    }),
};

const buttonBarVariants: Variants = {
    initial: { opacity: 0, y: 6 },
    animate: { opacity: 1, y: 0, transition: { delay: 0.18, duration: 0.2, ease: "easeOut" } },
};

function SlideCard({
    slide,
    setSlides,
    setSlidesImages,
    slidesImages,
    index
}: {
    slide: CarouselSlide;
    setSlides: React.Dispatch<React.SetStateAction<CarouselSlide[]>>;
    setSlidesImages: React.Dispatch<React.SetStateAction<{ [key: string]: string }>>;
    slidesImages: { [key: string]: string };
    index: number;
}) {
    const slideId = slide.id ?? slide._id;
    const [element, setElement] = useState<Element | null>(null);
    const handleRef = useRef<HTMLButtonElement | null>(null);
    const { isDragging } = useSortable({ id: slideId, index, element, handle: handleRef });

    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState<CarouselSlide>(slide);

    // Image upload state
    const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    const queryClient = getQueryClient();

    const deleteCarouselMutation = useMutation({
        mutationFn: (id: string) => marketingApi.deleteHeroCarousel(id),
        onSuccess: () => {
            setSlides((prev) => prev.filter((s) => s._id !== slide._id));
            queryClient.invalidateQueries({ queryKey: ["hero-carousel"] });
            toast.success("Slide deleted successfully");
        },
        onError: (error: unknown) => {
            toast.error("Failed to delete slide", {
                description: error instanceof Error
                    ? error.message
                    : "An error occurred while deleting the slide. Please try again.",
            });
        },
    });

    const updateCarouselMutation = useMutation({
        mutationFn: ({ id, formData }: { id: string; formData: FormData }) =>
            marketingApi.updateHeroCarousel(id, formData),
        onSuccess: () => {
            setSlides((prev) =>
                prev.map((s) =>
                    s._id === slide._id
                        ? {
                            ...s,
                            ...draft,
                            image: previewUrl || s.image,
                        }
                        : s
                )
            );
            setIsEditing(false);
            queryClient.invalidateQueries({ queryKey: ["hero-carousel"] });
            toast.success("Slide updated successfully");
        },
        onError: (error: unknown) => {
            toast.error("Failed to update slide", {
                description: error instanceof Error
                    ? error.message
                    : "An error occurred while updating the slide. Please try again.",
            });
        },
    });

    // Clean up Blob URL when component unmounts or when a new file is selected
    useEffect(() => {
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    // When editing is toggled off, reset image state
    useEffect(() => {
        if (!isEditing) {
            setSelectedImageFile(null);
            setPreviewUrl(null);
        }
    }, [isEditing]);

    const handleEditToggle = () => {
        setDraft(slide);
        setIsEditing(true);
    };

    const handleCancel = () => {
        setDraft(slide);
        setIsEditing(false);
    };

    const handleSave = () => {
        const formData = new FormData();
        formData.append("title", draft.title ?? "");
        formData.append("description", draft.description ?? "");
        formData.append("link", draft.link ?? "");
        formData.append("status", draft.status ?? "draft");
        formData.append("buttonLabel", draft.buttonLabel ?? "");
        if (selectedImageFile) {
            formData.append("image", selectedImageFile);
        }

        updateCarouselMutation.mutate({ id: slideId, formData });
    };

    const handleDelete = () => {
        deleteCarouselMutation.mutate(slideId);
    };

    const handleChange = (field: keyof CarouselSlide, value: string) => {
        setDraft((prev) => ({ ...prev, [field]: value }));
    };

    // Handle camera icon click
    const handleCameraClick = () => {
        fileInputRef.current?.click();
    };

    // Handle file input change
    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
            const url = URL.createObjectURL(file);
            setPreviewUrl(url);
            setSelectedImageFile(file);
            // Optionally update draft.image for immediate preview
            setDraft((prev) => ({ ...prev, image: url }));
        }
    };

    

    const fields = [
        { label: "Title", field: "title" as const, type: "input" },
        { label: "Description", field: "description" as const, type: "input" },
        { label: "Button Text", field: "buttonLabel" as const, type: "input" },
        { label: "Button Link", field: "link" as const, type: "input" },
        { label: "Image URL", field: "image" as const, type: "input" },
        { label: "Status", field: "status" as const, type: "select" },
    ];

    return (
        <motion.li ref={setElement} className="list-none" data-shadow={isDragging || undefined} layout transition={{ layout: { duration: 0.32, ease: [0.4, 0, 0.2, 1] } }}>
            <AdminCard
                className={cn(
                    "p-0 overflow-hidden group transition-shadow duration-300",
                    isEditing && "ring-2 ring-blue-500 shadow-lg shadow-blue-100"
                )}
            >
                <AnimatePresence mode="wait" initial={false}>
                    {isEditing ? (

                        <motion.div
                            key="edit"
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex flex-col md:flex-row h-full"
                        >

                            {/* Image preview with overlay input */}
                            <div className="md:w-64 h-44 md:h-auto relative shrink-0">
                                <Image
                                    src={previewUrl || draft.image || slide.image}
                                    alt={draft.title || "Slide Image"}
                                    fill
                                    className="object-cover transition-all duration-500 " 
                                />

                                <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px] flex flex-col items-center justify-center px-4">
                                    <span
                                        className="border border-white/25 p-2 rounded-full bg-white/15 cursor-pointer "
                                        onClick={handleCameraClick}
                                    >
                                        <Camera color="#D4C8C5" size={28} />
                                    </span>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleFileChange}
                                    />
                                </div>
                            </div>

                            {/* Edit form */}
                            <div className="flex-1 p-6">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                    {fields.map((f, i) =>
                                        f.field === "image" ? null : (
                                            <motion.div
                                                key={f.field}
                                                custom={i}
                                                variants={fieldVariants}
                                                initial="initial"
                                                animate="animate"
                                                className={cn(
                                                    f.field === "title" || f.field === "description"
                                                        ? "sm:col-span-2"
                                                        : ""
                                                )}
                                            >
                                                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-1">
                                                    {f.label}
                                                </label>
                                                {f.type === "select" ? (
                                                    <Select
                                                        value={draft[f.field] ?? undefined}
                                                        onValueChange={(value) => handleChange(f.field, value)}
                                                    >
                                                        <SelectTrigger className="w-40">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                        <SelectContent>
                                                            <SelectItem value="published">Published</SelectItem>
                                                            <SelectItem value="draft">Draft</SelectItem>
                                                        </SelectContent>
                                                    </Select>
                                                ) : (
                                                    <input
                                                        value={draft[f.field] ?? ""}
                                                        onChange={(e) => handleChange(f.field, e.target.value)}
                                                        className={cn(
                                                            "w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 text-gray-800",
                                                            f.field === "title" && "font-bold"
                                                        )}
                                                    />
                                                )}
                                            </motion.div>
                                        )
                                    )}
                                </div>

                                <motion.div
                                    variants={buttonBarVariants}
                                    initial="initial"
                                    animate="animate"
                                    className="flex items-center justify-end gap-2 mt-5 pt-4 border-t border-gray-100"
                                >
                                    <Button variant="ghost" size="sm" onClick={handleCancel} className="text-gray-500">
                                        Cancel
                                    </Button>
                                    <Button
                                        size="sm"
                                        onClick={handleSave}
                                        disabled={updateCarouselMutation.isPending}
                                        className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5"
                                    >
                                        <Check className="h-3.5 w-3.5" />
                                        Save Changes
                                    </Button>
                                </motion.div>
                            </div>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="view"
                            variants={cardVariants}
                            initial="initial"
                            animate="animate"
                            exit="exit"
                            className="flex flex-col md:flex-row h-full"
                        >
                            <div className="md:w-64 h-40 md:h-auto relative shrink-0">
                                <Image src={slide.image} alt={slide.title ?? "Slide Image"} fill className="object-cover" />
                                <div className="absolute top-2 left-2">
                                    <Badge
                                        className={cn(
                                            "font-bold",
                                            slide.status === "published" ? "bg-green-500" : "bg-gray-400"
                                        )}
                                    >
                                        {slide.status}
                                    </Badge>
                                </div>
                            </div>

                            <div className="flex-1 p-6 relative">
                                <div className="absolute top-6 right-6 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleEditToggle}
                                    >
                                        <Edit className="h-4 w-4 text-gray-400" />
                                    </Button>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        className="h-8 w-8"
                                        onClick={handleDelete}
                                        disabled={deleteCarouselMutation.isPending}
                                    >
                                        <Trash2 className="h-4 w-4 text-red-400" />
                                    </Button>
                                    <div className="h-4 w-px bg-gray-200 mx-2" />
                                    <button ref={handleRef}><GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing" /></button>
                                </div>

                                <div className="pr-16">
                                    
                                        {/* Title */}
                                        {slide.title ? (
                                            <h3 className="text-lg font-bold text-gray-900 mb-1">{slide.title}</h3>
                                        ) : (
                                            <div className="h-5 w-2/5 rounded-md bg-gray-100 mb-1" />
                                        )}

                                        {/* Description */}
                                        {slide.description ? (
                                            <p className="text-sm text-gray-500 mb-4 font-medium">{slide.description}</p>
                                        ) : (
                                            <div className="flex flex-col gap-1.5 mb-4">
                                                <div className="h-3 w-4/5 rounded-md bg-gray-100" />
                                                <div className="h-3 w-3/5 rounded-md bg-gray-100" />
                                            </div>
                                        )}

                                        <div className="flex flex-wrap items-center gap-4">
                                            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-600">
                                                <ExternalLink className="h-3 w-3" />
                                                {slide.buttonLabel} → {slide.link}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </AdminCard>
        </motion.li>
    );
}

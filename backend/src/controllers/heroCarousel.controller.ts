import HeroCarousel from "@/models/HeroCarousel";
import AppError from "@/utils/AppError";
import asyncHandler from "@/utils/asyncHandler";

export const createHeroCarousel = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const { title, description, link, status, buttonLabel } = req.body;
    const image = req.file?.path;

    if (!image) {
        throw new AppError("Image is required", 400);
    }

    const heroCarousel = await HeroCarousel.create({
        title,
        description,
        link,
        status,
        image,
        buttonLabel,
        createdBy: userId,
    });

    res.status(201).json({
        data: heroCarousel
    });
})

export const getHeroCarousel = asyncHandler(async (_req, res) => {
    const { status, createdBy } = _req.query;

    let filters: {
        status?: string;
        createdBy?: number;
    } = {};

    if (typeof status === "string") {
        filters.status = status;
    }
    if (typeof createdBy === "string" && !isNaN(Number(createdBy))) {
        filters.createdBy = Number(createdBy);
    }

    const heroCarousels = await HeroCarousel.find(filters).sort({ createdAt: -1 });

    res.status(200).json({
        data: heroCarousels
    });
})

export const getHeroCarouselById = asyncHandler(async (_req, res) => {
    const { id } = _req.params;
    const heroCarousel = await HeroCarousel.findById(id);

    if (!heroCarousel) {
        throw new AppError("Hero Carousel not found", 404);
    }

    res.status(200).json({
        data: heroCarousel
    });
})


export const updateHeroCarousel = asyncHandler(async (_req, res) => {
    const { id } = _req.params;
    const { title, description, link, status } = _req.body;
    const image = _req.file?.path;
    const heroCarousel = await HeroCarousel.findById(id);

    if (!heroCarousel) {
        throw new AppError("Hero Carousel not found", 404);
    }

    if (title) heroCarousel.title = title;
    if (description) heroCarousel.description = description;
    if (link) heroCarousel.link = link;
    if (status) heroCarousel.status = status;
    if (image) heroCarousel.image = image;

    await heroCarousel.save();

    res.status(200).json({
        data: heroCarousel
    });
})

export const deleteHeroCarousel = asyncHandler(async (_req, res) => {
    const { id } = _req.params;

    await HeroCarousel.findByIdAndDelete(id);

    res.status(200).json({
        message: "Hero Carousel deleted successfully"
    });
})

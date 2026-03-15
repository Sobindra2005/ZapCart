import { Campaign } from "@/models/campaign";
import AppError from "@/utils/AppError";
import asyncHandler from "@/utils/asyncHandler";

export const createCampaign = asyncHandler(async (req, res) => {
    const userId = req.user?.id;
    const {
        name,
        description,
        products,
        status,
        discountType,
        discountValue,
        startDate,
        endDate
    } = req.body;

    const image = req.file ? req.file.path : undefined;
    const parsedProducts = products ? JSON.parse(products) : [];

    const campaign = await Campaign.create({
        name,
        description,
        products: parsedProducts,
        status,
        discountType,
        discountValue: Number(discountValue),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        image,
        createdBy: userId
    });

    res.status(201).json({
        data: campaign
    });
});

export const getCampaigns = asyncHandler(async (req, res) => {
    const { status, createdBy, searchQuery } = req.query;
    const filters: {
        status?: string;
        createdBy?: number;
        $or?: Array<
            | { name: { $regex: string; $options: string } }
            | { description: { $regex: string; $options: string } }
        >;
    } = {};

    if (typeof status === "string") {
        filters.status = status;
    }
    if (typeof createdBy === "string" && !isNaN(Number(createdBy))) {
        filters.createdBy = Number(createdBy);
    }
    if (typeof searchQuery === "string" && searchQuery.trim()) {
        filters.$or = [
            { name: { $regex: searchQuery.trim(), $options: "i" } },
            { description: { $regex: searchQuery.trim(), $options: "i" } }
        ];
    }

    const campaigns = await Campaign.find(filters).sort({ createdAt: -1 });
    res.status(200).json({
        data: campaigns
    });
});

export const getCampaignById = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
        throw new AppError("Campaign not found", 404);
    }
    res.status(200).json({
        data: campaign
    });
});

export const updateCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    const {
        name,
        description,
        products,
        status,
        discountType,
        discountValue,
        startDate,
        endDate,
        image
    } = req.body;
    const resolvedImage = req.file ? req.file.path : undefined;

    console.log("Updating campaign with data:", {
        name,
        description,
        products,
        status,
        discountType,
        discountValue,
        startDate,
        endDate,
        image,
        resolvedImage
    });

    const campaign = await Campaign.findById(id);
    if (!campaign) {
        throw new AppError("Campaign not found", 404);
    }
    if (name) campaign.name = name;
    if (description) campaign.description = description;
    if (products) campaign.products = JSON.parse(products);
    if (status) campaign.status = status;
    if (discountType) campaign.discountType = discountType;
    if (discountValue !== undefined) campaign.discountValue = Number(discountValue);
    if (startDate) campaign.startDate = new Date(startDate);
    if (endDate) campaign.endDate = new Date(endDate);
    if (resolvedImage) campaign.image = resolvedImage;
    if (image) campaign.image = image;

    await campaign.save();

    res.status(200).json({
        data: campaign
    });
});

export const deleteCampaign = asyncHandler(async (req, res) => {
    const { id } = req.params;
    await Campaign.findByIdAndDelete(id);
    res.status(200).json({
        message: "Campaign deleted successfully"
    });
});

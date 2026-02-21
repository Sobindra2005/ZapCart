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

    const campaign = await Campaign.create({
        name,
        description,
        products,
        status,
        discountType,
        discountValue,
        startDate,
        endDate,
        image,
        createdBy: userId
    });

    res.status(201).json({
        data: campaign
    });
});

export const getCampaigns = asyncHandler(async (req, res) => {
    const { status, createdBy } = req.query;
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
        endDate
    } = req.body;
    const campaign = await Campaign.findById(id);
    if (!campaign) {
        throw new AppError("Campaign not found", 404);
    }
    if (name) campaign.name = name;
    if (description) campaign.description = description;
    if (products) campaign.products = products;
    if (status) campaign.status = status;
    if (discountType) campaign.discountType = discountType;
    if (discountValue !== undefined) campaign.discountValue = discountValue;
    if (startDate) campaign.startDate = startDate;
    if (endDate) campaign.endDate = endDate;
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

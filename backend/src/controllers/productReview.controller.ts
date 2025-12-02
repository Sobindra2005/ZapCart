import { Request, Response } from 'express';
import asyncHandler from '@/utils/asyncHandler';
import AppError from '@/utils/AppError';
import ProductReview, { IProductReview } from '@/models/ProductReview';
import mongoose from 'mongoose';

/**
 * Get all reviews for a product
 * GET /api/v1/reviews/product/:productId
 */
export const getProductReviews = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;
    const {
        page = 1,
        limit = 10,
        sort = 'createdAt',
        rating,
        verifiedOnly = false,
    } = req.query;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('Invalid product ID', 400);
    }

    // Build sort object
    const sortOption: any = {};
    if (sort === 'createdAt') {
        sortOption.createdAt = -1;
    } else if (sort === 'rating') {
        sortOption.rating = -1;
    } else if (sort === 'helpful') {
        sortOption.helpfulCount = -1;
    }

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    // Use static method from model
    const reviews = await ProductReview.getProductReviews(productId, {
        limit: limitNum,
        skip,
        sort: sortOption,
        rating: rating ? Number(rating) : null,
        verifiedOnly: verifiedOnly === 'true',
    });

    // Get total count
    const query: any = {
        product: productId,
        status: 'approved',
    };

    if (rating) {
        query.rating = Number(rating);
    }

    if (verifiedOnly === 'true') {
        query.isVerifiedPurchase = true;
    }

    const total = await ProductReview.countDocuments(query);

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: { reviews },
    });
});

/**
 * Get rating distribution for a product
 * GET /api/v1/reviews/product/:productId/stats
 */
export const getRatingDistribution = asyncHandler(async (req: Request, res: Response) => {
    const { productId } = req.params;

    // Validate productId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new AppError('Invalid product ID', 400);
    }

    const stats = await ProductReview.getRatingDistribution(productId);

    res.status(200).json({
        status: 'success',
        data: stats,
    });
});

/**
 * Get a single review by ID
 * GET /api/v1/reviews/:id
 */
export const getReviewById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await ProductReview.findById(id)
        .populate('user', 'name email')
        .populate('product', 'name slug images');

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    res.status(200).json({
        status: 'success',
        data: { review },
    });
});

/**
 * Create a new review
 * POST /api/v1/reviews
 */
export const createReview = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { product, rating, title, comment, images, orderId } = req.body;

    // Validation
    if (!product || !rating || !comment) {
        throw new AppError('Please provide product, rating, and comment', 400);
    }

    // Check if user has already reviewed this product
    const hasReviewed = await ProductReview.hasUserReviewed(userId.toString(), product);
    if (hasReviewed) {
        throw new AppError('You have already reviewed this product', 400);
    }

    // Create review
    // @ts-expect-error - Mongoose typing limitation with custom fields
    const review = (await ProductReview.create({
        product,
        user: userId,
        rating,
        title,
        comment,
        images,
        orderId,
    })) as IProductReview;

    // Populate user and product
    await review.populate('user', 'name email');
    await review.populate('product', 'name slug');

    res.status(201).json({
        status: 'success',
        data: { review },
    });
});

/**
 * Get all reviews for the authenticated user
 * GET /api/v1/reviews/user/me
 */
export const getUserReviews = asyncHandler(async (req: Request, res: Response) => {
    const userId = req.user!.id;
    const { page = 1, limit = 10 } = req.query;

    const pageNum = Number(page);
    const limitNum = Number(limit);
    const skip = (pageNum - 1) * limitNum;

    const reviews = await ProductReview.getUserReviews(userId.toString(), {
        limit: limitNum,
        skip,
    });

    const total = await ProductReview.countDocuments({ user: userId.toString() });

    res.status(200).json({
        status: 'success',
        results: reviews.length,
        total,
        page: pageNum,
        pages: Math.ceil(total / limitNum),
        data: { reviews },
    });
});

/**
 * Update a review
 * PUT /api/v1/reviews/:id
 */
export const updateReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const { rating, title, comment, images } = req.body;

    const review = await ProductReview.findById(id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check authorization - user can only update their own review
    if (review.user.toString() !== userId.toString()) {
        throw new AppError('You do not have permission to update this review', 403);
    }

    // Update fields
    if (rating !== undefined) review.rating = rating;
    if (title !== undefined) review.title = title;
    if (comment !== undefined) review.comment = comment;
    if (images !== undefined) review.images = images;

    await review.save();

    res.status(200).json({
        status: 'success',
        data: { review },
    });
});

/**
 * Delete a review
 * DELETE /api/v1/reviews/:id
 */
export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const review = await ProductReview.findById(id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Check authorization - user can only delete their own review
    if (review.user.toString() !== userId.toString()) {
        throw new AppError('You do not have permission to delete this review', 403);
    }

    // Use deleteOne to trigger post-remove middleware
    await review.deleteOne();

    res.status(204).json({
        status: 'success',
        data: null,
    });
});

/**
 * Mark a review as helpful
 * POST /api/v1/reviews/:id/helpful
 */
export const markReviewHelpful = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;

    const review = await ProductReview.findById(id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Use instance method to mark as helpful
    await review.markHelpful(userId.toString());

    res.status(200).json({
        status: 'success',
        data: {
            helpfulCount: review.helpfulCount,
            helpfulnessRatio: review.helpfulnessRatio,
        },
    });
});

/**
 * Mark a review as not helpful
 * POST /api/v1/reviews/:id/not-helpful
 */
export const markReviewNotHelpful = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;

    const review = await ProductReview.findById(id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Use instance method to mark as not helpful
    await review.markNotHelpful();

    res.status(200).json({
        status: 'success',
        data: {
            notHelpfulCount: review.notHelpfulCount,
            helpfulnessRatio: review.helpfulnessRatio,
        },
    });
});

/**
 * Add a reply to a review
 * POST /api/v1/reviews/:id/reply
 */
export const addReplyToReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const { content } = req.body;

    if (!content) {
        throw new AppError('Please provide reply content', 400);
    }

    const review = await ProductReview.findById(id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Use instance method to add reply
    await review.addReply(content, userId.toString());

    res.status(200).json({
        status: 'success',
        data: { review },
    });
});

/**
 * Approve a review (Admin/Moderator only)
 * PATCH /api/v1/reviews/:id/approve
 */
export const approveReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const { note } = req.body;

    const review = await ProductReview.findById(id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Use instance method to approve
    await review.approve(userId.toString(), note);

    res.status(200).json({
        status: 'success',
        data: { review },
    });
});

/**
 * Reject a review (Admin/Moderator only)
 * PATCH /api/v1/reviews/:id/reject
 */
export const rejectReview = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user!.id;
    const { note } = req.body;

    if (!note) {
        throw new AppError('Please provide a reason for rejection', 400);
    }

    const review = await ProductReview.findById(id);

    if (!review) {
        throw new AppError('Review not found', 404);
    }

    // Use instance method to reject
    await review.reject(userId.toString(), note);

    res.status(200).json({
        status: 'success',
        data: { review },
    });
});

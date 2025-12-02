import mongoose, { Schema, Document, Model } from 'mongoose';

// Review Interface
export interface IProductReview extends Document {
  product: mongoose.Types.ObjectId;
  user: mongoose.Types.ObjectId;

  // Review Content
  rating: number;
  title?: string;
  comment: string;

  // Media
  images?: string[];

  // Verification
  isVerifiedPurchase: boolean;
  orderId?: mongoose.Types.ObjectId;

  // Helpful votes
  helpfulCount: number;
  notHelpfulCount: number;
  helpfulVotes: mongoose.Types.ObjectId[]; // User IDs who voted helpful

  // Moderation
  status: 'pending' | 'approved' | 'rejected';
  moderatorNote?: string;
  moderatedBy?: mongoose.Types.ObjectId;
  moderatedAt?: Date;

  // Reply from seller/admin
  reply?: {
    content: string;
    repliedBy: mongoose.Types.ObjectId;
    repliedAt: Date;
  };

  // Timestamps
  createdAt: Date;
  updatedAt: Date;

  // Virtuals
  helpfulnessRatio: number;
  isApproved: boolean;

  // Instance methods
  approve(moderatorId: string, note?: string): Promise<this>;
  reject(moderatorId: string, note: string): Promise<this>;
  addReply(content: string, userId: string): Promise<this>;
  markHelpful(userId: string): Promise<this>;
  markNotHelpful(): Promise<this>;
}

// Static methods interface
export interface IProductReviewModel extends Model<IProductReview> {
  getProductReviews(
    productId: string,
    options?: {
      limit?: number;
      skip?: number;
      sort?: any;
      rating?: number | null;
      verifiedOnly?: boolean;
    }
  ): Promise<IProductReview[]>;

  getRatingDistribution(productId: string): Promise<{
    distribution: Array<{
      rating: number;
      count: number;
      percentage: number;
    }>;
    totalReviews: number;
  }>;

  getUserReviews(
    userId: string,
    options?: { limit?: number; skip?: number }
  ): Promise<IProductReview[]>;

  hasUserReviewed(userId: string, productId: string): Promise<boolean>;
}

// Product Review Schema
const ProductReviewSchema = new Schema<IProductReview>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: 'Product',
      required: [true, 'Product reference is required'],
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required'],
      index: true
    },

    // Review Content
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      index: true
    },
    title: {
      type: String,
      trim: true,
      maxlength: [100, 'Review title cannot exceed 100 characters']
    },
    comment: {
      type: String,
      required: [true, 'Review comment is required'],
      trim: true,
      minlength: [10, 'Comment must be at least 10 characters'],
      maxlength: [2000, 'Comment cannot exceed 2000 characters']
    },

    // Media
    images: {
      type: [String],
      validate: {
        validator: function (v: string[]) {
          return v.length <= 5;
        },
        message: 'Cannot upload more than 5 images per review'
      }
    },

    // Verification
    isVerifiedPurchase: {
      type: Boolean,
      default: false,
      index: true
    },
    orderId: {
      type: Schema.Types.ObjectId,
      ref: 'Order'
    },

    // Helpful votes
    helpfulCount: {
      type: Number,
      default: 0,
      min: 0
    },
    notHelpfulCount: {
      type: Number,
      default: 0,
      min: 0
    },
    helpfulVotes: [{
      type: Schema.Types.ObjectId,
      ref: 'User'
    }],

    // Moderation
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true
    },
    moderatorNote: {
      type: String,
      maxlength: [500, 'Moderator note cannot exceed 500 characters']
    },
    moderatedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    moderatedAt: Date,

    // Reply
    reply: {
      content: {
        type: String,
        maxlength: [1000, 'Reply cannot exceed 1000 characters']
      },
      repliedBy: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      repliedAt: Date
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

// Compound indexes
ProductReviewSchema.index({ product: 1, status: 1, createdAt: -1 });
ProductReviewSchema.index({ product: 1, user: 1 }, { unique: true }); // One review per user per product
ProductReviewSchema.index({ user: 1, createdAt: -1 });
ProductReviewSchema.index({ rating: 1, status: 1 });

// Virtual for calculating helpfulness ratio
ProductReviewSchema.virtual('helpfulnessRatio').get(function () {
  const total = this.helpfulCount + this.notHelpfulCount;
  if (total === 0) return 0;
  return Math.round((this.helpfulCount / total) * 100);
});

// Virtual for checking if review is approved
ProductReviewSchema.virtual('isApproved').get(function () {
  return this.status === 'approved';
});

// Pre-save validation: verify purchase if orderId is provided
ProductReviewSchema.pre('save', async function (next) {
  if (this.isNew && this.orderId) {
    const Order = mongoose.model('Order');
    const order = await Order.findOne({
      _id: this.orderId,
      userId: this.user,
      status: { $in: ['delivered', 'completed'] }
    });

    if (order) {
      // Check if product is in the order
      const orderItems = order.items || [];
      const productInOrder = orderItems.some((item: any) =>
        item.product.toString() === this.product.toString()
      );

      if (productInOrder) {
        this.isVerifiedPurchase = true;
      }
    }
  }
  // @ts-ignore
  next();
});

// Post-save middleware to update product rating
ProductReviewSchema.post('save', async function (doc) {
  if (doc.status === 'approved') {
    const Product = mongoose.model('Product');
    const product = await Product.findById(doc.product);

    if (product) {
      // Recalculate average rating
      const reviews = await mongoose.model('ProductReview').find({
        product: doc.product,
        status: 'approved'
      });

      const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
      const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

      product.averageRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal
      product.reviewCount = reviews.length;
      await product.save();
    }
  }
});

// Post-remove middleware to update product rating
ProductReviewSchema.post('deleteOne', { document: true, query: false }, async function (doc) {
  const Product = mongoose.model('Product');
  const product = await Product.findById(doc.product);

  if (product) {
    const reviews = await mongoose.model('ProductReview').find({
      product: doc.product,
      status: 'approved'
    });

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;

    product.averageRating = Math.round(avgRating * 10) / 10;
    product.reviewCount = reviews.length;
    await product.save();
  }
});

// Static method to get reviews for a product
ProductReviewSchema.statics.getProductReviews = function (
  productId: string,
  options: any = {}
) {
  const {
    limit = 10,
    skip = 0,
    sort = { createdAt: -1 },
    rating = null,
    verifiedOnly = false
  } = options;

  const query: any = {
    product: productId,
    status: 'approved'
  };

  if (rating) {
    query.rating = rating;
  }

  if (verifiedOnly) {
    query.isVerifiedPurchase = true;
  }

  return this.find(query)
    .populate('user', 'name email')
    .sort(sort)
    .limit(limit)
    .skip(skip);
};

// Static method to get rating distribution for a product
ProductReviewSchema.statics.getRatingDistribution = async function (productId: string) {
  const distribution = await this.aggregate([
    {
      $match: {
        product: new mongoose.Types.ObjectId(productId),
        status: 'approved'
      }
    },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 }
      }
    },
    {
      $sort: { _id: -1 }
    }
  ]);

  // Create a full distribution (1-5 stars)
  const fullDistribution = [5, 4, 3, 2, 1].map(rating => {
    const found = distribution.find(d => d._id === rating);
    return {
      rating,
      count: found ? found.count : 0
    };
  });

  const totalReviews = fullDistribution.reduce((sum, item) => sum + item.count, 0);

  return {
    distribution: fullDistribution.map(item => ({
      ...item,
      percentage: totalReviews > 0 ? Math.round((item.count / totalReviews) * 100) : 0
    })),
    totalReviews
  };
};

// Static method to get user's reviews
ProductReviewSchema.statics.getUserReviews = function (userId: string, options: any = {}) {
  const { limit = 10, skip = 0 } = options;

  return this.find({ user: userId })
    .populate('product', 'name images slug')
    .sort({ createdAt: -1 })
    .limit(limit)
    .skip(skip);
};

// Static method to check if user has already reviewed a product
ProductReviewSchema.statics.hasUserReviewed = async function (
  userId: string,
  productId: string
) {
  const review = await this.findOne({
    user: userId,
    product: productId
  });

  return !!review;
};

// Instance method to approve review
ProductReviewSchema.methods.approve = async function (moderatorId: string, note?: string) {
  this.status = 'approved';
  this.moderatedBy = new mongoose.Types.ObjectId(moderatorId);
  this.moderatedAt = new Date();
  if (note) this.moderatorNote = note;

  return this.save();
};

// Instance method to reject review
ProductReviewSchema.methods.reject = async function (moderatorId: string, note: string) {
  this.status = 'rejected';
  this.moderatedBy = new mongoose.Types.ObjectId(moderatorId);
  this.moderatedAt = new Date();
  this.moderatorNote = note;

  return this.save();
};

// Instance method to add reply
ProductReviewSchema.methods.addReply = async function (content: string, userId: string) {
  this.reply = {
    content,
    repliedBy: new mongoose.Types.ObjectId(userId),
    repliedAt: new Date()
  };

  return this.save();
};

// Instance method to mark as helpful
ProductReviewSchema.methods.markHelpful = async function (userId: string) {
  const userIdObj = new mongoose.Types.ObjectId(userId);

  // Check if user already voted
  const hasVoted = this.helpfulVotes.some((id: mongoose.Types.ObjectId) => id.equals(userIdObj));

  if (!hasVoted) {
    this.helpfulVotes.push(userIdObj);
    this.helpfulCount += 1;
    await this.save();
  }

  return this;
};

// Instance method to mark as not helpful
ProductReviewSchema.methods.markNotHelpful = async function () {
  this.notHelpfulCount += 1;
  return this.save();
};

// Model
const ProductReview = mongoose.model<IProductReview, IProductReviewModel>(
  'ProductReview',
  ProductReviewSchema
);

export default ProductReview;

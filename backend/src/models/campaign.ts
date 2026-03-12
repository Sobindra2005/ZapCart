import mongoose from "mongoose";

export interface ICampaign {
    name: string;
    description?: string;
    products?: mongoose.Types.ObjectId[];
    status: 'upcoming' | 'active' | 'expired' | 'paused';
    discountType: 'percentage' | 'fixed' | 'buy-one-get-one';
    discountValue: number;
    startDate: Date;
    endDate: Date;
    image?: string;
    createdBy: number;
    createdAt?: Date;
    updatedAt?: Date;
}

const campaignSchema = new mongoose.Schema<ICampaign>({
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    products: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
        }
    ],
    status: {
        type: String,
        enum: ['upcoming', 'active', 'expired', 'paused'],
        default: 'upcoming'
    },
    discountType: {
        type: String,
        enum: ['percentage', 'fixed', 'buy-one-get-one'],
        default: 'percentage'
    },
    discountValue: {
        type: Number,
        default: 0
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    createdBy: {
        type: Number,
        required: true
    },
    image: {
        type: String,
        default: null
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});

campaignSchema.pre('save', function () {
    const now = new Date();

    if (!this.startDate || !this.endDate) {
        return;
    }

    // Keep the date window logically valid.
    if (this.endDate < this.startDate) {
        throw new Error('endDate cannot be earlier than startDate');
    }

    // A completed campaign must always be expired.
    if (now > this.endDate) {
        this.status = 'expired';
        return;
    }

    // During campaign window, invalid statuses are paused by default.
    if (now >= this.startDate && now <= this.endDate) {
        if (!['active', 'paused'].includes(this.status)) {
            this.status = 'paused';
        }
        return;
    }

    // Before campaign starts, expired/active states are reset.
    if (now < this.startDate && ['active', 'expired'].includes(this.status)) {
        this.status = 'upcoming';
    }

});


export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);

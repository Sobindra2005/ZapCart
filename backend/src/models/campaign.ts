import mongoose from "mongoose";

export interface ICampaign {
    name: string;
    description?: string;
    products: mongoose.Types.ObjectId[];
    status: 'upcoming' | 'active' | 'expired' | 'paused';
    discountType: 'percentage' | 'fixed' | 'buy-one-get-one';
    discountValue: number;
    startDate: Date;
    endDate: Date;
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
            default: []
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
    }
}, {
    timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' }
});


export const Campaign = mongoose.model<ICampaign>('Campaign', campaignSchema);

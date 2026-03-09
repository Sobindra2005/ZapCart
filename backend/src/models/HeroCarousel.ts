import mongoose, { Schema } from "mongoose";
import { Campaign, ICampaign } from "./campaign";


export interface IHeroCarousel extends Document {
    title?: string;
    description?: string;
    image: string;
    link: string;
    buttonLabel?: string;
    status: 'archived' | 'published' | 'draft';
    order?: number;
    createdBy?: number;
    createdAt: Date;
    updatedAt: Date;
}

const HeroCarouselSchema = new Schema<IHeroCarousel>(
    {
        title: {
            type: String,
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters'],
            default: null
        },
        description: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters'],
            default: null
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true
        },
        buttonLabel: {
            type: String,
            trim: true,
            maxlength: [50, 'Button label cannot exceed 50 characters'],
            default: null
        },
        link: {
            type: String,
            trim: true,
            required: [true, 'Link URL is required'],
        },
        status: {
            type: String,
            enum: ['archived', 'published', 'draft'],
            default: 'draft',
            index: true
        },
        createdBy: {
            type: Number,
            required: true
        },
        order: {
            type: Number,
            default: 0,
            unique: true,
        }
    },
    {
        timestamps: true
    }
);

HeroCarouselSchema.pre('save', async function () {
    if (this.isNew && (this.order === undefined || this.order === 0)) {
        const lastDoc = await mongoose.model<IHeroCarousel>('HeroCarousel')
            .findOne({})
            .sort({ order: -1 })
            .select('order')
            .lean();
        this.order = lastDoc && typeof lastDoc.order === 'number' ? lastDoc.order + 1 : 1;
    }
});

HeroCarouselSchema.post('save', async function (doc) {
    if (this.isNew) {
         const campaignData: Partial<ICampaign> = {
            name: doc.title || 'Untitled Campaign',
            description: doc.description || '',
            products: [] as mongoose.Types.ObjectId[],
            status: 'upcoming',
            discountType: 'percentage',
            discountValue: 0,
            startDate: new Date(),
            endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            createdBy: doc.createdBy,
            image: doc.image
         };
         await Campaign.create(campaignData);
    }
});


const HeroCarousel = mongoose.model<IHeroCarousel>('HeroCarousel', HeroCarouselSchema);

export default HeroCarousel;
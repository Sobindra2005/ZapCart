import mongoose, { Schema } from "mongoose";


export interface IHeroCarousel {
    title: string;
    description?: string;
    image: string;
    link?: string;
    status: 'archived' | 'published' | 'draft';
    order: number;
    createdBy?: number;
    createdAt: Date;
    updatedAt: Date;
}

const HeroCarouselSchema = new Schema<IHeroCarousel>(
    {
        title: {
            type: String,
            required: [true, 'Title is required'],
            trim: true,
            maxlength: [200, 'Title cannot exceed 200 characters']
        },
        description: {
            type: String,
            maxlength: [1000, 'Description cannot exceed 1000 characters']
        },
        image: {
            type: String,
            required: [true, 'Image URL is required'],
            trim: true
        },
        link: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ['archived', 'published', 'draft'],
            default: 'draft',
            index: true
        },
        createdBy: {
            type: Number,
            ref: 'User'
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

const HeroCarousel = mongoose.model<IHeroCarousel>('HeroCarousel', HeroCarouselSchema);

export default HeroCarousel;
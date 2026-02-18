import mongoose, { Schema } from "mongoose";


export interface IHeroCarousel {
    title: string;
    description?: string;
    image: string;
    link?: string;
    status: 'archived' | 'published' | 'draft';
    createdBy?:number;
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
        }
    },
    {
        timestamps: true
    }
);

const HeroCarousel = mongoose.model<IHeroCarousel>('HeroCarousel', HeroCarouselSchema);

export default HeroCarousel;
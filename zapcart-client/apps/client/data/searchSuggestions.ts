export interface SearchProduct {
    _id: string;
    entityType: string;
    brand: string;
    name: string;
    basePrice: number;
    rating: number;
    thumbnail: string;
    entityId: string;
}

export interface PopularCategory {
    id: string;
    name: string;
    itemCount: string;
    icon: string;
}

export const popularCategoriesSearch: PopularCategory[] = [
    {
        id: "1",
        name: "Furniture",
        itemCount: "240 Item Available",
        icon: "🛋️",
    },
    {
        id: "2",
        name: "Headphone",
        itemCount: "240 Item Available",
        icon: "🎧",
    },
    {
        id: "3",
        name: "Shoe",
        itemCount: "240 Item Available",
        icon: "👟",
    },
    {
        id: "4",
        name: "Bag",
        itemCount: "240 Item Available",
        icon: "👜",
    },
    {
        id: "5",
        name: "Laptop",
        itemCount: "240 Item Available",
        icon: "💻",
    },
    {
        id: "6",
        name: "Book",
        itemCount: "240 Item Available",
        icon: "📚",
    },
];

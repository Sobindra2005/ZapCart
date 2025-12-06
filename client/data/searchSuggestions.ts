export interface SearchProduct {
    id: string;
    name: string;
    price: number;
    image: string;
    rating: number;
    reviews: number;
}

export const searchProducts: SearchProduct[] = [
    {
        id: "1",
        name: "Wireless Earbuds",
        price: 89.00,
        image: "/products/earbuds.jpg",
        rating: 4.5,
        reviews: 121,
    },
    {
        id: "2",
        name: "Wireless Earbuds Pro",
        price: 599.00,
        image: "/products/airpods-max.jpg",
        rating: 5.0,
        reviews: 121,
    },
    {
        id: "3",
        name: "Bose Bt Earphones",
        price: 89.00,
        image: "/products/bose-bt.jpg",
        rating: 4.5,
        reviews: 121,
    },
    {
        id: "4",
        name: "Beats solo3",
        price: 199.95,
        image: "/products/vivefox.jpg",
        rating: 4.5,
        reviews: 121,
    },
    {
        id: "5",
        name: "Tao Tronics Earbuds",
        price: 59.00,
        image: "/products/earbuds.jpg",
        rating: 4.5,
        reviews: 121,
    },
];

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

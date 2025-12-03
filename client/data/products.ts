import { Product } from "@/types/product";

export const sampleProducts: Product[] = [
    {
        id: "1",
        name: "Wireless Earbuds, IPX8",
        description: "Organic Cotton, fairtrade certified",
        price: 89.00,
        image: "/products/earbuds.jpg",
        rating: 4.5,
        reviews: 121,
        category: "Wireless Earbuds"
    },
    {
        id: "2",
        name: "AirPods Max",
        description: "A perfect balance of high-fidelity audio",
        price: 559.00,
        image: "/products/airpods-max.jpg",
        rating: 5.0,
        reviews: 0,
        category: "Over-Ear Headphones"
    },
    {
        id: "3",
        name: "Bose BT Earphones",
        description: "Table with air purifier, stained venner/black",
        price: 289.00,
        image: "/products/bose-bt.jpg",
        rating: 4.0,
        reviews: 0,
        category: "Wireless Earphones"
    },
    {
        id: "4",
        name: "VIVEFOX Headphones",
        description: "Wired Stereo Headsets With Mic",
        price: 39.00,
        image: "/products/vivefox.jpg",
        rating: 4.5,
        reviews: 0,
        category: "Wired Headphones"
    }
];

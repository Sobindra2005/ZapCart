import { Product } from "@/types/product";

export const sampleProducts: Product[] = [
    {
        id: "1",
        name: "Loose Fit Hoodie",
        description: "Organic Cotton, fairtrade certified",
        detailedDescription: "Loose-fit sweatshirt hoodie in medium weight cotton-blend fabric with a generous, but not oversized silhouette. Jersey-lined, drawstring hood, dropped shoulders, long sleeves, and a kangaroo pocket. Wide ribbing at cuffs and hem. Soft, brushed inside.",
        price: 24.99,
        image: "/products/hoodie-1.jpg",
        images: [
            "/products/hoodie-1.jpg",
            "/products/hoodie-2.jpg",
            "/products/hoodie-3.jpg",
            "/products/hoodie-4.jpg"
        ],
        rating: 4.5,
        reviewCount: 60,
        category: "Men Fashion",
        sizes: ["S", "M", "L", "XL", "XXL"],
        shippingInfo: {
            discount: "Dec 50%",
            packageType: "Regular Postage",
            deliveryTime: "3-4 Working Days",
            estimatedDelivery: "10 - 12 October 2024"
        },
        reviews: [
            {
                id: "r1",
                userId: "u1",
                userName: "Alex Mathio",
                rating: 5,
                title: "Excellent quality and ethical processes",
                comment: "Sustainability and ethical processes resonate strongly with today's consumers, positioning the brand as a responsible choice in the fashion world.",
                date: "13 Oct 2024"
            },
            {
                id: "r2",
                userId: "u2",
                userName: "Sarah Johnson",
                rating: 4,
                title: "Great fit and comfortable",
                comment: "The hoodie fits perfectly and is very comfortable. Slightly overpriced but good quality overall. Would recommend to friends.",
                date: "12 Oct 2024"
            },
            {
                id: "r3",
                userId: "u3",
                userName: "Mike Chen",
                rating: 5,
                title: "Love the loose fit",
                comment: "Love the loose fit and the material is so soft. Highly recommend!",
                date: "08 Oct 2024"
            }
        ]
    },
    {
        id: "2",
        name: "AirPods Max",
        description: "A perfect balance of high-fidelity audio",
        detailedDescription: "AirPods Max combine high-fidelity audio with industry-leading Active Noise Cancellation to deliver an unparalleled listening experience. Each part of their custom-built driver works to produce sound with ultra-low distortion across the audible range.",
        price: 559.00,
        image: "/products/airpods-max.jpg",
        images: [
            "/products/airpods-max.jpg",
            "/products/airpods-max-2.jpg",
            "/products/airpods-max-3.jpg",
            "/products/airpods-max-4.jpg"
        ],
        rating: 4.8,
        reviewCount: 245,
        category: "Over-Ear Headphones",
        shippingInfo: {
            discount: "Free Shipping",
            packageType: "Express Delivery",
            deliveryTime: "1-2 Working Days",
            estimatedDelivery: "08 - 09 October 2024"
        },
        reviews: [
            {
                id: "r4",
                userId: "u4",
                userName: "Emily Davis",
                rating: 5,
                comment: "Best headphones I've ever owned. The sound quality is incredible!",
                date: "05 Oct 2024"
            },
            {
                id: "r5",
                userId: "u5",
                userName: "James Wilson",
                rating: 4,
                comment: "Great sound and noise cancellation, but a bit pricey.",
                date: "03 Oct 2024"
            }
        ]
    },
    {
        id: "3",
        name: "Bose BT Earphones",
        description: "Premium wireless earphones with superior sound",
        detailedDescription: "Experience premium sound quality with Bose Bluetooth Earphones. Featuring advanced noise cancellation technology and comfortable fit for all-day wear.",
        price: 289.00,
        image: "/products/bose-bt.jpg",
        images: [
            "/products/bose-bt.jpg",
            "/products/bose-bt-2.jpg",
            "/products/bose-bt-3.jpg",
            "/products/bose-bt-4.jpg"
        ],
        rating: 4.3,
        reviewCount: 128,
        category: "Wireless Earphones",
        shippingInfo: {
            discount: "Dec 30%",
            packageType: "Regular Postage",
            deliveryTime: "2-3 Working Days",
            estimatedDelivery: "09 - 11 October 2024"
        },
        reviews: [
            {
                id: "r6",
                userId: "u6",
                userName: "Lisa Anderson",
                rating: 4,
                comment: "Good sound quality and comfortable to wear for long periods.",
                date: "01 Oct 2024"
            }
        ]
    },
    {
        id: "4",
        name: "VIVEFOX Headphones",
        description: "Wired Stereo Headsets With Mic",
        detailedDescription: "Professional wired headphones with crystal clear audio and built-in microphone. Perfect for gaming, music, and calls.",
        price: 39.00,
        image: "/products/vivefox.jpg",
        images: [
            "/products/vivefox.jpg",
            "/products/vivefox-2.jpg",
            "/products/vivefox-3.jpg",
            "/products/vivefox-4.jpg"
        ],
        rating: 4.1,
        reviewCount: 89,
        category: "Wired Headphones",
        shippingInfo: {
            discount: "Dec 20%",
            packageType: "Regular Postage",
            deliveryTime: "3-5 Working Days",
            estimatedDelivery: "10 - 14 October 2024"
        },
        reviews: [
            {
                id: "r7",
                userId: "u7",
                userName: "Tom Brown",
                rating: 4,
                comment: "Great value for money. Sound quality is decent for the price.",
                date: "28 Sep 2024"
            }
        ]
    }
];

export const flashSaleProducts: Product[] = [
    {
        id: "fs-1",
        name: "Premium Wireless Earbuds",
        description: "Active noise cancellation and transparency mode.",
        detailedDescription: "Experience immersive sound with our premium wireless earbuds...",
        price: 129.99,
        image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&q=80",
        rating: 4.8,
        reviewCount: 342,
        category: "Electronics",
        shippingInfo: {
            discount: "50% OFF",
            packageType: "Box",
            deliveryTime: "Quick delivery",
            estimatedDelivery: "Tomorrow"
        }
    },
    {
        id: "fs-2",
        name: "Smart Watch Series X",
        description: "Advanced health tracking and always-on display.",
        price: 299.99,
        image: "https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800&q=80",
        rating: 4.9,
        reviewCount: 156,
        category: "Electronics",
        shippingInfo: {
            discount: "20% OFF",
            packageType: "Box",
            deliveryTime: "1 week",
            estimatedDelivery: "Next Monday"
        }

    },
    {
        id: "fs-3",
        name: "Ultraboost Running Shoes",
        description: "Responsive cushioning for an energized run.",
        price: 89.99,
        image: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&q=80",
        rating: 4.7,
        reviewCount: 89,
        category: "Footwear",
    },
    {
        id: "fs-4",
        name: "Designer Sunglasses",
        description: "UV protection with a classic style.",
        price: 159.50,
        image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80",
        rating: 4.6,
        reviewCount: 120,
        category: "Accessories",
    },
    {
        id: "fs-5",
        name: "Gaming Console",
        description: "Next-gen gaming performance.",
        price: 499.99,
        image: "https://images.unsplash.com/photo-1481437156560-3205f6a55735?w=800&q=80",
        rating: 4.9,
        reviewCount: 1200,
        category: "Electronics",
    },
    {
        id: "fs-6",
        name: "4K Action Camera",
        description: "Capture your adventures in stunning detail.",
        price: 249.99,
        image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&q=80",
        rating: 4.5,
        reviewCount: 67,
        category: "Electronics",
    }
];


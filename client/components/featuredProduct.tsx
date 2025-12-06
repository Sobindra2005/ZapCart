"use client"

import Image from "next/image"
import { Button } from "@/components/ui/button"
import { MainContainer } from "./wrapper"

export function FeaturedProducts() {
    const heroProduct = {
        title: "Premium Wireless Earbuds",
        price: 129.99,
        oldPrice: 199.99,
        image: "/premium-wireless-earbuds.jpg",
    }

    const gridProducts = [
        { title: "Portable Speaker", price: 79.99, image: "/portable-speaker.png" },
        { title: "Phone Stand", price: 24.99, image: "/phone-stand.jpg" },
        { title: "Screen Protector", price: 12.99, image: "/screen-protector.png" },
        { title: "Power Bank", price: 49.99, image: "/portable-power-bank.png" },
        { title: "Charger", price: 34.99, image: "/fast-charger.jpg" },
        { title: "Cable Organizer", price: 9.99, image: "/cable-organizer.png" },
    ]

    return (
        <MainContainer spacing={true}>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground ">Featured Products</h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Large Featured Product */}
                <div className="lg:col-span-1 lg:row-span-2 group relative rounded-xl overflow-hidden bg-muted">
                    <div className="relative w-full h-96 lg:h-full min-h-96">
                        <Image
                            src={heroProduct.image || "/placeholder.svg"}
                            alt={heroProduct.title}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300 bg-orange-500"
                            sizes="(max-width: 1024px) 100vw, 33vw"
                        />
                    </div>

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex flex-col justify-end p-6">
                        <h3 className="text-2xl font-bold text-white mb-2">{heroProduct.title}</h3>
                        <div className="flex items-end gap-3 mb-4">
                            <span className="text-3xl font-bold text-accent">${heroProduct.price}</span>
                            <span className="text-lg text-white/70 line-through">${heroProduct.oldPrice}</span>
                        </div>
                        <Button className=" bg-red-400 hover:bg-red-600 w-full">Shop Now</Button>
                    </div>
                </div>

                {/* Grid Products */}
                <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-6">
                    {gridProducts.map((product, idx) => (
                        <div key={idx} className="group relative rounded-xl overflow-hidden bg-muted cursor-pointer">
                            <div className="relative w-full aspect-square">
                                <Image
                                    src={product.image || "/placeholder.svg"}
                                    alt={product.title}
                                    fill
                                    className="object-cover group-hover:scale-110 transition-transform duration-300 bg-blue-500"
                                    sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                />
                            </div>

                            {/* Overlay */}
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex flex-col justify-end p-3">
                                <h4 className="text-white font-semibold text-sm mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                    {product.title}
                                </h4>
                                <p className="text-accent font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                    ${product.price}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>

        </MainContainer>
    )
}

"use client";

import Image from "next/image";

export default function ProductNotFound() {
    return (
        <div className=" flex items-center justify-center px-4 ">
            <div className="relative w-72 h-72 sm:w-96 sm:h-96 md:w-[500px] md:h-[500px] lg:w-[600px] lg:h-[600px]">
                <Image
                    src="/images/product-not-found.png"
                    alt="Product Not Found" 
                    fill
                    className="object-contain"
                    priority
                />
            </div>
        </div>
    );
}

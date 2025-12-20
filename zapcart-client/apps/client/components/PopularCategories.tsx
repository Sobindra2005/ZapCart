"use client";

import { popularCategories } from "@/data/categories";
import Image from "next/image";
import { MainContainer } from "./wrapper";
import { SectionHeader, SectionViewAllMobile } from "./SectionHeader";

export function PopularCategories() {
    return (
        <MainContainer className="container" spacing={true}>
            <SectionHeader
                title="Popular Categories"
                viewAllLink="/categories"
            />

            <div className="grid grid-cols-5 auto-rows-fr gap-2 md:gap-4 border-black" style={{ aspectRatio: '5/2' }}>
                {popularCategories.slice(0, 6).map((category, index) => {
                    const gridAreaMap: { [key: number]: string } = {
                        0: "1 / 1 / 2 / 3", // div1: spans cols 1-2, row 1
                        1: "1 / 3 / 2 / 4", // div2: col 3, row 1
                        2: "1 / 4 / 2 / 6", // div3: col 4-5, row 1
                        3: "2 / 1 / 3 / 2", // div4: col 1, row 2
                        4: "2 / 2 / 3 / 3", // div5: col 2, row 2
                        5: "2 / 3 / 3 / 6", // div6: spans cols 3-5, row 2
                    };
                    
                    return (
                        <div
                            key={category.id}
                            className="group relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 hover:shadow-lg"
                            style={{ gridArea: gridAreaMap[index] }}
                        >
                        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-transparent z-10" />
                        
                        <Image
                            src={category.image}
                            alt={category.name}
                            fill
                            className="object-cover transition-transform duration-500 group-hover:scale-110"
                            sizes="(max-width: 768px) 50vw, 33vw"
                        />

                        <div className="absolute bottom-0 left-0 right-0 p-2 md:p-4 z-20">
                            <div className="flex items-end justify-between">
                                <div>
                                    <h3 className="font-bold text-white mb-1 text-xs md:text-lg">
                                        {category.name}
                                    </h3>
                                    <p className="text-white/90 text-[10px] md:text-xs">
                                        {category.itemCount} Products
                                    </p>
                                </div>
                                

                            </div>
                        </div>

                        <div className="absolute inset-0 border-2 border-transparent group-hover:border-white/20 rounded-lg transition-colors z-20 pointer-events-none" />
                    </div>
                    );
                })}
            </div>

            <SectionViewAllMobile href="/categories" text="View All Categories" />
        </MainContainer>
    );
}

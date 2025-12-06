"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MainContainer } from "./wrapper";
import { useState } from "react";

export function Header() {
    const [isSearchFocused, setIsSearchFocused] = useState(false);

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <MainContainer className="container flex h-16 items-center justify-between">
                {/* Logo */}
                <Link href="/" className="hidden   md:flex items-center ">
                    <div className="flex h-14 w-42 items-center justify-center">
                        <Image src="/logo.png" alt="Logo" width={168} height={56} />
                    </div>
                </Link>

                {/* Navigation */}
                <nav className="items-center gap-6 flex flex-1 max-w-3xl">
                    <button className="hidden md:flex items-center gap-1 text-sm font-medium hover:text-emerald-600 transition-colors whitespace-nowrap">
                        Categories
                        <ChevronDown className="h-4 w-4" />
                    </button>

                    <div className="flex items-center gap-6 flex-1">
                        <Link
                            href="/deals"
                            className={`hidden md:flex text-sm font-medium hover:text-emerald-600 transition-all duration-300 whitespace-nowrap ${isSearchFocused ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                                }`}
                        >
                            Deals
                        </Link>
                        <Link
                            href="/new"
                            className={`hidden md:flex text-sm font-medium hover:text-emerald-600 transition-all duration-300 whitespace-nowrap ${isSearchFocused ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                                }`}
                        >
                            What&apos;s New
                        </Link>
                        <Link
                            href="/delivery"
                            className={`hidden md:flex text-sm font-medium hover:text-emerald-600 transition-all duration-300 whitespace-nowrap ${isSearchFocused ? 'opacity-0 w-0 overflow-hidden' : 'opacity-100'
                                }`}
                        >
                            Delivery
                        </Link>

                        <div className={` flex-1  lg:block transition-all duration-300 ${isSearchFocused ? 'ml-0' : 'ml-8'
                            }`}>
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search Product"
                                    className="pl-10 bg-gray-50 border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                                    onFocus={() => setIsSearchFocused(true)}
                                    onBlur={() => setIsSearchFocused(false)}
                                />
                            </div>
                        </div>
                    </div>

                </nav>


                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="lg" className="hidden md:flex">
                        <User className="h-6 w-6" />
                        <span className="">Account</span>
                    </Button>
                    <Button variant="ghost" size="lg" className="relative">
                        <ShoppingCart className="h-6 w-6" />
                        <span className="">Cart</span>
                    </Button>
                </div>
            </MainContainer>
        </header>
    );
}


// function 
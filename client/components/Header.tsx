"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white">
            <div className="container mx-auto flex h-16 items-center justify-between px-4 md:px-6">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-md bg-emerald-600">
                        <ShoppingCart className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-xl font-bold">Shopcart</span>
                </Link>

                {/* Navigation */}
                <nav className="hidden items-center gap-6 md:flex">
                    <button className="flex items-center gap-1 text-sm font-medium hover:text-emerald-600 transition-colors">
                        Categories
                        <ChevronDown className="h-4 w-4" />
                    </button>
                    <Link href="/deals" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                        Deals
                    </Link>
                    <Link href="/new" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                        What&apos;s New
                    </Link>
                    <Link href="/delivery" className="text-sm font-medium hover:text-emerald-600 transition-colors">
                        Delivery
                    </Link>
                </nav>

                {/* Search Bar */}
                <div className="hidden flex-1 max-w-md mx-8 lg:block">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                            type="search"
                            placeholder="Search Product"
                            className="pl-10 bg-gray-50 border-gray-200"
                        />
                    </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="hidden md:flex">
                        <User className="h-5 w-5" />
                        <span className="sr-only">Account</span>
                    </Button>
                    <Button variant="ghost" size="icon" className="relative">
                        <ShoppingCart className="h-5 w-5" />
                        <span className="sr-only">Cart</span>
                    </Button>
                </div>
            </div>
        </header>
    );
}

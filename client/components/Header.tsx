"use client";

import Link from "next/link";
import { Search, ShoppingCart, User, ChevronDown, Star } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { MainContainer } from "./wrapper";
import { useState, useEffect, useRef } from "react";
import { searchProducts, popularCategoriesSearch, SearchProduct, PopularCategory } from "@/data/searchSuggestions";
import { motion } from "framer-motion";
import { useCart } from "@/contexts/CartContext";

export function Header() {
    const [isSearchFocused, setIsSearchFocused] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [filteredProducts, setFilteredProducts] = useState<SearchProduct[]>([]);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const { getTotalItems } = useCart();
    const totalItems = getTotalItems();

    // Filter products based on search query
    useEffect(() => {
        if (searchQuery.trim()) {
            const filtered = searchProducts.filter((product) =>
                product.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredProducts(filtered);
        } else {
            setFilteredProducts([]);
        }
    }, [searchQuery]);

    // Handle click outside to close dropdown
    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsSearchFocused(false);
            }
        }

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const showDropdown = isSearchFocused;
    const showPopularCategories = showDropdown && !searchQuery.trim();
    const showProductSuggestions = showDropdown && searchQuery.trim() && filteredProducts.length > 0;

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
                            <div className="relative" ref={dropdownRef}>
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground z-10" />
                                <Input
                                    type="search"
                                    placeholder="Search Product"
                                    className="pl-10 bg-gray-50 border-0 focus-visible:border-0 focus-visible:ring-0 focus-visible:ring-offset-0 w-full"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onFocus={() => setIsSearchFocused(true)}
                                />

                                {/* Dropdown */}
                                {showDropdown && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 40 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 0.3 }}
                                        className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-[500px] overflow-y-auto z-50">
                                        {/* Popular Categories */}
                                        {showPopularCategories && (
                                            <motion.div
                                                initial={{ opacity: 0}}
                                                animate={{ opacity: 1}}
                                                transition={{ duration:0.5 }}
                                                className="p-4">
                                                <h3 className="text-sm font-semibold text-gray-900 mb-4">Popular Categories</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {popularCategoriesSearch.map((category) => (
                                                        <CategoryCard key={category.id} category={category} />
                                                    ))}
                                                </div>
                                            </motion.div>
                                        )}

                                        {/* Product Suggestions */}
                                        {showProductSuggestions && (
                                            <motion.div
                                                initial={{ opacity: 0}}
                                                animate={{ opacity: 1}}
                                                transition={{ duration:0.5 }} className="py-2">
                                                {filteredProducts.map((product) => (
                                                    <ProductSuggestion key={product.id} product={product} />
                                                ))}
                                            </motion.div>
                                        )}

                                        {/* No Results */}
                                        {showDropdown && searchQuery.trim() && filteredProducts.length === 0 && (
                                            <motion.div
                                                initial={{ opacity: 0}}
                                                animate={{ opacity: 1}}
                                                transition={{ duration:0.5 }}
                                                className="p-8 text-center text-gray-500">
                                                <p className="text-sm">No products found for &quot;{searchQuery}&quot;</p>
                                            </motion.div>
                                        )}
                                    </motion.div>
                                )}
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
                    <Link href="/cart">
                        <Button variant="ghost" size="lg" className="relative">
                            <ShoppingCart className="h-6 w-6" />
                            <span className="">Cart</span>
                            {totalItems > 0 && (
                                <span className="absolute -top-1 -right-1 bg-orange-600 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                                    {totalItems}
                                </span>
                            )}
                        </Button>
                    </Link>
                </div>
            </MainContainer>
        </header>
    );
}

// Category Card Component
function CategoryCard({ category }: { category: PopularCategory }) {
    return (
        <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer">
            <div className="shrink-0 w-12 h-12 bg-white rounded-lg flex items-center justify-center text-2xl shadow-sm">
                {category.icon}
            </div>
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-semibold text-gray-900 truncate">{category.name}</h4>
                <p className="text-xs text-gray-500 truncate">{category.itemCount}</p>
            </div>
        </div>
    );
}

// Product Suggestion Component
function ProductSuggestion({ product }: { product: SearchProduct }) {
    return (
        <div className="flex items-center gap-4 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer">
            {/* Product Image */}
            <div className="shrink-0 w-12 h-12 bg-gray-100 rounded-lg overflow-hidden relative">
                <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    className="object-cover"
                    sizes="48px"
                />
            </div>

            {/* Product Info */}
            <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-900 truncate">{product.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                    {/* Rating */}
                    <div className="flex items-center gap-1">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                className={`w-3 h-3 ${i < Math.floor(product.rating)
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "fill-gray-200 text-gray-200"
                                    }`}
                            />
                        ))}
                    </div>
                    <span className="text-xs text-gray-500">({product.reviews})</span>
                </div>
            </div>

            {/* Price */}
            <div className="shrink-0">
                <p className="text-sm font-semibold text-gray-900">₹{product.price.toFixed(2)}</p>
            </div>
        </div>
    );
} 
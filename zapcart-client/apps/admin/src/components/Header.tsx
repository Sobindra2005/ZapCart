"use client";

import { Search, Bell, ChevronDown } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

interface HeaderProps {
    title: string;
}

export function Header({ title }: HeaderProps) {
    return (
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-gray-200 bg-white/80 backdrop-blur-md px-8">
            <h1 className="text-xl font-bold text-gray-900">{title}</h1>

            <div className="flex items-center gap-6">

                {/* Notifications */}
                <Link href="/notifications" className="relative text-gray-400 hover:text-gray-600">
                    <Bell className="h-5 w-5" />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-red-500 border-2 border-white"></span>
                </Link>

                {/* User Profile */}
                <div className="flex items-center gap-3 cursor-pointer group">
                    <div className="h-8 w-8 overflow-hidden rounded-full border border-gray-200">
                        <Image
                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                            alt="User"
                            width={32}
                            height={32}
                        />
                    </div>
                    <ChevronDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600 transition-colors" />
                </div>
            </div>
        </header>
    );
}

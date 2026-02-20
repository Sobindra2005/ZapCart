"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    LayoutDashboard,
    ShoppingBag,
    Tag,
    BarChart3,
    Users,
    Settings,
    LogOut,
    Megaphone,
    ChevronDown,
    Bell,
    ChevronUp,
    ChevronLeft,
    ChevronRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useSidebar } from "@/lib/SidebarContext";

const sidebarItems = [
    { name: "Dashboard", icon: LayoutDashboard, href: "/" },
    {
        name: "Products",
        icon: ShoppingBag,
        href: "/products",
        subItems: [
            { name: "Product List", href: "/products/list" },
            { name: "Categories", href: "/products/categories" }
        ]
    },
    {
        name: "Marketing",
        icon: Megaphone,
        href: "/marketing",
        subItems: [
            { name: "Flash Sales", href: "/marketing/flash-sales" },
            { name: "Hero Carousel", href: "/marketing/hero-carousel" },
            { name: "Featured Products", href: "/marketing/featured-products" }
        ]
    },
    { name: "Sales", icon: Tag, href: "/sales" },
    { name: "Customers", icon: Users, href: "/customers" },
    { name: "Analytics", icon: BarChart3, href: "/analytics" },
    { name: "Notifications", icon: Bell, href: "/notifications" },
    { name: "Settings", icon: Settings, href: "/settings" },
];

export function Sidebar() {
    const pathname = usePathname();
    const { isCollapsed, toggleSidebar } = useSidebar();
    const [openMenus, setOpenMenus] = useState<string[]>(["Products"]);

    const toggleMenu = (name: string) => {
        if (isCollapsed) return;
        setOpenMenus(prev =>
            prev.includes(name)
                ? prev.filter(m => m !== name)
                : [...prev, name]
        );
    };

    return (
        <aside
            className={cn(
                "fixed left-0 top-0 z-40 h-screen transition-all duration-300 ease-in-out",
                isCollapsed ? "w-20" : "w-64"
            )}
        >
            <div className="h-full flex flex-col py-6 border-r border-gray-200 bg-white overflow-y-auto overflow-x-hidden">
                {/* Logo */}
                <div className={cn(
                    "flex items-center gap-2 px-6 mb-10 transition-all duration-300",
                    isCollapsed ? "justify-center px-0" : ""
                )}>
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 flex-shrink-0">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-6 h-6 text-primary">
                            <path d="M12 12c.5-2.5 3.5-3.5 4.5-1s-3 4.5-4.5 4.5S7.5 13.5 8.5 11s4-1.5 4.5 1z" />
                            <path d="M12 12c-2.5.5-3.5 3.5-1 4.5s4.5-3 4.5-4.5S13.5 7.5 11 8.5s-1.5 4 1 4.5z" />
                        </svg>
                    </div>
                    {!isCollapsed && <span className="text-xl font-bold tracking-tight text-gray-900 transition-opacity duration-300">ZapCart</span>}
                </div>

                {/* Navigation */}
                <nav className="flex-1 space-y-1 px-4">
                    {sidebarItems.map((item) => {
                        const isActive = item.href === "/"
                            ? pathname === "/"
                            : pathname.startsWith(item.href);

                        const isOpen = openMenus.includes(item.name) && !isCollapsed;

                        return (
                            <div key={item.name}>
                                {item.subItems ? (
                                    <>
                                        <button
                                            onClick={() => toggleMenu(item.name)}
                                            title={isCollapsed ? item.name : ""}
                                            className={cn(
                                                "flex w-full items-center rounded-lg py-2 text-sm font-medium transition-all duration-200",
                                                isCollapsed ? "justify-center px-0" : "justify-between px-3",
                                                isActive ? "text-gray-900 bg-gray-50 font-bold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                            )}
                                        >
                                            <div className="flex items-center gap-3">
                                                <item.icon className={cn("h-5 w-5 shrink-0", isActive ? "text-primary" : "text-gray-400")} />
                                                {!isCollapsed && <span>{item.name}</span>}
                                            </div>
                                            {!isCollapsed && (isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />)}
                                        </button>
                                        <AnimatePresence initial={false}>
                                            {isOpen && !isCollapsed && (
                                                <motion.div
                                                    key="submenu"
                                                    initial={{ opacity: 0, y: -8, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: "auto" }}
                                                    exit={{ opacity: 0, y: -8, height: 0 }}
                                                    transition={{ duration: 0.22, ease: 'easeInOut' }}
                                                    className="mt-1 ml-4 space-y-1 overflow-hidden"
                                                >
                                                    {item.subItems.map((sub) => {
                                                        const isSubActive = pathname === sub.href;
                                                        return (
                                                            <Link
                                                                key={sub.name}
                                                                href={sub.href}
                                                                className={cn(
                                                                    "block rounded-lg px-9 py-2 text-sm font-medium transition-all duration-200",
                                                                    isSubActive ? "text-primary bg-primary/5 font-bold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                                                )}
                                                            >
                                                                {sub.name}
                                                            </Link>
                                                        );
                                                    })}
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </>
                                ) : (
                                    <Link
                                        href={item.href}
                                        title={isCollapsed ? item.name : ""}
                                        className={cn(
                                            "flex items-center rounded-lg py-2 text-sm font-medium transition-all duration-200",
                                            isCollapsed ? "justify-center px-0" : "px-3 gap-3",
                                            isActive ? "text-gray-900 bg-gray-50 font-bold" : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                                        )}
                                    >
                                        <item.icon className={cn("h-5 w-5 flex-shrink-0", isActive ? "text-primary" : "text-gray-400")} />
                                        {!isCollapsed && <span>{item.name}</span>}
                                    </Link>
                                )}
                            </div>
                        );
                    })}
                </nav>

                {/* Logout */}
                <div className="mt-auto pt-4 border-t border-gray-100 px-4">
                    <button
                        title={isCollapsed ? "Log out" : ""}
                        className={cn(
                            "flex w-full items-center rounded-lg py-2 text-sm font-medium text-gray-500 transition-all duration-200 hover:text-gray-900 hover:bg-gray-50",
                            isCollapsed ? "justify-center px-0" : "px-3 gap-3"
                        )}
                    >
                        <LogOut className="h-5 w-5 text-gray-400 flex-shrink-0" />
                        {!isCollapsed && <span>Log out</span>}
                    </button>
                </div>
            </div>

            {/* Border Toggle Button */}
            <button
                onClick={toggleSidebar}
                className="absolute right-[-14px] top-1/2 -translate-y-1/2 z-50 flex h-7 w-7 items-center justify-center rounded-full border border-gray-200 bg-white shadow-sm hover:bg-gray-50 transition-all duration-300 group"
                title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
            >
                {isCollapsed ? (
                    <ChevronRight className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                ) : (
                    <ChevronLeft className="h-4 w-4 text-gray-400 group-hover:text-primary transition-colors" />
                )}
            </button>
        </aside>
    );
}

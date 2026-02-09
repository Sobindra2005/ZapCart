"use client";

import { useSidebar } from "@/lib/SidebarContext";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { AdminCard } from "./AdminCard";
import { MoreHorizontal } from 'lucide-react'

export function LayoutWrapper({ children }: { children: React.ReactNode }) {
    const { isCollapsed } = useSidebar();
    const pathname = usePathname();

    const getPageTitle = (path: string) => {
        if (path === "/") return "Dashboard";
        const segments = path.split("/").filter(Boolean);
        if (segments.length === 0) return "Dashboard";

        const lastSegment = segments[segments.length - 1];
        return lastSegment
            .split("-")
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
    };

    const title = getPageTitle(pathname);

    // Check if current route is an auth route (login, signup, etc.)
    const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/signup");

    // For auth routes, render without sidebar and header
    if (isAuthRoute) {
        return (
            <div className="flex min-h-screen bg-background text-foreground">
                <main className="flex-1">
                    {children}
                </main>
            </div>
        );
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            <Sidebar />
            <div
                className={cn(
                    "flex flex-col min-h-screen w-full transition-all duration-300 ease-in-out",
                    isCollapsed ? "pl-20" : "pl-64"
                )}
            >
                <Header title={title} />
                <main className="flex-1">
                    {children}
                </main>
            </div>
        </div>
    );
}

interface ChartWrapperProps {
    children: React.ReactNode;
    label: string;
    topComponent?: React.ReactNode;
    className?: string;
}

export function ChartWrapper({ children, label, topComponent, className }: ChartWrapperProps) {
    return (
        <AdminCard hoverable className={cn("lg:col-span-8 overflow-hidden", className)}>
            <div className="flex justify-between items-center mb-10">
                <h2 className="text-lg font-bold text-gray-900">{label}</h2>
                <div className="flex items-center gap-4">
                    {topComponent}
                    <button className="text-gray-400 hover:text-gray-600 transition-colors">
                        <MoreHorizontal className="h-5 w-5" />
                    </button>
                </div>
            </div>
            <div className="h-75 w-full">
                {children}
            </div>
        </AdminCard>
    );
}
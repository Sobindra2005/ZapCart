"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
    User,
    MapPin,
    Package,
    Heart,
    CreditCard,
    Settings,
    LogOut
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const sidebarItems = [
    {
        title: "Profile",
        href: "/account",
        icon: User
    },
    {
        title: "Addresses",
        href: "/account/address",
        icon: MapPin
    },
    {
        title: "Orders",
        href: "/account/orders",
        icon: Package
    },
    {
        title: "Wishlist",
        href: "/account/wishlist",
        icon: Heart
    },
    {
        title: "Payments",
        href: "/account/payments",
        icon: CreditCard
    },
    {
        title: "Settings",
        href: "/account/settings",
        icon: Settings
    }
];

export function AccountSidebar({ className }: { className?: string }) {
    const pathname = usePathname();

    return (
        <div className={cn("w-full md:w-64 flex flex-col h-full bg-card border rounded-lg overflow-hidden", className)}>
            <div className="p-4 border-b bg-muted/30">
                <h2 className="font-semibold text-lg">My Account</h2>
            </div>

            <nav className="flex-1 overflow-y-auto p-2 space-y-1">
                {sidebarItems.map((item) => {
                    // exact match for root account page, startsWith for others
                    const isActive = item.href === "/account"
                        ? pathname === "/account"
                        : pathname === item.href || pathname.startsWith(`${item.href}/`);
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                        >
                            <div className={cn(
                                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors mb-1",
                                isActive
                                    ? "bg-primary/10 text-primary hover:bg-primary/15"
                                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                            )}>
                                <item.icon className="h-4 w-4" />
                                {item.title}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            <div className="p-4 border-t mt-auto">
                <Button variant="ghost" className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => console.log("Logout")}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    );
}

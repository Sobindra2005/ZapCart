"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";

interface SectionHeaderProps {
    title: string;
    subtitle?: string;
    viewAllLink?: string;
    viewAllText?: string;
    className?: string;
}

export function SectionHeader({
    title,
    subtitle,
    viewAllLink,
    viewAllText = "View All",
    className = "",
}: SectionHeaderProps) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-2 ${className}`}>
            <div>
                <h2 className="text-2xl md:text-3xl font-bold text-foreground">
                    {title}
                </h2>
                {subtitle && (
                    <p className="text-sm text-muted-foreground mt-1">
                        {subtitle}
                    </p>
                )}
            </div>
            {viewAllLink && (
                <Link
                    href={viewAllLink}
                    className="hidden sm:flex items-center gap-2 text-sm font-medium text-foreground hover:text-foreground/80 transition-colors"
                >
                    {viewAllText}
                    <ArrowRight className="w-4 h-4" />
                </Link>
            )}
        </div>
    );
}

// Mobile "View All" button for bottom of sections
export function SectionViewAllMobile({
    href,
    text = "View All",
}: {
    href: string;
    text?: string;
}) {
    return (
        <Link
            href={href}
            className="sm:hidden flex items-center justify-center gap-2 w-full mt-6 py-2 text-sm font-medium text-foreground bg-background border border-border rounded-lg hover:bg-muted transition-colors"
        >
            {text}
            <ArrowRight className="w-4 h-4" />
        </Link>
    );
}

"use client";

import { ReactNode } from "react";

interface AuthPageWrapperProps {
    children: ReactNode;
    title: string;
    description: string;
}

export function AuthPageWrapper({ children, title, description }: AuthPageWrapperProps) {
    return (
        <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">{title}</h1>
                <p className="text-muted-foreground mt-2">{description}</p>
            </div>

            {children}
        </div>
    );
}

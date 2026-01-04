"use client"

import * as React from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "./dialog"

interface FormPopupProps {
    trigger: React.ReactNode
    title: string
    description?: string
    children: React.ReactNode
    open?: boolean
    onOpenChange?: (open: boolean) => void
    className?: string
}

export function FormPopup({
    trigger,
    title,
    description,
    children,
    open,
    onOpenChange,
    className,
}: FormPopupProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className={className}>
                <DialogHeader>
                    <DialogTitle>{title}</DialogTitle>
                    {description && <DialogDescription>{description}</DialogDescription>}
                </DialogHeader>
                {children}
            </DialogContent>
        </Dialog>
    )
}

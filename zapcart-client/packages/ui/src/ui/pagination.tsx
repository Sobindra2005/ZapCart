import * as React from "react"
import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { cn } from "@repo/lib/utils"
// import { ButtonProps, buttonVariants } from "@/registry/new-york/ui/button" // Assuming we might want to use button variants later, but for now styling directly to match design

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
    className?: string;
    showPageSize?: boolean;
}

const Pagination = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
    className,
}: PaginationProps) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    // Logic to calculate page numbers to show (e.g., 1, 2, 3, ..., 8, 9)
    const getPageNumbers = () => {
        const delta = 1; // Number of pages to show around current page
        const range = [];
        const rangeWithDots = [];
        let l;

        range.push(1);

        if (totalPages <= 1) return [1];

        for (let i = currentPage - delta; i <= currentPage + delta; i++) {
            if (i < totalPages && i > 1) {
                range.push(i);
            }
        }
        range.push(totalPages);

        for (let i of range) {
            if (l) {
                if (i - l === 2) {
                    rangeWithDots.push(l + 1);
                } else if (i - l !== 1) {
                    rangeWithDots.push('...');
                }
            }
            rangeWithDots.push(i);
            l = i;
        }

        return rangeWithDots;
    };

    const pages = getPageNumbers();
    const startItem = (currentPage - 1) * itemsPerPage + 1;
    const endItem = Math.min(currentPage * itemsPerPage, totalItems);

    return (
        <div className={cn("flex items-center justify-between px-6 py-4 border-t border-gray-100", className)}>
            <p className="text-sm text-gray-500 font-medium">
                Showing <span className="text-gray-900 font-bold">{startItem}</span> to <span className="text-gray-900 font-bold">{endItem}</span> of <span className="text-gray-900 font-bold">{totalItems}</span> entries
            </p>
            <div className="flex items-center gap-1.5">
                <button
                    onClick={() => onPageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <ChevronLeft className="h-4 w-4" />
                    Prev
                </button>
                <div className="flex items-center gap-1">
                    {pages.map((page, i) => (
                        <button
                            key={i}
                            onClick={() => typeof page === 'number' ? onPageChange(page) : undefined}
                            disabled={page === '...'}
                            className={cn(
                                "w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold transition-colors",
                                page === currentPage ? "bg-primary text-white shadow-md shadow-primary/20" : "text-gray-500 hover:bg-gray-50",
                                page === '...' && "cursor-default hover:bg-transparent"
                            )}
                        >
                            {page}
                        </button>
                    ))}
                </div>
                <button
                    onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm font-bold text-gray-600 hover:bg-gray-50 rounded-lg transition-colors border border-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Next
                    <ChevronRight className="h-4 w-4" />
                </button>
            </div>
        </div>
    );
};

export { Pagination };

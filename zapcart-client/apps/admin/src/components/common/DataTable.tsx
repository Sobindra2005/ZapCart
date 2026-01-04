import React, { ReactNode } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/ui/table";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig<T> {
    key: keyof T | null;
    direction: SortDirection;
}

export interface Column<T> {
    key: string;
    label?: ReactNode;
    render?: (item: T) => ReactNode;
    sortKey?: keyof T; // If provided, enables sorting for this column
    className?: string; // For TableHead
    cellClassName?: string; // For TableCell
    align?: "left" | "center" | "right";
}

interface DataTableProps<T> {
    data: T[];
    columns: Column<T>[];
    keyExtractor: (item: T) => string | number;

    // Selection
    selectedIds?: (string | number)[];
    onSelect?: (id: string | number) => void;
    onSelectAll?: () => void;

    // Sorting
    sortConfig?: SortConfig<T>;
    onSort?: (key: keyof T) => void;

    // Styling
    className?: string;
}

function SortIcon({ isActive, direction }: { isActive: boolean; direction: SortDirection }) {
    if (!isActive || !direction) return <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />;
    return direction === "asc" ? (
        <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
        <ArrowDown className="h-4 w-4 text-primary" />
    );
}

export function DataTable<T>({
    data,
    columns,
    keyExtractor,
    selectedIds,
    onSelect,
    onSelectAll,
    sortConfig,
    onSort,
    className,
}: DataTableProps<T>) {
    const allSelected = data.length > 0 && selectedIds?.length === data.length; // Simplified check, assumes data is the current page page

    return (
        <Table className={className}>
            <TableHeader>
                <TableRow>
                    {/* Checkbox Column */}
                    {(onSelect && onSelectAll) && (
                        <TableHead className="w-10 pl-6">
                            <input
                                type="checkbox"
                                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                checked={allSelected}
                                onChange={onSelectAll}
                            />
                        </TableHead>
                    )}

                    {columns.map((column) => {
                        const isSortable = !!column.sortKey && !!onSort;
                        const isActiveSort = sortConfig?.key === column.sortKey;

                        return (
                            <TableHead
                                key={column.key}
                                className={cn(
                                    column.className,
                                    isSortable && "cursor-pointer group",
                                    column.align === "right" && "text-right",
                                    column.align === "center" && "text-center"
                                )}
                                onClick={() => isSortable && onSort?.(column.sortKey!)}
                            >
                                <div
                                    className={cn(
                                        "flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider",
                                        column.align === "right" && "justify-end",
                                        column.align === "center" && "justify-center"
                                    )}
                                >
                                    {column.label}
                                    {isSortable && (
                                        <SortIcon isActive={isActiveSort} direction={sortConfig?.direction ?? null} />
                                    )}
                                </div>
                            </TableHead>
                        )
                    })}
                </TableRow>
            </TableHeader>
            <TableBody>
                {data.map((item) => {
                    const id = keyExtractor(item);
                    const isSelected = selectedIds?.includes(id);

                    return (
                        <TableRow
                            key={id}
                            className={cn(
                                "hover:bg-gray-50/80 transition-colors group",
                                isSelected && "bg-primary/5 hover:bg-primary/10"
                            )}
                        >
                            {(onSelect) && (
                                <TableCell className="pl-6">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                        checked={isSelected}
                                        onChange={() => onSelect(id)}
                                    />
                                </TableCell>
                            )}

                            {columns.map((column) => (
                                <TableCell
                                    key={column.key}
                                    className={cn(
                                        column.cellClassName,
                                        column.align === "right" && "text-right",
                                        column.align === "center" && "text-center"
                                    )}
                                >
                                    {column.render ? column.render(item) : (item as any)[column.key]}
                                </TableCell>
                            ))}
                        </TableRow>
                    );
                })}
            </TableBody>
        </Table>
    );
}

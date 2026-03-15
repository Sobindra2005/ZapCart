"use client";

import React, { ReactNode, useEffect, useRef, useState } from "react";
import { Search, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { DocumentDownload } from "iconsax-react";
import { CSVLink } from "react-csv";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/ui/table";
import { Pagination } from "@repo/ui/ui/pagination";
import { TableLoadingState, TableErrorState, TableEmptyState } from "@repo/ui/ui/data-table-states";

export type SortDirection = "asc" | "desc" | null;

export interface SortConfig {
    key: string | null;
    direction: SortDirection;
}

export interface ServerTableColumn<T> {
    header: ReactNode;
    accessorKey: keyof T | string;
    cell?: (row: T) => ReactNode;
    className?: string;
    cellClassName?: string;
    align?: "left" | "center" | "right";
    sortable?: boolean;
    sortKey?: string;
}

export interface FilterOption {
    label: string;
    value: string;
}

export interface FilterField {
    key: string;
    label: string;
    options: FilterOption[];
    placeholder?: string;
    className?: string;
}

interface FilterRenderProps {
    fields: FilterField[];
    values: Record<string, string>;
    onChange: (nextValues: Record<string, string>) => void;
}

interface ServerTableProps<T> {
    columns: ServerTableColumn<T>[];
    data: T[];
    getRowId: (row: T) => string | number;

    page: number;
    limit: number;
    total: number;
    onPageChange: (page: number) => void;

    enableSearch?: boolean;
    searchValue?: string;
    searchPlaceholder?: string;
    onSearchChange?: (value: string) => void;

    filters?: FilterField[];
    filterValues?: Record<string, string>;
    onFilterChange?: (nextValues: Record<string, string>) => void;
    renderFilters?: (props: FilterRenderProps) => ReactNode;

    sortConfig?: SortConfig;
    onSort?: (key: string) => void;

    selectedRowIds?: (string | number)[];
    onRowSelect?: (id: string | number) => void;
    onSelectAll?: () => void;

    toolbarContent?: ReactNode;

    fileName?: string;

    isLoading?: boolean;
    error?: boolean;
    onRetry?: () => void;

    emptyTitle?: string;
    emptyMessage?: string;

    containerClassName?: string;
    tableClassName?: string;
}

function SortIcon({ isActive, direction }: { isActive: boolean; direction: SortDirection }) {
    if (!isActive || !direction) {
        return <ArrowUpDown className="h-4 w-4 text-gray-400 group-hover:text-gray-600" />;
    }
    return direction === "asc" ? (
        <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
        <ArrowDown className="h-4 w-4 text-primary" />
    );
}

export function ServerTable<T>({
    columns,
    data,
    getRowId,
    page,
    limit,
    total,
    onPageChange,
    enableSearch = false,
    searchValue = "",
    searchPlaceholder = "Search...",
    onSearchChange,
    filters = [],
    filterValues = {},
    onFilterChange,
    renderFilters,
    sortConfig,
    onSort,
    selectedRowIds,
    onRowSelect,
    onSelectAll,
    toolbarContent,
    fileName,
    isLoading = false,
    error = false,
    onRetry,
    emptyTitle = "No results",
    emptyMessage = "Try adjusting your search or filters",
    containerClassName,
    tableClassName,
}: ServerTableProps<T>) {
    const selectedCount = selectedRowIds?.length ?? 0;
    const allSelected = data.length > 0 && selectedCount === data.length && selectedCount > 0;
    const tableContentRef = useRef<HTMLDivElement>(null);
    const [animatedHeight, setAnimatedHeight] = useState<number | null>(null);

    useEffect(() => {
        const element = tableContentRef.current;
        if (!element) return;

        const setHeight = (height: number) => {
            setAnimatedHeight((prev) => {
                if (prev === null) return height;
                if (Math.abs(prev - height) < 1) return prev;
                return height;
            });
        };

        // Initialize with the current height to avoid first-paint jump.
        setHeight(element.offsetHeight);

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0];
            if (!entry) return;
            setHeight(entry.contentRect.height);
        });

        observer.observe(element);

        return () => {
            observer.disconnect();
        };
    }, []);

    const handleFilterChange = (key: string, value: string) => {
        const nextValues = { ...filterValues, [key]: value };
        onFilterChange?.(nextValues);
    };

    // Prepare CSV data
    const csvHeaders = columns.map((col) => ({
        label: typeof col.header === "string" ? col.header : String(col.accessorKey),
        key: String(col.accessorKey),
    }));

    const csvData = data.map((row) => {
        const csvRow: Record<string, unknown> = {};
        columns.forEach((col) => {
            const key = String(col.accessorKey);
            const value = (row as Record<string, unknown>)[key];
            csvRow[key] = value;
        });
        return csvRow;
    });

    return (
        <div
            className={cn(
                "bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm",
                containerClassName
            )}
        >
            {(enableSearch || filters.length > 0 || toolbarContent) && (
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 gap-4 border-b border-gray-100">
                    <div className="flex flex-1 flex-col gap-3 md:flex-row md:items-center">
                        {enableSearch && onSearchChange && (
                            <div className="relative flex-1 max-w-md">
                                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
                                <Input
                                    type="search"
                                    placeholder={searchPlaceholder}
                                    className="pl-10 bg-gray-50/50 border-gray-200 transition-all w-full focus-visible:ring-primary/20"
                                    value={searchValue}
                                    onChange={(event) => onSearchChange(event.target.value)}
                                />
                            </div>
                        )}

                        {renderFilters
                            ? renderFilters({
                                fields: filters,
                                values: filterValues,
                                onChange: onFilterChange ?? (() => undefined),
                            })
                            : filters.length > 0 && (
                                <div className="flex flex-wrap items-center gap-3">
                                    {filters.map((filter) => (
                                        <div key={filter.key} className={cn("min-w-40", filter.className)}>
                                            <Select
                                                value={filterValues[filter.key] ?? ""}
                                                onValueChange={(value) => handleFilterChange(filter.key, value)}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder={filter.placeholder ?? filter.label} />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {filter.options.map((option) => (
                                                        <SelectItem key={option.value} value={option.value}>
                                                            {option.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    ))}
                                </div>
                            )}
                    </div>

                    <div className="flex items-center gap-4">
                        {fileName && (
                            <CSVLink
                                data={csvData}
                                headers={csvHeaders}
                                filename={`${fileName}.csv`}
                                className="inline-flex items-center justify-center w-9 h-9 rounded-md text-gray-500 hover:text-gray-700  transition-colors"
                                title="Export to CSV"
                            >
                                <DocumentDownload size={29} color="currentColor" />
                            </CSVLink>
                        )}
                        {toolbarContent}
                    </div>
                </div>
            )}

            <div
                className="overflow-hidden transition-[height] duration-300 ease-in-out"
                style={{ height: animatedHeight ?? undefined }}
            >
                <div ref={tableContentRef}>
                    <Table className={tableClassName}>
                        <TableHeader>
                            <TableRow>
                                {(onRowSelect && onSelectAll) && (
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
                                    const sortable = column.sortable && !!onSort;
                                    const sortKey = column.sortKey ?? String(column.accessorKey);
                                    const isActiveSort = sortConfig?.key === sortKey;

                                    return (
                                        <TableHead
                                            key={String(column.accessorKey)}
                                            className={cn(
                                                column.className,
                                                sortable && "cursor-pointer group",
                                                column.align === "right" && "text-right",
                                                column.align === "center" && "text-center"
                                            )}
                                            onClick={() => sortable && onSort?.(sortKey)}
                                        >
                                            <div
                                                className={cn(
                                                    "flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider",
                                                    column.align === "right" && "justify-end",
                                                    column.align === "center" && "justify-center"
                                                )}
                                            >
                                                {column.header}
                                                {sortable && (
                                                    <SortIcon
                                                        isActive={isActiveSort}
                                                        direction={sortConfig?.direction ?? null}
                                                    />
                                                )}
                                            </div>
                                        </TableHead>
                                    );
                                })}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {isLoading ? (
                                <TableLoadingState
                                    columnCount={columns.length + (onRowSelect ? 1 : 0)}
                                />
                            ) : error ? (
                                <TableErrorState
                                    title="Error loading data"
                                    message="Please try again later."
                                    onRetry={onRetry}
                                    colSpan={columns.length + (onRowSelect ? 1 : 0)}
                                />
                            ) : data.length === 0 ? (
                                <TableEmptyState
                                    title={emptyTitle}
                                    message={emptyMessage}
                                    colSpan={columns.length + (onRowSelect ? 1 : 0)}
                                    isSearch={!!searchValue}
                                />
                            ) : (
                                data.map((row) => {
                                    const rowId = getRowId(row);
                                    const isSelected = selectedRowIds?.includes(rowId);

                                    return (
                                        <TableRow
                                            key={rowId}
                                            className={cn(
                                                "hover:bg-gray-50/80 transition-colors group",
                                                isSelected && "bg-primary/5 hover:bg-primary/10"
                                            )}
                                        >
                                            {onRowSelect && (
                                                <TableCell className=" pl-6">
                                                    <input
                                                        type="checkbox"
                                                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                                        checked={!!isSelected}
                                                        onChange={() => onRowSelect(rowId)}
                                                    />
                                                </TableCell>
                                            )}

                                            {columns.map((column) => {
                                                const value = (row as Record<string, ReactNode>)[
                                                    String(column.accessorKey)
                                                ];

                                                return (
                                                    <TableCell
                                                        key={String(column.accessorKey)}
                                                        className={cn(
                                                            column.cellClassName,
                                                            column.align === "right" && "text-right",
                                                            column.align === "center" && "text-center"
                                                        )}
                                                    >
                                                        {column.cell ? column.cell(row) : value}
                                                    </TableCell>
                                                );
                                            })}
                                        </TableRow>
                                    );
                                })
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {!isLoading && !error && (
                <Pagination
                    currentPage={page}
                    totalItems={total}
                    itemsPerPage={limit}
                    onPageChange={onPageChange}
                />
            )}
        </div>
    );
}

"use client";

import { useState, useEffect, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Search,
    ArrowUpDown,
    Edit,
    Trash2,
    ArrowUp,
    ArrowDown,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
import { BulkActionBar } from "@repo/ui/ui/bulk-action-bar";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { GlobeIcon } from "@radix-ui/react-icons";
import { customersApi } from "@/utils/api";
import { Customer } from "@/types/customer";



type SortConfig = {
    key: keyof Customer | null;
    direction: "asc" | "desc" | null;
};

const sortOptions = [
    { value: "newest", label: "Newest" },
    { value: "name", label: "Name: A to Z" },
];

type ApiResponse = {
    data: {
        users: Customer[];
    };
    pagination: {
        start: number;
        limit: number;
        total: number;
        hasMore: boolean;
    };
};

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/ui/table";
import { Pagination } from "@repo/ui/ui/pagination";

export default function CustomerListingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
    const [sortOption, setSortOption] = useState<string>("newest");
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    // Debounce search query
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
            setCurrentPage(1); // Reset to first page on search
        }, 500);
        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch customers with useQuery
    const { data, isLoading, error, refetch } = useQuery<ApiResponse>({
        queryKey: ['customers', currentPage, itemsPerPage, sortOption, debouncedSearchQuery],
        queryFn: async () => {

            const params: any = {
                page: (currentPage),
                limit: itemsPerPage,
                sortBy: sortOption,
            };

            if (debouncedSearchQuery) {
                params.search = debouncedSearchQuery;
            }

            const response = await customersApi.getCustomers(params);
            return response.data;
        },
        staleTime: 30000, // 30 seconds
    });

    const customers = data?.data?.users || [];
    const totalItems = data?.pagination?.total || 0;

    const handleSort = (key: keyof Customer) => {
        let direction: "asc" | "desc" | null = "asc";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") direction = "desc";
            else if (sortConfig.direction === "desc") direction = null;
        }
        setSortConfig({ key, direction });
    };

    const handlePageChange = (page: number) => {
        console.log("Page changed to:", page);
        setCurrentPage(page);
    };

    const handleSearch = (query: string) => {
        setSearchQuery(query);
    };

    const getCustomerName = (customer: Customer) => {
        return `${customer.firstName} ${customer.lastName}`.trim() || customer.email;
    };

    const getCustomerStatus = (status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Active';
            case 'SUSPENDED': return 'Suspended';
            case 'DELETED': return 'Deleted';
            default: return status;
        }
    };

    const getCustomerStatusColor = (status: string) => {
        switch (status) {
            case 'ACTIVE': return "bg-green-50 text-green-600 border-green-100";
            case 'SUSPENDED': return "bg-yellow-50 text-yellow-600 border-yellow-100";
            case 'DELETED': return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    const toggleSelectAll = () => {
        if (selectedCustomers.length === customers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(customers.map((c) => c.id));
        }
    };

    const toggleSelect = (id: number) => {
        setSelectedCustomers((prev) =>
            prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
        );
    };

    const bulkActions = [
        {
            icon: Edit,
            label: "Bulk Edit",
            onClick: () => console.log("Bulk edit", Array.from(selectedCustomers))
        },
        {
            icon: GlobeIcon,
            label: "Update Status",
            onClick: () => console.log("Update status", Array.from(selectedCustomers))
        },
        {
            icon: Trash2,
            label: "",
            onClick: () => console.log("Delete", Array.from(selectedCustomers)),
            variant: "destructive" as const,
            className: "h-8 w-8 p-0"
        }
    ];

    return (
        <div className="p-8">
            <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
                {/* Header */}
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 gap-4 border-b border-gray-100">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
                        <Input
                            type="search"
                            placeholder="Search customers..."
                            className="pl-10 bg-gray-50/50 border-gray-200 transition-all w-full focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <Select value={sortOption} onValueChange={setSortOption}>
                            <SelectTrigger className="w-45">
                                <SelectValue placeholder="Sort by" />
                            </SelectTrigger>
                            <SelectContent>
                                {sortOptions.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Loading State */}
                {isLoading && (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        <span className="ml-2 text-gray-600">Loading customers...</span>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="flex flex-col items-center justify-center py-12 text-red-600">
                        <p className="text-lg font-semibold mb-2">Error loading customers</p>
                        <p className="text-sm text-gray-500 mb-4">Please try again</p>
                        <button
                            onClick={() => refetch()}
                            className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
                        >
                            Retry
                        </button>
                    </div>
                )}

                {/* Table */}
                {!isLoading && !error && (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-10 pl-6">
                                    <input
                                        type="checkbox"
                                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                        checked={
                                            selectedCustomers.length === customers.length &&
                                            customers.length > 0
                                        }
                                        onChange={toggleSelectAll}
                                    />
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer group"
                                    onClick={() => handleSort("firstName")}
                                >
                                    <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                        Name
                                        <SortIcon columnKey="firstName" sortConfig={sortConfig} />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer group"
                                    onClick={() => handleSort("email")}
                                >
                                    <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                        Email
                                        <SortIcon columnKey="email" sortConfig={sortConfig} />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer group"
                                    onClick={() => handleSort("phone")}
                                >
                                    <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                        Phone
                                        <SortIcon columnKey="phone" sortConfig={sortConfig} />
                                    </div>
                                </TableHead>
                                <TableHead>
                                    <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                        Country
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer group"
                                    onClick={() => handleSort("totalSpent")}
                                >
                                    <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                        Spent
                                        <SortIcon columnKey="totalSpent" sortConfig={sortConfig} />
                                    </div>
                                </TableHead>
                                <TableHead
                                    className="cursor-pointer group"
                                    onClick={() => handleSort("status")}
                                >
                                    <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                        Status
                                        <SortIcon columnKey="status" sortConfig={sortConfig} />
                                    </div>
                                </TableHead>
                                <TableHead className="text-right pr-6 uppercase text-xs font-semibold tracking-wider">Action</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {customers.length === 0 && !isLoading ? (
                                <TableRow>
                                    <TableCell colSpan={8} className="text-center py-12">
                                        <div className="text-gray-500">
                                            <p className="text-lg font-semibold mb-2">No customers found</p>
                                            <p className="text-sm">Try adjusting your search or filters</p>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                customers.map((customer) => (
                                    <TableRow
                                        key={customer.id}
                                        className={cn(
                                            "hover:bg-gray-50/80 transition-colors group",
                                            selectedCustomers.includes(customer.id) && "bg-primary/5 hover:bg-primary/10"
                                        )}
                                    >
                                        <TableCell className="pl-6">
                                            <input
                                                type="checkbox"
                                                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                                checked={selectedCustomers.includes(customer.id)}
                                                onChange={() => toggleSelect(customer.id)}
                                            />
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 rounded-full bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                                                    {customer.avatar ? (
                                                        <Image
                                                            src={customer.avatar}
                                                            alt={getCustomerName(customer)}
                                                            width={40}
                                                            height={40}
                                                            className="object-cover h-full w-full"
                                                        />
                                                    ) : (
                                                        <div className="h-full w-full bg-primary/10 flex items-center justify-center text-primary font-semibold text-sm">
                                                            {getCustomerName(customer).charAt(0).toUpperCase()}
                                                        </div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                                    {getCustomerName(customer)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-600 font-medium">{customer.email}</TableCell>
                                        <TableCell className="text-sm text-gray-600 font-medium">{customer.phone || 'N/A'}</TableCell>
                                        <TableCell className="text-sm text-gray-600 font-medium">N/A</TableCell>
                                        <TableCell className="text-sm text-gray-900 font-bold">${customer.totalSpent?.toLocaleString() || '0'}</TableCell>
                                        <TableCell>
                                            <span className={cn(
                                                "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                                                getCustomerStatusColor(customer.status)
                                            )}>
                                                {getCustomerStatus(customer.status)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-right pr-6">
                                            <div className="flex justify-end gap-2">
                                                <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
                                                    <Edit className="h-4 w-4" />
                                                </button>
                                                <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                )}

                {/* Footer */}
                {!isLoading && !error && (
                    <Pagination
                        currentPage={currentPage}
                        totalItems={totalItems}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
            <BulkActionBar
                selectedCount={selectedCustomers.length}
                onDeselectAll={() => setSelectedCustomers([])}
                label="Categories Selected"
                actions={bulkActions}
            />
        </div>
    );
}

function SortIcon({ columnKey, sortConfig }: { columnKey: keyof Customer; sortConfig: SortConfig }) {
    const isActive = sortConfig.key === columnKey;
    if (!isActive || !sortConfig.direction) return <ArrowUpDown className="h-4 w-4 text-gray-400" />;
    return sortConfig.direction === "asc" ? (
        <ArrowUp className="h-4 w-4 text-primary" />
    ) : (
        <ArrowDown className="h-4 w-4 text-primary" />
    );
}
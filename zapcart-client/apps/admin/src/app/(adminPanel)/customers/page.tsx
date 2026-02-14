"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
    Edit,
    Trash2,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
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
import { ServerTable, ServerTableColumn, SortConfig } from "@/components/common/ServerTable";



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

    const handleSort = useCallback((key: string) => {
        let direction: "asc" | "desc" | null = "asc";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") direction = "desc";
            else if (sortConfig.direction === "desc") direction = null;
        }
        setSortConfig({ key, direction });
    }, [sortConfig]);

    const handlePageChange = useCallback((page: number) => {
        setCurrentPage(page);
    }, []);

    const handleSearch = useCallback((query: string) => {
        setSearchQuery(query);
    }, []);

    const getCustomerName = useCallback((customer: Customer) => {
        return `${customer.firstName} ${customer.lastName}`.trim() || customer.email;
    }, []);

    const getCustomerStatus = useCallback((status: string) => {
        switch (status) {
            case 'ACTIVE': return 'Active';
            case 'SUSPENDED': return 'Suspended';
            case 'DELETED': return 'Deleted';
            default: return status;
        }
    }, []);

    const getCustomerStatusColor = useCallback((status: string) => {
        switch (status) {
            case 'ACTIVE': return "bg-green-50 text-green-600 border-green-100";
            case 'SUSPENDED': return "bg-yellow-50 text-yellow-600 border-yellow-100";
            case 'DELETED': return "bg-red-50 text-red-600 border-red-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    }, []);

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

    const columns = useMemo<ServerTableColumn<Customer>[]>(() => [
        {
            header: "Name",
            accessorKey: "firstName",
            sortable: true,
            sortKey: "firstName",
            cell: (customer) => (
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
            ),
        },
        {
            header: "Email",
            accessorKey: "email",
            sortable: true,
            sortKey: "email",
            cellClassName: "text-sm text-gray-600 font-medium",
        },
        {
            header: "Phone",
            accessorKey: "phone",
            sortable: true,
            sortKey: "phone",
            cell: (customer) => customer.phone || "N/A",
            cellClassName: "text-sm text-gray-600 font-medium",
        },
        {
            header: "Country",
            accessorKey: "country",
            cell: () => "N/A",
            cellClassName: "text-sm text-gray-600 font-medium",
        },
        {
            header: "Spent",
            accessorKey: "totalSpent",
            sortable: true,
            sortKey: "totalSpent",
            cell: (customer) => `$${customer.totalSpent?.toLocaleString() || "0"}`,
            cellClassName: "text-sm text-gray-900 font-bold",
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            sortKey: "status",
            cell: (customer) => (
                <span
                    className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                        getCustomerStatusColor(customer.status)
                    )}
                >
                    {getCustomerStatus(customer.status)}
                </span>
            ),
        },
        {
            header: "Action",
            accessorKey: "actions",
            align: "right",
            cell: () => (
                <div className="flex justify-end gap-2">
                    <button className="p-1.5 text-gray-400 hover:text-primary hover:bg-gray-100 rounded-lg transition-all">
                        <Edit className="h-4 w-4" />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-gray-100 rounded-lg transition-all">
                        <Trash2 className="h-4 w-4" />
                    </button>
                </div>
            ),
        },
    ], [getCustomerName, getCustomerStatus, getCustomerStatusColor]);

    return (
        <div className="p-8">
            <ServerTable
                columns={columns}
                data={customers}
                getRowId={(customer) => customer.id}
                page={currentPage}
                limit={itemsPerPage}
                total={totalItems}
                onPageChange={handlePageChange}
                enableSearch
                searchValue={searchQuery}
                searchPlaceholder="Search customers..."
                onSearchChange={handleSearch}
                sortConfig={sortConfig}
                onSort={handleSort}
                selectedRowIds={selectedCustomers}
                onRowSelect={(id) => toggleSelect(Number(id))}
                onSelectAll={toggleSelectAll}
                isLoading={isLoading}
                error={Boolean(error)}
                onRetry={refetch}
                emptyTitle="No customers found"
                emptyMessage="Try adjusting your search or filters"
                toolbarContent={(
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
                )}
            />
            <BulkActionBar
                selectedCount={selectedCustomers.length}
                onDeselectAll={() => setSelectedCustomers([])}
                label="Categories Selected"
                actions={bulkActions}
            />
        </div>
    );
}
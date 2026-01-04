"use client";

import { useState, useMemo } from "react";
import {
    Search,
    ArrowUpDown,
    Edit,
    Trash2,
    ChevronLeft,
    ChevronRight,
    ArrowUp,
    ArrowDown,
} from "lucide-react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
import { SortSelect, SortOption } from "@repo/ui/SortSelect";
import { BulkActionBar } from "@repo/ui/ui/bulk-action-bar";
import { GlobeIcon } from "@radix-ui/react-icons";

interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    country: string;
    spent: number;
    status: "Active" | "Inactive";
    avatar: string;
}

const mockCustomers: Customer[] = [
    {
        id: 1,
        name: "Liam Jacob",
        email: "liamjacob@gmail.com",
        phone: "+11 536 732 373",
        country: "USA",
        spent: 17500,
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1599566150163-29194dcaad36?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 2,
        name: "Noah Christ",
        email: "noahchrist@gmail.com",
        phone: "+11 947 849 938",
        country: "USA",
        spent: 74244,
        status: "Inactive",
        avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 3,
        name: "Michael Davis",
        email: "michaledvis@gmail.com",
        phone: "+44 738 839 373",
        country: "China",
        spent: 76445,
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1527980965255-d3b416303d12?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 4,
        name: "Mason William",
        email: "masonwilliam@gmail.com",
        phone: "+22 747 373 738",
        country: "Italy",
        spent: 87543,
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 5,
        name: "Elijah James",
        email: "elijahjames@gmail.com",
        phone: "+44 637 388 388",
        country: "France",
        spent: 86446,
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 6,
        name: "Rucas Gatth",
        email: "rucasgatth@gmail.com",
        phone: "+66 647 839 939",
        country: "Japan",
        spent: 45653,
        status: "Inactive",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 7,
        name: "Oliver Daniel",
        email: "olivardaniel@gmail.com",
        phone: "+11 738 939 930",
        country: "USA",
        spent: 98654,
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 8,
        name: "Carter Joseph",
        email: "cartejoseph@gmail.com",
        phone: "+44 738 839 373",
        country: "China",
        spent: 56366,
        status: "Inactive",
        avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=100&h=100",
    },
    {
        id: 9,
        name: "Daniel Nathan",
        email: "danielnathan@gmail.com",
        phone: "+66 849 930 483",
        country: "Japan",
        spent: 74678,
        status: "Active",
        avatar: "https://images.unsplash.com/photo-1519345182560-3f2917c472ef?auto=format&fit=crop&q=80&w=100&h=100",
    },
];

type SortConfig = {
    key: keyof Customer | null;
    direction: "asc" | "desc" | null;
};

const sortOptions: SortOption[] = [
    { value: "newest", label: "Newest" },
    { value: "spent-desc", label: "Spent: High to Low" },
    { value: "spent-asc", label: "Spent: Low to High" },
    { value: "name-asc", label: "Name: A to Z" },
];

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@repo/ui/ui/table";
import { Pagination } from "@repo/ui/ui/pagination";

// ... existing imports

export default function CustomerListingPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
    const [sortOption, setSortOption] = useState<string>("newest");
    const [selectedCustomers, setSelectedCustomers] = useState<number[]>([]);

    // Pagination State
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const handleSort = (key: keyof Customer) => {
        let direction: "asc" | "desc" | null = "asc";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") direction = "desc";
            else if (sortConfig.direction === "desc") direction = null;
        }
        setSortConfig({ key, direction });
    };

    const filteredAndSortedCustomers = useMemo(() => {
        let result = [...mockCustomers];

        // Filter
        if (searchQuery) {
            result = result.filter(
                (c) =>
                    c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    c.phone.includes(searchQuery)
            );
        }

        // Sort
        if (sortConfig.key && sortConfig.direction) {
            result.sort((a, b) => {
                const aValue = a[sortConfig.key!];
                const bValue = b[sortConfig.key!];

                if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
                if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
                return 0;
            });
        }

        return result;
    }, [searchQuery, sortConfig]);

    // Pagination Logic
    const paginatedCustomers = useMemo(() => {
        const startIndex = (currentPage - 1) * itemsPerPage;
        return filteredAndSortedCustomers.slice(startIndex, startIndex + itemsPerPage);
    }, [filteredAndSortedCustomers, currentPage]);

    const toggleSelectAll = () => {
        if (selectedCustomers.length === paginatedCustomers.length) {
            setSelectedCustomers([]);
        } else {
            setSelectedCustomers(paginatedCustomers.map((c) => c.id));
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
                            placeholder="Search..."
                            className="pl-10 bg-gray-50/50 border-gray-200 transition-all w-full focus-visible:ring-primary/20"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                    <div className="flex items-center gap-4">
                        <SortSelect
                            options={sortOptions}
                            value={sortOption}
                            onValueChange={setSortOption}
                            className="flex items-center"
                        />
                    </div>
                </div>

                {/* Table */}
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-10 pl-6">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    checked={
                                        selectedCustomers.length === paginatedCustomers.length &&
                                        paginatedCustomers.length > 0
                                    }
                                    onChange={toggleSelectAll}
                                />
                            </TableHead>
                            <TableHead
                                className="cursor-pointer group"
                                onClick={() => handleSort("name")}
                            >
                                <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                    Name
                                    <SortIcon columnKey="name" sortConfig={sortConfig} />
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
                            <TableHead
                                className="cursor-pointer group"
                                onClick={() => handleSort("country")}
                            >
                                <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                    Country
                                    <SortIcon columnKey="country" sortConfig={sortConfig} />
                                </div>
                            </TableHead>
                            <TableHead
                                className="cursor-pointer group"
                                onClick={() => handleSort("spent")}
                            >
                                <div className="flex items-center gap-1.5 hover:text-gray-900 transition-colors uppercase text-xs font-semibold tracking-wider">
                                    Spent
                                    <SortIcon columnKey="spent" sortConfig={sortConfig} />
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
                        {paginatedCustomers.map((customer) => (
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
                                            <Image
                                                src={customer.avatar}
                                                alt={customer.name}
                                                width={40}
                                                height={40}
                                                className="object-cover h-full w-full"
                                            />
                                        </div>
                                        <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                                            {customer.name}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-gray-600 font-medium">{customer.email}</TableCell>
                                <TableCell className="text-sm text-gray-600 font-medium">{customer.phone}</TableCell>
                                <TableCell className="text-sm text-gray-600 font-medium">{customer.country}</TableCell>
                                <TableCell className="text-sm text-gray-900 font-bold">${customer.spent.toLocaleString()}</TableCell>
                                <TableCell>
                                    <span className={cn(
                                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                                        customer.status === "Active"
                                            ? "bg-green-50 text-green-600 border-green-100"
                                            : "bg-red-50 text-red-600 border-red-100"
                                    )}>
                                        {customer.status}
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
                        ))}
                    </TableBody>
                </Table>

                {/* Footer */}
                <Pagination
                    currentPage={currentPage}
                    totalItems={filteredAndSortedCustomers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={setCurrentPage}
                />
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
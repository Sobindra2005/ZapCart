"use client";

import {
  Filter,
  Plus,
  Search,
  Edit,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
import { SortSelect, SortOption } from "@repo/ui/SortSelect";
import { AdminCard } from "@/components/AdminCard";
import { BulkActionBar } from "@repo/ui/ui/bulk-action-bar";
import { GlobeIcon } from "@radix-ui/react-icons";

interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "T-Shirt",
    category: "Women Cloths",
    price: 79.80,
    stock: 79,
    status: "Scheduled",
    image: "https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 2,
    name: "Shirt",
    category: "Man Cloths",
    price: 76.89,
    stock: 86,
    status: "Active",
    image: "https://images.unsplash.com/photo-1596755094514-f87034a264c6?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 3,
    name: "Pant",
    category: "Kid Cloths",
    price: 86.65,
    stock: 74,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 4,
    name: "Sweater",
    category: "Man Cloths",
    price: 56.07,
    stock: 69,
    status: "Active",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 5,
    name: "Sweater",
    category: "Man Cloths",
    price: 56.07,
    stock: 69,
    status: "Scheduled",
    image: "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 6,
    name: "Light Jacket",
    category: "Women Cloths",
    price: 36.00,
    stock: 65,
    status: "Draft",
    image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 7,
    name: "Half Shirt",
    category: "Man Cloths",
    price: 46.78,
    stock: 58,
    status: "Active",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200&h=200",
  },
  {
    id: 8,
    name: "Half Shirt",
    category: "Sweater",
    price: 46.78,
    stock: 58,
    status: "Active",
    image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=200&h=200",
  },
];



const getStatusStyles = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-50 text-green-600 border-green-100";
    case "Scheduled":
      return "bg-blue-50 text-blue-600 border-blue-100";
    case "Draft":
      return "bg-orange-50 text-orange-600 border-orange-100";
    default:
      return "bg-gray-50 text-gray-600 border-gray-100";
  }
};

type SortConfig = {
  key: keyof Product | null;
  direction: "asc" | "desc" | null;
};

const sortOptions: SortOption[] = [
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "stock-low", label: "Stock: Low to High" },
];


import { Pagination } from "@repo/ui/ui/pagination";
import { FormPopup } from "@repo/ui/ui/form-popup";
import { AddProductForm } from "@/components/forms/AddProductForm";
import { DataTable } from "@/components/common/DataTable";

// ... existing imports

export default function ProductListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [sortOption, setSortOption] = useState<string>("newest");
  const [selectedProducts, setSelectedProducts] = useState<number[]>([]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const handleSort = (key: keyof Product) => {
    let direction: "asc" | "desc" | null = "asc";
    if (sortConfig.key === key) {
      if (sortConfig.direction === "asc") direction = "desc";
      else if (sortConfig.direction === "desc") direction = null;
    }
    setSortConfig({ key, direction });
  };

  const filteredAndSortedProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter
    if (searchQuery) {
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.category.toLowerCase().includes(searchQuery.toLowerCase())
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
  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProducts.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredAndSortedProducts, currentPage]);

  const toggleSelectAll = () => {
    if (selectedProducts.length === paginatedProducts.length) {
      setSelectedProducts([]);
    } else {
      setSelectedProducts(paginatedProducts.map((p) => p.id));
    }
  };

  const toggleSelect = (id: string | number) => {
    const numericId = Number(id);
    setSelectedProducts((prev) =>
      prev.includes(numericId) ? prev.filter((item) => item !== numericId) : [...prev, numericId]
    );
  };

  const bulkActions = [
    {
      icon: Edit,
      label: "Bulk Edit",
      onClick: () => console.log("Bulk edit", Array.from(selectedProducts))
    },
    {
      icon: GlobeIcon,
      label: "Update Status",
      onClick: () => console.log("Update status", Array.from(selectedProducts))
    },
    {
      icon: Trash2,
      label: "",
      onClick: () => console.log("Delete", Array.from(selectedProducts)),
      variant: "destructive" as const,
      className: "h-8 w-8 p-0"
    }
  ];

  return (
    <div className="p-8">
      <AdminCard noPadding className="overflow-hidden">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between px-6 py-5 gap-4 border-b border-gray-100">
          <div className="flex items-center gap-4 flex-1">
            <div className="relative flex-1 max-w-md hidden lg:block">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
              <Input
                type="search"
                placeholder="Search products..."
                className="pl-10 bg-gray-50 border-gray-200 transition-all w-full focus-visible:ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <SortSelect
              options={sortOptions}
              value={sortOption}
              onValueChange={setSortOption}
              className="flex items-center"
            />

            <div className="h-6 w-px bg-gray-200 mx-1 hidden sm:block" />

            <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-gray-600 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
              <Filter className="h-4 w-4" />
              Filter
            </button>
            <FormPopup
              title="Add New Product"
              description="Fill in the details to create a new product."
              trigger={
                <button className="flex items-center gap-2 px-4 py-1.5 text-sm font-bold text-white bg-primary rounded-lg hover:bg-primary/90 transition-all shadow-md shadow-primary/20">
                  <Plus className="h-4 w-4" strokeWidth={3} />
                  Add Product
                </button>
              }
            >
              <AddProductForm onSubmit={(data) => console.log(data)} />
            </FormPopup>
          </div>
        </div>

        {/* Mobile Search */}
        <div className="px-6 py-3 border-b border-gray-100 lg:hidden">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400 z-10" />
            <Input
              type="search"
              placeholder="Search products..."
              className="pl-10 bg-gray-50 border-gray-200 w-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Table */}
        <DataTable
          data={paginatedProducts}
          keyExtractor={(product) => product.id}
          selectedIds={selectedProducts}
          onSelect={toggleSelect}
          onSelectAll={toggleSelectAll}
          sortConfig={sortConfig}
          onSort={handleSort}
          columns={[
            {
              key: "name",
              label: "Product Name",
              sortKey: "name",
              render: (product) => (
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-200">
                    <Image
                      src={product.image}
                      alt={product.name}
                      width={40}
                      height={40}
                      className="object-cover h-full w-full"
                    />
                  </div>
                  <span className="font-bold text-gray-900 group-hover:text-primary transition-colors">
                    {product.name}
                  </span>
                </div>
              ),
            },
            {
              key: "category",
              label: "Category",
              sortKey: "category",
              render: (product) => (
                <span className="text-sm text-gray-600 font-medium">
                  {product.category}
                </span>
              ),
            },
            {
              key: "price",
              label: "Price",
              sortKey: "price",
              render: (product) => (
                <span className="text-sm text-gray-900 font-bold">
                  ${product.price.toFixed(2)}
                </span>
              ),
            },
            {
              key: "stock",
              label: "Stock",
              sortKey: "stock",
              render: (product) => (
                <span className="text-sm text-gray-600 font-medium">
                  {product.stock}
                </span>
              ),
            },
            {
              key: "status",
              label: "Status",
              sortKey: "status",
              render: (product) => (
                <span
                  className={cn(
                    "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                    getStatusStyles(product.status)
                  )}
                >
                  {product.status}
                </span>
              ),
            },
            {
              key: "actions",
              label: "Action",
              align: "right",
              render: (product) => (
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
          ]}
        />

        {/* Footer */}
        <Pagination
          currentPage={currentPage}
          totalItems={filteredAndSortedProducts.length}
          itemsPerPage={itemsPerPage}
          onPageChange={setCurrentPage}
        />
      </AdminCard>

      <BulkActionBar
        selectedCount={selectedProducts.length}
        onDeselectAll={() => setSelectedProducts([])}
        label="Categories Selected"
        actions={bulkActions}
      />
    </div>
  );
}

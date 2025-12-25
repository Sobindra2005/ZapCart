"use client";
import { BulkActionBar } from "@repo/ui/ui/bulk-action-bar";
import {
    Search,
    Plus,
    MoreVertical,
    ChevronRight,
    ChevronDown,
    LayoutGrid,
    BarChart3,
    Activity,
    ArrowUpRight,
    ArrowDownRight,
    Filter,
    Edit,
    Trash2,
    Eye,
    Globe,
    ImageIcon,
    GripVertical
} from "lucide-react";
import Image from "next/image";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@repo/ui/ui/input";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@repo/ui/ui/card";
import {
    BarChart,
    Bar,
    ResponsiveContainer,
    Cell
} from "recharts";
import { AdminCard } from "@/components/AdminCard";

interface Category {
    id: string;
    name: string;
    slug: string;
    productCount: number;
    status: "Active" | "Inactive" | "Draft";
    parentId: string | null;
    image: string;
    children?: Category[];
    health: number; // 0-100 percentage
}

const mockCategories: Category[] = [
    {
        id: "1",
        name: "Electronics",
        slug: "electronics",
        productCount: 1240,
        status: "Active",
        parentId: null,
        image: "https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&q=80&w=100&h=100",
        health: 95,
        children: [
            {
                id: "1-1",
                name: "Mobile Phones",
                slug: "mobile-phones",
                productCount: 450,
                status: "Active",
                parentId: "1",
                image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=100&h=100",
                health: 92,
                children: [
                    {
                        id: "1-1-1",
                        name: "Smartphones",
                        slug: "smartphones",
                        productCount: 300,
                        status: "Active",
                        parentId: "1-1",
                        image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&q=80&w=100&h=100",
                        health: 94,
                    }
                ]
            },
            {
                id: "1-2",
                name: "Laptops",
                slug: "laptops",
                productCount: 320,
                status: "Active",
                parentId: "1",
                image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?auto=format&fit=crop&q=80&w=100&h=100",
                health: 88,
            }
        ]
    },
    {
        id: "2",
        name: "Fashion",
        slug: "fashion",
        productCount: 2100,
        status: "Active",
        parentId: null,
        image: "https://images.unsplash.com/photo-1445205170230-053b83016050?auto=format&fit=crop&q=80&w=100&h=100",
        health: 82,
        children: [
            {
                id: "2-1",
                name: "Men's Wear",
                slug: "mens-wear",
                productCount: 850,
                status: "Active",
                parentId: "2",
                image: "https://images.unsplash.com/photo-1490578474895-699cd4e2cf59?auto=format&fit=crop&q=80&w=100&h=100",
                health: 85,
            },
            {
                id: "2-2",
                name: "Women's Wear",
                slug: "womens-wear",
                productCount: 1250,
                status: "Active",
                parentId: "2",
                image: "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&q=80&w=100&h=100",
                health: 78,
            }
        ]
    },
    {
        id: "3",
        name: "Home & Garden",
        slug: "home-garden",
        productCount: 850,
        status: "Active",
        parentId: null,
        image: "https://images.unsplash.com/photo-1484154218962-a197022b5858?auto=format&fit=crop&q=80&w=100&h=100",
        health: 90,
    }
];

const performanceData = [
    { name: "Electronics", sales: 45000, products: 1240 },
    { name: "Fashion", sales: 52000, products: 2100 },
    { name: "Home & Garden", sales: 38000, products: 850 },
    { name: "Beauty", sales: 25000, products: 600 },
    { name: "Toys", sales: 18000, products: 450 },
];

const StatusBadge = ({ status }: { status: Category["status"] }) => {
    const styles = {
        Active: "bg-green-50 text-green-700 border-green-200",
        Inactive: "bg-red-50 text-red-700 border-red-200",
        Draft: "bg-orange-50 text-orange-700 border-orange-200",
    };
    return (
        <Badge variant="outline" className={cn("px-2 py-0.5 font-bold", styles[status])}>
            {status}
        </Badge>
    );
};

const CategoryRow = ({
    category,
    depth = 0,
    expandedIds,
    toggleExpand,
    selectedCategory,
    setSelectedCategory,
    selectedIds,
    toggleSelect
}: {
    category: Category;
    depth?: number;
    expandedIds: Set<string>;
    toggleExpand: (id: string) => void;
    selectedCategory: Category | null;
    setSelectedCategory: (cat: Category | null) => void;
    selectedIds: Set<string>;
    toggleSelect: (id: string) => void;
}) => {
    const hasChildren = category.children && category.children.length > 0;
    const isExpanded = expandedIds.has(category.id);

    return (
        <>
            <div
                className={cn(
                    "group flex items-center px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-100",
                    selectedCategory?.id === category.id && "bg-primary/5 hover:bg-primary/5",
                    selectedIds.has(category.id) && "bg-primary/10 hover:bg-primary/20"
                )}
                onClick={() => setSelectedCategory(category)}
            >
                <div className="flex items-center gap-3 mr-4">
                    <input
                        type="checkbox"
                        className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                        checked={selectedIds.has(category.id)}
                        onChange={(e) => {
                            e.stopPropagation();
                            toggleSelect(category.id);
                        }}
                    />
                    <GripVertical className="h-4 w-4 text-gray-400 cursor-grab active:cursor-grabbing opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>

                <div style={{ paddingLeft: `${depth * 28}px` }} className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 min-w-6">
                        {hasChildren && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    toggleExpand(category.id);
                                }}
                                className="p-1 hover:bg-gray-200 rounded text-gray-500"
                            >
                                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                            </button>
                        )}
                    </div>

                    <div className="h-10 w-10 rounded-lg bg-gray-100 overflow-hidden shrink-0 border border-gray-100 relative">
                        <Image src={category.image} alt={category.name} fill className="object-cover" />
                    </div>

                    <div className="flex flex-col min-w-0">
                        <span className="font-bold text-gray-900 truncate">
                            {category.name}
                        </span>
                        <span className="text-xs text-gray-500 truncate">/{category.slug}</span>
                    </div>
                </div>

                <div className="hidden md:flex flex-col items-end px-6 min-w-30">
                    <span className="text-sm font-bold text-gray-900">{category.productCount}</span>
                    <span className="text-[10px] text-gray-500 uppercase tracking-wider font-semibold">Products</span>
                </div>

                <div className="hidden lg:flex px-6 min-w-35 items-center gap-2">
                    <div className="h-1.5 w-24 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className={cn(
                                "h-full rounded-full",
                                category.health > 90 ? "bg-green-500" : category.health > 80 ? "bg-blue-500" : "bg-orange-500"
                            )}
                            style={{ width: `${category.health}%` }}
                        />
                    </div>
                    <span className="text-xs font-bold text-gray-600">{category.health}%</span>
                </div>

                <div className="px-4 min-w-25">
                    <StatusBadge status={category.status} />
                </div>

                <div className="flex items-center gap-2 pl-4">
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-primary">
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400 hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            </div>
            {hasChildren && isExpanded && (
                <div className="bg-gray-50/30">
                    {category.children!.map((child) => (
                        <CategoryRow
                            key={child.id}
                            category={child}
                            depth={depth + 1}
                            expandedIds={expandedIds}
                            toggleExpand={toggleExpand}
                            selectedCategory={selectedCategory}
                            setSelectedCategory={setSelectedCategory}
                            selectedIds={selectedIds}
                            toggleSelect={toggleSelect}
                        />
                    ))}
                </div>
            )}
        </>
    );
};


export default function CategoriesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set(["1", "2"]));
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(mockCategories[0]);
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    const toggleExpand = (id: string) => {
        const newExpanded = new Set(expandedIds);
        if (newExpanded.has(id)) newExpanded.delete(id);
        else newExpanded.add(id);
        setExpandedIds(newExpanded);
    };

    const toggleSelect = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    const allCategoryIds = useMemo(() => {
        const ids: string[] = [];
        const traverse = (cats: Category[]) => {
            cats.forEach(c => {
                ids.push(c.id);
                if (c.children) traverse(c.children);
            });
        };
        traverse(mockCategories);
        return ids;
    }, []);

    const toggleSelectAll = () => {
        if (selectedIds.size === allCategoryIds.length && allCategoryIds.length > 0) {
            setSelectedIds(new Set());
        } else {
            setSelectedIds(new Set(allCategoryIds));
        }
    };

    const bulkActions = [
        {
            icon: Edit,
            label: "Bulk Edit",
            onClick: () => console.log("Bulk edit", Array.from(selectedIds))
        },
        {
            icon: Globe,
            label: "Update Status",
            onClick: () => console.log("Update status", Array.from(selectedIds))
        },
        {
            icon: Trash2,
            label: "",
            onClick: () => console.log("Delete", Array.from(selectedIds)),
            variant: "destructive" as const,
            className: "h-8 w-8 p-0"
        }
    ];

    return (
        <div className="p-8">
            {/* Analytics Header */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <AdminCard>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <LayoutGrid className="h-4 w-4" />
                            Total Categories
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-gray-900">24</span>
                            <span className="flex items-center text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <ArrowUpRight className="h-3 w-3 mr-1" />
                                +12%
                            </span>
                        </div>
                    </CardContent>
                </AdminCard>
                <AdminCard>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-gray-500 flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Inventory Health
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center justify-between">
                            <span className="text-3xl font-bold text-gray-900">88.4%</span>
                            <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded-full">
                                <ArrowDownRight className="h-3 w-3 mr-1" />
                                -2.4%
                            </span>
                        </div>
                    </CardContent>
                </AdminCard>
                <AdminCard className="col-span-1 md:col-span-2 ">
                    <CardHeader className="pb-2 flex flex-row items-center justify-between space-y-0">
                        <div>
                            <CardTitle className="text-sm font-medium text-gray-500">Sales by Category</CardTitle>
                        </div>
                        <BarChart3 className="h-4 w-4 text-gray-400" />
                    </CardHeader>
                    <CardContent className="h-24">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={performanceData}>
                                <Bar dataKey="sales" radius={[4, 4, 0, 0]}>
                                    {performanceData.map((entry, index) => (
                                        <Cell
                                            key={`cell-${index}`}
                                            fill={cn(
                                                index === 0 ? "#10b981" : index === 1 ? "#3b82f6" : "#cbd5e1"
                                            )}
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </AdminCard>
            </div>

            <div className="flex flex-col lg:flex-row gap-8 items-start">
                {/* Main List */}
                <AdminCard className="flex-1 w-full p-0">
                    <div className="px-6 py-5 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="relative w-full sm:max-w-xs">
                            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                placeholder="Search categories..."
                                className="pl-10 bg-gray-50/50 border-gray-200 focus-visible:ring-primary/20"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                            <Button variant="outline" className="flex-1 sm:flex-none gap-2 font-bold border-gray-200">
                                <Filter className="h-4 w-4" />
                                Filter
                            </Button>
                            <Button className="flex-1 sm:flex-none gap-2 font-bold bg-primary hover:bg-primary/90">
                                <Plus className="h-4 w-4" />
                                Add Category
                            </Button>
                        </div>
                    </div>

                    <div className="w-full">
                        <div className="flex items-center px-4 py-3 bg-gray-50/50 border-b border-gray-100 text-[10px] uppercase tracking-wider font-bold text-gray-500">
                            <div className="flex items-center gap-3 mr-4">
                                <input
                                    type="checkbox"
                                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4 cursor-pointer"
                                    checked={selectedIds.size === allCategoryIds.length && allCategoryIds.length > 0}
                                    onChange={toggleSelectAll}
                                />
                                <div className="w-4"></div>
                            </div>
                            <div className="flex-1">Category & Hierarchy</div>
                            <div className="hidden md:block w-30 text-right px-6">Product Count</div>
                            <div className="hidden lg:block w-35 px-6">Market Health</div>
                            <div className="w-25 px-4">Status</div>
                            <div className="w-20 text-right">Actions</div>
                        </div>
                        <div className="divide-y divide-gray-100">
                            {mockCategories.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    expandedIds={expandedIds}
                                    toggleExpand={toggleExpand}
                                    selectedCategory={selectedCategory}
                                    setSelectedCategory={setSelectedCategory}
                                    selectedIds={selectedIds}
                                    toggleSelect={toggleSelect}
                                />
                            ))}
                        </div>
                    </div>
                </AdminCard>

                {/* Details Panel */}
                {selectedCategory && (
                    <AdminCard className="w-full lg:w-100 sticky top-8 px-0">
                        <CardHeader className="border-b border-gray-100 pb-4">
                            <div className="flex items-center justify-between mb-2">
                                <Badge variant="secondary" className="bg-primary/5 text-primary border-primary/20">
                                    Category ID: #{selectedCategory.id}
                                </Badge>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-gray-400">
                                    <MoreVertical className="h-4 w-4" />
                                </Button>
                            </div>
                            <CardTitle className="text-xl font-bold">{selectedCategory.name}</CardTitle>
                            <CardDescription className="flex items-center gap-2">
                                /{selectedCategory.slug}
                                <Button variant="ghost" size="icon" className="h-4 w-4 p-0">
                                    <Eye className="h-3 w-3" />
                                </Button>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 space-y-6">
                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Appearance</h4>
                                <div className="aspect-video relative rounded-xl overflow-hidden bg-gray-100 border border-gray-200 group">
                                    <Image src={selectedCategory.image} alt={selectedCategory.name} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                        <Button variant="secondary" size="sm" className="gap-2 font-bold">
                                            <ImageIcon className="h-4 w-4" />
                                            Change Cover
                                        </Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">SEO Settings</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 bg-gray-50/50">
                                        <Globe className="h-4 w-4 text-gray-400" />
                                        <div className="flex-1 min-w-0">
                                            <p className="text-xs font-bold text-gray-900 truncate">Metadata Optimized</p>
                                            <p className="text-[10px] text-gray-500">Last updated: 2 days ago</p>
                                        </div>
                                        <Button variant="ghost" size="sm" className="text-xs font-bold text-primary">Edit</Button>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Category Health</h4>
                                <div className="space-y-4 px-1">
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-gray-600">Sell-through Rate</span>
                                            <span className="text-green-600">84.2%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: "84.2%" }} />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <div className="flex justify-between text-xs font-bold">
                                            <span className="text-gray-600">Profit Margin</span>
                                            <span className="text-blue-600">32.8%</span>
                                        </div>
                                        <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: "32.8%" }} />
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="pt-4 grid grid-cols-2 gap-3">
                                <Button variant="outline" className="font-bold border-gray-200">Cancel</Button>
                                <Button className="bg-primary hover:bg-primary/90 font-bold">Save Changes</Button>
                            </div>
                        </CardContent>
                    </AdminCard>
                )}
            </div>

            <BulkActionBar
                selectedCount={selectedIds.size}
                onDeselectAll={() => setSelectedIds(new Set())}
                label="Categories Selected"
                actions={bulkActions}
            />
        </div>
    );
}

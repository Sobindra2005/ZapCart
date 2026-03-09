"use client";

import {
    Plus,
    Filter,
    Calendar,
    Clock,
    Zap,
    Edit,
    Trash2,
    Eye,
    Tag,
    Timer,
    Loader2,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@repo/ui/ui/button";
import { Badge } from "@repo/ui/ui/badge";
import {
    Card,
    CardContent,
} from "@repo/ui/ui/card";
import { Stat, StatsCards } from "@/components/common/StatsCards";
import { FormPopup } from "@repo/ui/ui/form-popup";
import { CreateCampaignForm } from "@/components/forms/CreateCampaignForm";
import { ServerTable, ServerTableColumn, SortConfig } from "@/components/common/ServerTable";
import { marketingApi } from "@/utils/api";

interface FlashSale {
    id: string;
    title: string;
    status: "Active" | "Upcoming" | "Ended";
    startTime: string;
    endTime: string;
    productsCount: number;
    totalRevenue: number;
    conversions: number;
    image: string;
}

interface ApiCampaign {
    _id?: string;
    id?: string;
    name?: string;
    title?: string;
    status?: string;
    startDate?: string;
    endDate?: string;
    products?: unknown[];
    totalRevenue?: number;
    conversions?: number;
    image?: string;
    bannerImage?: string;
}

const FALLBACK_IMAGE = "https://images.unsplash.com/photo-1556740738-b6a63e27c4df?auto=format&fit=crop&q=80&w=200&h=200";

const normalizeStatus = (value?: string): FlashSale["status"] => {
    const status = value?.toLowerCase();
    if (status === "active") {
        return "Active";
    }
    if (status === "upcoming" || status === "draft" || status === "paused") {
        return "Upcoming";
    }
    return "Ended";
};

const toApiStatus = (value: FlashSale["status"]): string => {
    if (value === "Active") {
        return "active";
    }
    if (value === "Upcoming") {
        return "upcoming";
    }
    return "expired";
};

const extractCampaignArray = (response: unknown): ApiCampaign[] => {
    const payload = (response as { data?: { data?: unknown } })?.data?.data;

    if (Array.isArray(payload)) {
        return payload as ApiCampaign[];
    }

    if (
        payload &&
        typeof payload === "object" &&
        "campaigns" in payload &&
        Array.isArray((payload as { campaigns?: unknown }).campaigns)
    ) {
        return (payload as { campaigns: ApiCampaign[] }).campaigns;
    }

    return [];
};

const extractCampaignDetail = (response: unknown): ApiCampaign | null => {
    const payload = (response as { data?: { data?: unknown } })?.data?.data;
    if (Array.isArray(payload)) {
        return (payload[0] as ApiCampaign | undefined) ?? null;
    }
    if (payload && typeof payload === "object") {
        return payload as ApiCampaign;
    }
    return null;
};

const mapCampaignToFlashSale = (campaign: ApiCampaign): FlashSale => {
    const id = campaign._id ?? campaign.id ?? "";
    return {
        id,
        title: campaign.name ?? campaign.title ?? "Untitled Campaign",
        status: normalizeStatus(campaign.status),
        startTime: campaign.startDate ?? new Date().toISOString(),
        endTime: campaign.endDate ?? new Date().toISOString(),
        productsCount: campaign.products?.length ?? 0,
        totalRevenue: campaign.totalRevenue ?? 0,
        conversions: campaign.conversions ?? 0,
        image: campaign.image ?? campaign.bannerImage ?? FALLBACK_IMAGE,
    };
};

export default function FlashSalesPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
    const [selectedCampaignId, setSelectedCampaignId] = useState<string | null>(null);
    const [detailMode, setDetailMode] = useState<"view" | "edit">("view");

    const queryClient = useQueryClient();
    const itemsPerPage = 10;

    const {
        data: campaignsResponse,
        isLoading: isCampaignsLoading,
        isError: hasCampaignsError,
        refetch: refetchCampaigns,
    } = useQuery({
        queryKey: ["flash-sales", "campaigns"],
        queryFn: () => marketingApi.getCampaigns(),
    });

    const {
        data: campaignDetailResponse,
        isLoading: isCampaignDetailLoading,
        isError: hasCampaignDetailError,
        refetch: refetchCampaignDetail,
    } = useQuery({
        queryKey: ["flash-sales", "campaign", selectedCampaignId],
        queryFn: () => marketingApi.getCampaignById(selectedCampaignId as string),
        enabled: Boolean(selectedCampaignId),
    });

    const campaignDetail = useMemo(
        () => extractCampaignDetail(campaignDetailResponse),
        [campaignDetailResponse]
    );

    const updateCampaignMutation = useMutation({
        mutationFn: ({ id, status }: { id: string; status: string }) => {
            const formData = new FormData();
            formData.append("status", status);
            return marketingApi.updateCampaign(id, formData);
        },
        onSuccess: () => {
            toast.success("Campaign updated successfully");
            queryClient.invalidateQueries({ queryKey: ["flash-sales", "campaigns"] });
            if (selectedCampaignId) {
                queryClient.invalidateQueries({ queryKey: ["flash-sales", "campaign", selectedCampaignId] });
            }
        },
        onError: (error: unknown) => {
            toast.error("Failed to update campaign", {
                description: error instanceof Error ? error.message : "Please try again.",
            });
        },
    });

    const deleteCampaignMutation = useMutation({
        mutationFn: (id: string) => marketingApi.deleteCampaign(id),
        onSuccess: () => {
            toast.success("Campaign deleted successfully");
            if (selectedCampaignId === deleteCampaignMutation.variables) {
                setSelectedCampaignId(null);
            }
            queryClient.invalidateQueries({ queryKey: ["flash-sales", "campaigns"] });
        },
        onError: (error: unknown) => {
            toast.error("Failed to delete campaign", {
                description: error instanceof Error ? error.message : "Please try again.",
            });
        },
    });

    const StatusBadge = ({ status }: { status: FlashSale["status"] }) => {
        const styles = {
            Active: "bg-green-50 text-green-700 border-green-200 ring-2 ring-green-500/20 animate-pulse",
            Upcoming: "bg-blue-50 text-blue-700 border-blue-200",
            Ended: "bg-gray-50 text-gray-500 border-gray-200",
        };
        return (
            <Badge variant="outline" className={cn("px-2.5 py-0.5 font-bold", styles[status])}>
                {status}
            </Badge>
        );
    };

    const getSortValue = (sale: FlashSale, key: string) => {
        switch (key) {
            case "title":
                return sale.title.toLowerCase();
            case "status":
                return sale.status;
            case "startTime":
                return new Date(sale.startTime).getTime();
            case "totalRevenue":
                return sale.totalRevenue;
            case "conversions":
                return sale.conversions;
            default:
                return "";
        }
    };

    const openCampaignDetails = (id: string, mode: "view" | "edit") => {
        setSelectedCampaignId(id);
        setDetailMode(mode);
    };

    const handleDeleteCampaign = (id: string) => {
        const shouldDelete = window.confirm("Delete this campaign? This action cannot be undone.");
        if (!shouldDelete) {
            return;
        }
        deleteCampaignMutation.mutate(id);
    };

    const handleUpdateStatus = (sale: FlashSale) => {
        const nextStatus: FlashSale["status"] = sale.status === "Active" ? "Upcoming" : "Active";
        updateCampaignMutation.mutate({ id: sale.id, status: toApiStatus(nextStatus) });
    };

    const allSales = useMemo(() => {
        const campaigns = extractCampaignArray(campaignsResponse);
        return campaigns.map(mapCampaignToFlashSale);
    }, [campaignsResponse]);

    const filteredSales = useMemo(() => {
        const query = searchQuery.trim().toLowerCase();
        if (!query) {
            return allSales;
        }

        return allSales.filter((sale) =>
            sale.title.toLowerCase().includes(query) ||
            sale.status.toLowerCase().includes(query) ||
            sale.id.includes(query)
        );
    }, [allSales, searchQuery]);

    const sortedSales = useMemo(() => {
        if (!sortConfig.key || !sortConfig.direction) {
            return filteredSales;
        }

        return [...filteredSales].sort((a, b) => {
            const aValue = getSortValue(a, sortConfig.key as string);
            const bValue = getSortValue(b, sortConfig.key as string);

            if (aValue < bValue) {
                return sortConfig.direction === "asc" ? -1 : 1;
            }
            if (aValue > bValue) {
                return sortConfig.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }, [filteredSales, sortConfig]);

    const paginatedSales = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage;
        return sortedSales.slice(start, start + itemsPerPage);
    }, [currentPage, sortedSales, itemsPerPage]);

    const stats = useMemo<Stat[]>(() => {
        const activeCount = allSales.filter((sale) => sale.status === "Active").length;
        const totalRevenue = allSales.reduce((sum, sale) => sum + sale.totalRevenue, 0);
        const totalOrders = allSales.reduce((sum, sale) => sum + sale.conversions, 0);
        const avgConversionRate = allSales.length > 0
            ? (allSales.reduce((sum, sale) => sum + sale.conversions, 0) / allSales.length).toFixed(1)
            : "0.0";

        return [
            {
                label: "Active Campaigns",
                value: String(activeCount).padStart(2, "0"),
                trend: `${allSales.length} total`,
                trendDir: "up",
                vs: "Live Data"
            },
            {
                label: "Avg. Conversion Rate",
                value: `${avgConversionRate}%`,
                trend: `${totalOrders} orders`,
                trendDir: "up",
                vs: "Live Data"
            },
            {
                label: "Total Revenue",
                value: `$${totalRevenue.toLocaleString()}`,
                trend: `${allSales.length} campaigns`,
                trendDir: "up",
                vs: "Live Data"
            },
            {
                label: "Items Sold Flash",
                value: totalOrders.toLocaleString(),
                trend: `${allSales.length} campaigns`,
                trendDir: "up",
                vs: "Live Data"
            }
        ];
    }, [allSales]);

    const handleSort = (key: string) => {
        let direction: "asc" | "desc" | null = "asc";
        if (sortConfig.key === key) {
            if (sortConfig.direction === "asc") {
                direction = "desc";
            } else if (sortConfig.direction === "desc") {
                direction = null;
            }
        }
        setSortConfig({ key, direction });
        setCurrentPage(1);
    };

    const handleSearchChange = (value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
    };

    const columns = useMemo<ServerTableColumn<FlashSale>[]>(() => [
        {
            header: "Campaign Details",
            accessorKey: "title",
            sortable: true,
            sortKey: "title",
            cell: (sale) => (
                <div className="flex items-center gap-4">
                    <div className="h-14 w-20 rounded-lg overflow-hidden relative border border-gray-100 shadow-sm shrink-0">
                        <Image src={sale.image} alt={sale.title} fill className="object-cover" />
                        {sale.status === "Active" && (
                            <div className="absolute top-1 right-1 h-2 w-2 bg-green-500 rounded-full border border-white" />
                        )}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900 leading-tight mb-1 group-hover:text-primary transition-colors cursor-pointer">
                            {sale.title}
                        </h3>
                        <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
                            <span className="flex items-center gap-1">
                                <Tag className="h-3 w-3" />
                                {sale.productsCount} Products
                            </span>
                            <span>•</span>
                            <span>ID: #{sale.id}</span>
                        </div>
                    </div>
                </div>
            ),
            className: "px-6 py-4",
            cellClassName: "px-6 py-4",
        },
        {
            header: "Status",
            accessorKey: "status",
            sortable: true,
            sortKey: "status",
            align: "center",
            cell: (sale) => <StatusBadge status={sale.status} />,
            className: "px-6 py-4 text-center",
            cellClassName: "px-6 py-4 text-center",
        },
        {
            header: "Timing",
            accessorKey: "startTime",
            sortable: true,
            sortKey: "startTime",
            cell: (sale) => (
                <div className="space-y-1.5">
                    <div className="flex items-center gap-2 text-xs font-bold text-gray-700">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        {new Date(sale.startTime).toLocaleDateString()}
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="h-1.5 flex-1 bg-gray-100 rounded-full overflow-hidden min-w-25">
                            <div
                                className={cn(
                                    "h-full rounded-full",
                                    sale.status === "Active" ? "bg-green-500" : sale.status === "Upcoming" ? "bg-blue-400" : "bg-gray-300"
                                )}
                                style={{ width: sale.status === "Ended" ? "100%" : sale.status === "Active" ? "65%" : "0%" }}
                            />
                        </div>
                        {sale.status === "Active" && (
                            <span className="text-[10px] font-black text-gray-500 animate-pulse">8h left</span>
                        )}
                    </div>
                </div>
            ),
            className: "px-6 py-4",
            cellClassName: "px-6 py-4",
        },
        {
            header: "Performance",
            accessorKey: "totalRevenue",
            sortable: true,
            sortKey: "totalRevenue",
            align: "right",
            cell: (sale) => (
                <div className="flex flex-col items-end">
                    <span className="text-sm font-black text-gray-900">${sale.totalRevenue.toLocaleString()}</span>
                    <span className="text-[10px] font-bold text-gray-500 uppercase">{sale.conversions} orders</span>
                </div>
            ),
            className: "px-6 py-4 text-right",
            cellClassName: "px-6 py-4 text-right",
        },
        {
            header: "Actions",
            accessorKey: "id",
            align: "right",
            cell: (sale) => (
                <div className="flex items-center justify-end gap-1">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-primary"
                        onClick={() => openCampaignDetails(sale.id, "view")}
                        aria-label="View campaign details"
                    >
                        <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-primary"
                        onClick={() => openCampaignDetails(sale.id, "edit")}
                        aria-label="Edit campaign"
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-gray-400 hover:text-red-500"
                        onClick={() => handleDeleteCampaign(sale.id)}
                        disabled={deleteCampaignMutation.isPending && deleteCampaignMutation.variables === sale.id}
                        aria-label="Delete campaign"
                    >
                        {deleteCampaignMutation.isPending && deleteCampaignMutation.variables === sale.id ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                            <Trash2 className="h-4 w-4" />
                        )}
                    </Button>
                </div>
            ),
            className: "px-6 py-4 text-right",
            cellClassName: "px-6 py-4 text-right",
        }
    ], [deleteCampaignMutation.isPending, deleteCampaignMutation.variables]);

    return (
        <div className="p-8 space-y-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-end gap-4 mb-8">
                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* <Button variant="outline" className="flex-1 md:flex-none gap-2 font-bold border-gray-200 bg-white shadow-sm">
                        <BarChart3 className="h-4 w-4" />
                        Analytics
                    </Button> */}
                    <FormPopup
                        title="Create New Campaign"
                        description="Set up a new flash sale campaign."
                        className="max-w-4xl"
                        trigger={
                            <Button className="flex-1 md:flex-none gap-2 font-bold bg-primary hover:bg-primary/90 shadow-md shadow-primary/20">
                                <Plus className="h-4 w-4" strokeWidth={3} />
                                Create Campaign
                            </Button>
                        }
                    >
                        <CreateCampaignForm onSubmit={(data) => console.log(data)} />
                    </FormPopup>
                </div>
            </div>

            {/* Quick Stats */}
            <StatsCards stats={stats} />

            {/* Campaign List */}
            <ServerTable
                columns={columns}
                data={paginatedSales}
                getRowId={(sale) => sale.id}
                page={currentPage}
                limit={itemsPerPage}
                total={sortedSales.length}
                onPageChange={setCurrentPage}
                enableSearch
                searchValue={searchQuery}
                searchPlaceholder="Search campaigns..."
                onSearchChange={handleSearchChange}
                sortConfig={sortConfig}
                onSort={handleSort}
                isLoading={isCampaignsLoading}
                error={hasCampaignsError}
                onRetry={refetchCampaigns}
                toolbarContent={(
                    <div className="flex items-center gap-3">
                        <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-200">
                            <Filter className="h-4 w-4" />
                            Filter
                        </Button>
                        <Button variant="outline" size="sm" className="gap-2 font-bold border-gray-200">
                            <Calendar className="h-4 w-4" />
                            By Date
                        </Button>
                    </div>
                )}
                emptyTitle="No campaigns found"
                emptyMessage="Try adjusting your search or filters"
            />

            {selectedCampaignId && (
                <Card className="border border-gray-200 shadow-sm">
                    <CardContent className="p-6 space-y-4">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <p className="text-xs uppercase tracking-wide text-gray-500 font-bold">Campaign Details</p>
                                <h3 className="text-lg font-bold text-gray-900">
                                    {campaignDetail?.name ?? campaignDetail?.title ?? "Campaign"}
                                </h3>
                            </div>
                            <Button variant="outline" size="sm" onClick={() => setSelectedCampaignId(null)}>
                                Close
                            </Button>
                        </div>

                        {isCampaignDetailLoading ? (
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                <Loader2 className="h-4 w-4 animate-spin" />
                                Loading campaign details...
                            </div>
                        ) : hasCampaignDetailError ? (
                            <div className="space-y-3">
                                <p className="text-sm text-red-600">Failed to load campaign details.</p>
                                <Button variant="outline" size="sm" onClick={() => refetchCampaignDetail()}>
                                    Retry
                                </Button>
                            </div>
                        ) : campaignDetail ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                    <div>
                                        <p className="text-gray-500">Status</p>
                                        <p className="font-semibold text-gray-900">{normalizeStatus(campaignDetail.status)}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">Start Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {campaignDetail.startDate ? new Date(campaignDetail.startDate).toLocaleString() : "N/A"}
                                        </p>
                                    </div>
                                    <div>
                                        <p className="text-gray-500">End Date</p>
                                        <p className="font-semibold text-gray-900">
                                            {campaignDetail.endDate ? new Date(campaignDetail.endDate).toLocaleString() : "N/A"}
                                        </p>
                                    </div>
                                </div>

                                {detailMode === "edit" && (
                                    <div className="flex items-center gap-2 pt-2">
                                        <Button
                                            size="sm"
                                            onClick={() => updateCampaignMutation.mutate({ id: selectedCampaignId, status: "active" })}
                                            disabled={updateCampaignMutation.isPending}
                                        >
                                            {updateCampaignMutation.isPending && <Loader2 className="h-4 w-4 mr-1 animate-spin" />}
                                            Set Active
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateCampaignMutation.mutate({ id: selectedCampaignId, status: "upcoming" })}
                                            disabled={updateCampaignMutation.isPending}
                                        >
                                            Set Upcoming
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => updateCampaignMutation.mutate({ id: selectedCampaignId, status: "expired" })}
                                            disabled={updateCampaignMutation.isPending}
                                        >
                                            End Campaign
                                        </Button>
                                    </div>
                                )}

                                {detailMode === "view" && (
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => {
                                            const selectedSale = allSales.find((sale) => sale.id === selectedCampaignId);
                                            if (selectedSale) {
                                                handleUpdateStatus(selectedSale);
                                            }
                                        }}
                                        disabled={updateCampaignMutation.isPending}
                                    >
                                        {updateCampaignMutation.isPending ? (
                                            <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                                        ) : null}
                                        Quick Toggle Status
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500">No campaign details available.</p>
                        )}
                    </CardContent>
                </Card>
            )}

            {/* Empty State Mockup Strategy */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card className="border-dashed border-2 border-gray-200 shadow-none bg-gray-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                            <Timer className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Queue Management</h3>
                        <p className="text-sm text-gray-500 text-center max-w-70">Automate your sale starts and ends with precision scheduling.</p>
                        <Button variant="link" className="mt-4 font-bold text-primary">Learn more</Button>
                    </CardContent>
                </Card>

                <Card className="border-dashed border-2 border-gray-200 shadow-none bg-gray-50/50">
                    <CardContent className="flex flex-col items-center justify-center py-12">
                        <div className="h-16 w-16 bg-white rounded-2xl shadow-sm border border-gray-100 flex items-center justify-center mb-4">
                            <Zap className="h-8 w-8 text-gray-300" />
                        </div>
                        <h3 className="text-lg font-bold text-gray-900 mb-1">Smart Discounts</h3>
                        <p className="text-sm text-gray-500 text-center max-w-70">Apply dynamic discounts based on stock levels and demand.</p>
                        <Button variant="link" className="mt-4 font-bold text-primary">Coming soon</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

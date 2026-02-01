"use client";

import { Button } from "@repo/ui/ui/button";
import { Package, ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { orderApi } from "@/utils/api";
import { Order } from "./type";

// Helper color map for status
const statusColor = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
        case "delivered": return "default";
        case "shipped": return "secondary";
        case "placed":
        case "pending": return "outline";
        case "cancelled": return "destructive";
        default: return "default";
    }
};

const getStatusStyles = (status: string) => {
    const normalizedStatus = status.toLowerCase();
    switch (normalizedStatus) {
        case "delivered":
            return "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400 border-green-300 dark:border-green-800";
        case "shipped":
            return "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400 border-blue-300 dark:border-blue-800";
        case "placed":
        case "pending":
            return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400 border-yellow-300 dark:border-yellow-800";
        case "cancelled":
            return "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400 border-red-300 dark:border-red-800";
        default:
            return "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400 border-gray-300 dark:border-gray-800";
    }
};

export default function OrdersPage() {
    const { data, isLoading, error } = useQuery({
        queryKey: ["orders"],
        queryFn: async () => {
            const response = await orderApi.getMyOrders();
            return response.data as { orders: Order[] };
        },
    });

    const orders = data?.orders || [];

    if (isLoading) {
        return (
            <div className="flex items-center justify-center py-12">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-12">
                <p className="text-destructive">Failed to load orders. Please try again later.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Order History</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                        <div className="bg-linear-to-r from-muted/60 to-muted/40 p-5 flex flex-wrap gap-4 justify-between items-center">
                            <div className="flex flex-wrap gap-6">
                                <div className="space-y-1">
                                    <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">Order Placed</span>
                                    <span className="font-medium">{new Date(order.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">Total Amount</span>
                                    <span className="font-semibold text-primary">${parseFloat(order.totalAmount).toFixed(2)}</span>
                                </div>
                                <div className="space-y-1">
                                    <span className="block text-xs font-medium text-muted-foreground uppercase tracking-wide">Order Number</span>
                                    <span className="font-mono text-sm bg-background/80 px-2 py-1 rounded border">{order.orderNumber}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className={`px-3 py-1.5 rounded-md font-semibold text-sm border ${getStatusStyles(order.status)}`}>
                                    {order.status.toUpperCase()}
                                </span>
                            </div>
                        </div>

                        <div className="p-5 space-y-3 bg-background">
                            {order.orderItems.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center p-3 rounded-lg hover:bg-muted/30 transition-colors">
                                    <div className="relative h-20 w-20 bg-muted rounded-md overflow-hidden shrink-0 border">
                                        {item.product?.thumbnail ? (
                                            <Image
                                                src={item.product.thumbnail}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
                                                <Package className="h-8 w-8 opacity-30" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <h4 className="font-medium truncate">{item.product?.name || `SKU: ${item.sku}`}</h4>
                                        <div className="flex items-center gap-2 flex-wrap">
                                            <span className="text-xs text-muted-foreground font-mono">SKU: {item.sku}</span>
                                            <span className="inline-flex items-center gap-1 text-sm font-medium px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                                                Qty: <span className="font-bold">{item.quantity}</span>
                                            </span>
                                            <span className="text-xs text-muted-foreground">
                                                × ${parseFloat(item.unitPrice).toFixed(2)}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right space-y-0.5">
                                        <div className="font-semibold">${parseFloat(item.totalPrice).toFixed(2)}</div>
                                        {parseFloat(item.discount) > 0 && (
                                            <div className="text-xs text-green-600 dark:text-green-400 font-medium">
                                                −${parseFloat(item.discount).toFixed(2)}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-muted/5 flex justify-end">
                            <Button variant="outline" size="sm" className="gap-2 font-semibold">
                                View Details
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {orders.length === 0 && (
                    <div className="text-center py-12">
                        <Package className="h-12 w-12 mx-auto text-muted-foreground opacity-50 mb-4" />
                        <h3 className="text-lg font-medium">No orders yet</h3>
                        <p className="text-muted-foreground">Looks like you haven&apos;t placed any orders yet.</p>
                        <Button className="mt-4" variant="default">Start Shopping</Button>
                    </div>
                )}
            </div>
        </div>
    );
}

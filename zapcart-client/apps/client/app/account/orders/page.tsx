"use client";

import { mockUser } from "@/data/mockAccountData";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Package, ChevronRight } from "lucide-react";
import Image from "next/image";

// Helper color map for status
const statusColor = (status: string) => {
    switch (status) {
        case "Delivered": return "default"; // or success variant if available, default is black/primary
        case "Shipped": return "secondary";
        case "Placed": return "outline";
        case "Cancelled": return "destructive";
        default: return "default";
    }
};

export default function OrdersPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Order History</h1>

            <div className="space-y-4">
                {mockUser.orders.map((order) => (
                    <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-muted/40 p-4 flex flex-wrap gap-4 justify-between items-center text-sm">
                            <div className="flex gap-6">
                                <div>
                                    <span className="block text-muted-foreground">Order Placed</span>
                                    <span className="font-medium">{new Date(order.date).toLocaleDateString()}</span>
                                </div>
                                <div>
                                    <span className="block text-muted-foreground">Total</span>
                                    <span className="font-medium">${order.total.toFixed(2)}</span>
                                </div>
                                <div>
                                    <span className="block text-muted-foreground">Order #</span>
                                    <span className="font-medium">{order.id}</span>
                                </div>
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-muted-foreground hidden sm:inline">Status:</span>
                                <Badge variant={statusColor(order.status)}>{order.status}</Badge>
                            </div>
                        </div>

                        <div className="p-4 space-y-4">
                            {order.items.map((item) => (
                                <div key={item.id} className="flex gap-4 items-center">
                                    <div className="relative h-16 w-16 bg-muted rounded overflow-hidden flex-shrink-0">
                                        <Image
                                            src={item.product.image}
                                            alt={item.product.name}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h4 className="font-medium truncate">{item.product.name}</h4>
                                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-semibold">${item.price.toFixed(2)}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-4 border-t bg-muted/10 flex justify-end">
                            <Button variant="outline" size="sm" className="gap-2">
                                View Details
                                <ChevronRight className="h-4 w-4" />
                            </Button>
                        </div>
                    </div>
                ))}

                {mockUser.orders.length === 0 && (
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

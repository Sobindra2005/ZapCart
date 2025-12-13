"use client";

import { mockUser } from "@/data/mockAccountData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Trash2, Plus } from "lucide-react";

export default function PaymentsPage() {
    const paymentMethods = mockUser.paymentMethods;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Payment Methods</h1>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Payment Method
                </Button>
            </div>

            <div className="space-y-4">
                {paymentMethods.map((method) => (
                    <Card key={method.id} className="relative">
                        <CardContent className="p-6 flex items-center justify-between">
                            <div className="flex items-center gap-4">
                                <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                                    {/* Simple brand icon placeholder */}
                                    <CreditCard className="h-6 w-6 text-muted-foreground" />
                                </div>
                                <div>
                                    <p className="font-semibold">
                                        {method.brand} {method.type === "Credit Card" ? `•••• ${method.last4}` : ""}
                                    </p>
                                    {method.expiryDate && (
                                        <p className="text-sm text-muted-foreground">Expires {method.expiryDate}</p>
                                    )}
                                    {method.isDefault && (
                                        <p className="text-xs text-primary font-medium mt-1">Default</p>
                                    )}
                                </div>
                            </div>
                            <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-red-500">
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    );
}

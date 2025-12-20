"use client";

import { useState } from "react";
import { mockUser } from "@/data/mockAccountData";
import { PaymentMethod } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Trash2, Plus } from "lucide-react";
import { AddPaymentMethodForm } from "@/components/account/AddPaymentMethodForm";

export default function PaymentsPage() {
    const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(
        mockUser.paymentMethods
    );
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleAddPaymentMethod = (newPaymentMethod: PaymentMethod) => {
        setPaymentMethods([...paymentMethods, newPaymentMethod]);
    };

    const handleDeletePaymentMethod = (id: string) => {
        setPaymentMethods(paymentMethods.filter((pm) => pm.id !== id));
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Payment Methods</h1>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Add Payment Method
                </Button>
            </div>
            {paymentMethods.length > 0 ? (
                <div className="space-y-4">
                    {paymentMethods.map((method) => (
                        <Card key={method.id} className="relative">
                            <CardContent className="p-6 flex items-center justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-16 bg-muted rounded flex items-center justify-center">
                                        <CreditCard className="h-6 w-6 text-muted-foreground" />
                                    </div>
                                    <div>
                                        <p className="font-semibold">
                                            {method.brand}{" "}
                                            {method.type === "Credit Card" ? `•••• ${method.last4}` : method.type}
                                        </p>
                                        {method.expiryDate && (
                                            <p className="text-sm text-muted-foreground">
                                                Expires {method.expiryDate}
                                            </p>
                                        )}
                                        {method.isDefault && (
                                            <p className="text-xs text-primary font-medium mt-1">
                                                Default
                                            </p>
                                        )}
                                    </div>
                                </div>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-muted-foreground hover:text-red-500"
                                    onClick={() => handleDeletePaymentMethod(method.id)}
                                >
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            ) : (
                <Card className="border-dashed">
                    <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                        <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                            <CreditCard className="h-6 w-6 text-muted-foreground" />
                        </div>
                        <h3 className="text-lg font-semibold">No payment methods</h3>
                        <p className="text-sm text-muted-foreground max-w-xs mt-1">
                            You haven&apos;t added any payment methods yet. Add one to make
                            checkout faster.
                        </p>
                    </CardContent>
                </Card>
            )}

            <AddPaymentMethodForm
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSubmit={handleAddPaymentMethod}
            />
        </div>
    );
}

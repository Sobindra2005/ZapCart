"use client";

import { useEffect, useState } from "react";
import { Address } from "@/types/user";
import { Button } from "@repo/ui/ui/button";
import { Plus, Loader2 } from "lucide-react";
import { AddressCard } from "@/components/account/AddressCard";
import { AddAddressForm } from "@/components/account/AddAddressForm";
import { useQuery, useMutation } from "@tanstack/react-query";
import { addressApi } from "@/utils/api";
import { getQueryClient } from "../../../../../../packages/ui/src/get-query-client";
import { is } from "zod/v4/locales";

export default function AddressPage() {
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
    const queryClient = getQueryClient();

    // Fetch user addresses
    const { data, isLoading, error } = useQuery({
        queryKey: ['userAddresses'],
        queryFn: async () => {
            const response = await addressApi.getUserAddress();
            return response.data.addresses as Address[];
        },
    });

    // Delete address mutation
    const deleteMutation = useMutation({
        mutationFn: (id: string) => addressApi.deleteAddress(id),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
        },
    });

    // Update address mutation (for setting default)
    const updateMutation = useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => addressApi.updateAddress(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
        },
    });

    // Create address mutation
    const createMutation = useMutation({
        mutationFn: (data: any) => addressApi.createAddress(data),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['userAddresses'] });
            setIsAddDialogOpen(false);
        },
    });

    const handleSetDefault = (id: string) => {
        updateMutation.mutate({ id, data: { isDefault: true } });
    };

    const handleDelete = (id: string) => {
        deleteMutation.mutate(id);
    };

    const handleEdit = (id: string) => {
        console.log("Edit address", id);
    };

    const handleAddAddress = (newAddress: Address) => {
        const { id, ...addressData } = newAddress;
        createMutation.mutate(addressData);
    };

    if (error && !data) {
        return (
            <div className="space-y-6">
                <h1 className="text-2xl font-bold">Address Book</h1>
                <div className="text-center py-12">
                    <p className="text-red-500">Error loading addresses. Please try again later.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Address Book</h1>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => setIsAddDialogOpen(true)}
                    disabled={createMutation.isPending}
                >
                    <Plus className="h-4 w-4" />
                    Add New Address
                </Button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-12">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            ) : data?.length === 0 ? (
                <div className="text-center py-12 border border-dashed rounded-lg">
                    <p className="text-muted-foreground mb-4">No addresses found</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                        <Plus className="h-4 w-4 mr-2" />
                        Add Your First Address
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                    {data?.map((address) => (
                        <AddressCard
                            key={address.id}
                            address={address}
                            onEdit={handleEdit}
                            onDelete={handleDelete}
                            onSetDefault={handleSetDefault}
                        />
                    ))}
                </div>
            )}

            <AddAddressForm
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSubmit={handleAddAddress}
            />
        </div>
    );
}

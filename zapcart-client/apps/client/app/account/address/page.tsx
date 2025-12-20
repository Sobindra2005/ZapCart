"use client";

import { useState } from "react";
import { mockUser } from "@/data/mockAccountData";
import { Address } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddressCard } from "@/components/account/AddressCard";
import { AddAddressForm } from "@/components/account/AddAddressForm";

export default function AddressPage() {
    const [addresses, setAddresses] = useState<Address[]>(mockUser.addresses);
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

    const handleSetDefault = (id: string) => {
        setAddresses(
            addresses.map((addr) => ({
                ...addr,
                isDefault: addr.id === id,
            }))
        );
    };

    const handleDelete = (id: string) => {
        // Prevent deleting default address logic if enforced, for now filtered
        setAddresses(addresses.filter((addr) => addr.id !== id));
    };

    const handleEdit = (id: string) => {
        console.log("Edit address", id);
        // TODO: Implement edit functionality
    };

    const handleAddAddress = (newAddress: Address) => {
        setAddresses([...addresses, newAddress]);
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Address Book</h1>
                <Button
                    className="flex items-center gap-2"
                    onClick={() => setIsAddDialogOpen(true)}
                >
                    <Plus className="h-4 w-4" />
                    Add New Address
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
                {addresses.map((address) => (
                    <AddressCard
                        key={address.id}
                        address={address}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onSetDefault={handleSetDefault}
                    />
                ))}
            </div>

            <AddAddressForm
                open={isAddDialogOpen}
                onOpenChange={setIsAddDialogOpen}
                onSubmit={handleAddAddress}
            />
        </div>
    );
}

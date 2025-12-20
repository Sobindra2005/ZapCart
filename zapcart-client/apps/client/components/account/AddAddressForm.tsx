"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { addressSchema, AddressFormData } from "@/lib/schemas/address.schema";
import { Address } from "@/types/user";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { MapPin } from "lucide-react";
import { FaExclamationCircle } from "react-icons/fa";

interface AddAddressFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (address: Address) => void;
}

export function AddAddressForm({ open, onOpenChange, onSubmit }: AddAddressFormProps) {
    const form = useForm<AddressFormData>({
        resolver: zodResolver(addressSchema),
        defaultValues: {
            type: "Home",
            street: "",
            city: "",
            state: "",
            zipCode: "",
            country: "",
        },
    });

    const handleSubmit = (data: AddressFormData) => {
        // Create new address with mock ID
        const newAddress: Address = {
            id: crypto.randomUUID(),
            type: data.type,
            street: data.street,
            city: data.city,
            state: data.state,
            zipCode: data.zipCode,
            country: data.country,
            isDefault: false,
        };

        onSubmit(newAddress);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Add New Address
                    </DialogTitle>
                    <DialogDescription>
                        Enter your address details below. All fields are required.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Address Type</FormLabel>
                                    <div className="relative">
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger className={fieldState.error ? "border-red-500" : ""}>
                                                    <SelectValue placeholder="Select address type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Home">Home</SelectItem>
                                                <SelectItem value="Work">Work</SelectItem>
                                                <SelectItem value="Other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        {fieldState.error && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="absolute right-10 top-3 text-red-500 cursor-help z-10">
                                                            <FaExclamationCircle size={14} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="bg-red-500 text-white">
                                                        <p>{fieldState.error.message}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="street"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Street Address</FormLabel>
                                    <div className="relative">
                                        <FormControl>
                                            <Input
                                                placeholder="123 Main Street"
                                                {...field}
                                                className={fieldState.error ? "border-red-500 pr-10" : ""}
                                            />
                                        </FormControl>
                                        {fieldState.error && (
                                            <TooltipProvider delayDuration={0}>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <div className="absolute right-3 top-3 text-red-500 cursor-help z-10">
                                                            <FaExclamationCircle size={14} />
                                                        </div>
                                                    </TooltipTrigger>
                                                    <TooltipContent side="right" className="bg-red-500 text-white">
                                                        <p>{fieldState.error.message}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="city"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>City</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    placeholder="New York"
                                                    {...field}
                                                    className={fieldState.error ? "border-red-500 pr-10" : ""}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="absolute right-3 top-3 text-red-500 cursor-help z-10">
                                                                <FaExclamationCircle size={14} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="bg-red-500 text-white">
                                                            <p>{fieldState.error.message}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="state"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>State/Province</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    placeholder="NY"
                                                    {...field}
                                                    className={fieldState.error ? "border-red-500 pr-10" : ""}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="absolute right-3 top-3 text-red-500 cursor-help z-10">
                                                                <FaExclamationCircle size={14} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="bg-red-500 text-white">
                                                            <p>{fieldState.error.message}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <FormField
                                control={form.control}
                                name="zipCode"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Zip Code</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    placeholder="10001"
                                                    {...field}
                                                    className={fieldState.error ? "border-red-500 pr-10" : ""}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="absolute right-3 top-3 text-red-500 cursor-help z-10">
                                                                <FaExclamationCircle size={14} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="bg-red-500 text-white">
                                                            <p>{fieldState.error.message}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="country"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>Country</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    placeholder="USA"
                                                    {...field}
                                                    className={fieldState.error ? "border-red-500 pr-10" : ""}
                                                />
                                            </FormControl>
                                            {fieldState.error && (
                                                <TooltipProvider delayDuration={0}>
                                                    <Tooltip>
                                                        <TooltipTrigger asChild>
                                                            <div className="absolute right-3 top-3 text-red-500 cursor-help z-10">
                                                                <FaExclamationCircle size={14} />
                                                            </div>
                                                        </TooltipTrigger>
                                                        <TooltipContent side="right" className="bg-red-500 text-white">
                                                            <p>{fieldState.error.message}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        </div>

                        <div className="flex justify-end gap-3 pt-4">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    form.reset();
                                    onOpenChange(false);
                                }}
                            >
                                Cancel
                            </Button>
                            <Button type="submit">Add Address</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

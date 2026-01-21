"use client";

import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { checkoutSchema, CheckoutFormData } from "@repo/lib/schemas/checkout.schema";
import { Button } from "@repo/ui/ui/button";
import { Label } from "@repo/ui/ui/label";
import { RadioGroup, RadioGroupItem } from "@repo/ui/ui/radio-group";
import { Form } from "@repo/ui/ui/form";
import { FormInput } from "@repo/ui/form/FormInput";
import { LocationPicker } from "./LocationPicker";
import { AddressFields } from "./AddressFields";
import { AnimatePresence, motion } from "framer-motion";
import { MdEmail, MdPerson } from "react-icons/md";
import { Checkbox } from "@repo/ui/ui/checkbox";
import { selectUser, useUserStore } from "@/stores";
import { useQuery } from "@tanstack/react-query";
import { addressApi } from "@/utils/api";
import { Address } from "@/types/user";

interface OrderDetails {
    paymentMethod: string;
}

interface CheckoutFormProps {
    onPlaceOrder: (details: OrderDetails) => void;
    onBack: () => void;
}

export function CheckoutForm({ onPlaceOrder, onBack }: CheckoutFormProps) {
    const [showLocationPicker, setShowLocationPicker] = useState(false);
    const [isShippingPicker, setIsShippingPicker] = useState(true);
    const user = useUserStore(selectUser);
    const form = useForm<CheckoutFormData>({
        resolver: zodResolver(checkoutSchema),
        defaultValues: {
            firstName: user?.firstName || "",
            lastName: user?.lastName || "",
            email: user?.email || "",
            address: "",
            city: "",
            zip: "",
            shippingCoordinates: null,
            sameAsBilling: true,
            billingAddress: "",
            billingCity: "",
            billingZip: "",
            billingCoordinates: null,
            paymentMethod: "card",
        },
        mode: "onChange",
    });

    const { data } = useQuery({
        queryKey: ['userAddresses'],
        queryFn: addressApi.getUserAddress

    })

    const defaultAddress: Address[] = data?.data.addresses

    useEffect(() => {
        if (user) {
            form.setValue("firstName", user.firstName || "");
            form.setValue("lastName", user.lastName || "");
            form.setValue("email", user.email || "");
            if (defaultAddress && defaultAddress.length > 0) {
                form.setValue("address", defaultAddress[0].address || "");
                form.setValue("city", defaultAddress[0].city || "");
                form.setValue("zip", defaultAddress[0].postalCode || "");
                form.setValue("shippingCoordinates", {
                    lat: defaultAddress[0].location.latitude,
                    lng: defaultAddress[0].location.longitude,
                });
            }
        }
    }, [user, form , defaultAddress]);

    const sameAsBilling = form.watch("sameAsBilling");

    const onSubmit = (data: CheckoutFormData) => {

        console.log("Checkout data:", data);

        // Simulate processing
        // setTimeout(() => {
        //     onPlaceOrder({ paymentMethod: data.paymentMethod });
        // }, 1000);
    };

    const handleLocationSelect = (location: { lat: number; lng: number; address: string; city: string; zip: string }) => {
        if (isShippingPicker) {
            form.setValue("address", location.address, { shouldValidate: true });
            form.setValue("city", location.city, { shouldValidate: true });
            form.setValue("zip", location.zip, { shouldValidate: true });
            form.setValue("shippingCoordinates", { lat: location.lat, lng: location.lng }, { shouldValidate: true });
        } else {
            form.setValue("billingAddress", location.address, { shouldValidate: true });
            form.setValue("billingCity", location.city, { shouldValidate: true });
            form.setValue("billingZip", location.zip, { shouldValidate: true });
            form.setValue("billingCoordinates", { lat: location.lat, lng: location.lng }, { shouldValidate: true });
        }
    };

    const openShippingPicker = () => {
        setIsShippingPicker(true);
        setShowLocationPicker(true);
    };

    const openBillingPicker = () => {
        setIsShippingPicker(false);
        setShowLocationPicker(true);
    };

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="bg-white rounded-lg p-6 shadow-sm"
        >
            <h2 className="text-2xl font-bold mb-6">Checkout Details</h2>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Shipping Information</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <FormInput
                                control={form.control}
                                name="firstName"
                                label="First Name"
                                placeholder="John"
                                disabled={!!user?.firstName}
                                icon={<MdPerson size={18} />}
                            />
                            <FormInput
                                control={form.control}
                                name="lastName"
                                label="Last Name"
                                placeholder="Doe"
                                disabled={!!user?.lastName}
                                icon={<MdPerson size={18} />}
                            />
                        </div>

                        <FormInput
                            control={form.control}
                            name="email"
                            label="Email"
                            type="email"
                            disabled={!!user?.email}
                            placeholder="john@example.com"
                            icon={<MdEmail size={18} />}
                        />

                        <AddressFields
                            control={form.control}
                            showMapPicker={true}
                            onMapPickerClick={openShippingPicker}
                        />
                    </div>


                    <div className="space-y-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="sameAsBilling"
                                checked={sameAsBilling}
                                onCheckedChange={(checked: boolean) =>
                                    form.setValue("sameAsBilling", checked, { shouldValidate: true })
                                }
                            />
                            <Label
                                htmlFor="sameAsBilling"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                            >
                                Billing address is the same as shipping address
                            </Label>
                        </div>

                        <AnimatePresence mode="wait">
                            {!sameAsBilling && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    exit={{ opacity: 0, height: 0 }}
                                    transition={{ duration: 0.3 }}
                                    className="space-y-4"
                                >
                                    <h3 className="text-lg font-semibold">Billing Address</h3>
                                    <AddressFields
                                        control={form.control}
                                        prefix="billing"
                                        showMapPicker={true}
                                        onMapPickerClick={openBillingPicker}
                                    />
                                </motion.div>

                            )}
                        </AnimatePresence>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Payment Method</h3>
                        <Controller
                            control={form.control}
                            name="paymentMethod"
                            render={({ field }) => (
                                <RadioGroup
                                    value={field.value}
                                    onValueChange={field.onChange}
                                    className="flex flex-col space-y-2"
                                >
                                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                                        <RadioGroupItem value="card" id="card" />
                                        <Label htmlFor="card" className="flex-1 cursor-pointer">Credit Card</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                                        <RadioGroupItem value="paypal" id="paypal" />
                                        <Label htmlFor="paypal" className="flex-1 cursor-pointer">PayPal</Label>
                                    </div>
                                    <div className="flex items-center space-x-2 border p-4 rounded-md cursor-pointer hover:bg-gray-50">
                                        <RadioGroupItem value="cod" id="cod" />
                                        <Label htmlFor="cod" className="flex-1 cursor-pointer">Cash on Delivery</Label>
                                    </div>
                                </RadioGroup>
                            )}
                        />
                    </div>

                    <div className="flex gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
                            Back to Cart
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-black text-white hover:bg-gray-800"
                            disabled={!form.formState.isValid || form.formState.isSubmitting}
                        >
                            {form.formState.isSubmitting ? "Processing..." : "Place Order"}
                        </Button>
                    </div>
                </form>
            </Form>

            {/* Location Picker Modal */}
            <LocationPicker
                open={showLocationPicker}
                onClose={() => setShowLocationPicker(false)}
                onLocationSelect={handleLocationSelect}
            />
        </motion.div>
    );
}

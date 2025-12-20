"use client";

import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    paymentMethodSchema,
    PaymentMethodFormData,
} from "@/lib/schemas/payment.schema";
import { PaymentMethod } from "@/types/user";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
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
import { CreditCard } from "lucide-react";
import { FaExclamationCircle } from "react-icons/fa";

interface AddPaymentMethodFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onSubmit: (paymentMethod: PaymentMethod) => void;
}

export function AddPaymentMethodForm({
    open,
    onOpenChange,
    onSubmit,
}: AddPaymentMethodFormProps) {
    const form = useForm<PaymentMethodFormData>({
        resolver: zodResolver(paymentMethodSchema),
        defaultValues: {
            type: "Credit Card",
            cardNumber: "",
            cardholderName: "",
            expiryMonth: "",
            expiryYear: "",
            cvv: "",
            paypalEmail: "",
        },
    });

    const paymentType = form.watch("type");

    const handleSubmit = (data: PaymentMethodFormData) => {
        let newPaymentMethod: PaymentMethod;

        if (data.type === "Credit Card") {
            // Extract brand from card number (simplified logic)
            const firstDigit = data.cardNumber?.[0];
            let brand = "Unknown";
            if (firstDigit === "4") brand = "Visa";
            else if (firstDigit === "5") brand = "Mastercard";
            else if (firstDigit === "3") brand = "Amex";

            newPaymentMethod = {
                id: `pm-${Date.now()}`,
                type: "Credit Card",
                last4: data.cardNumber?.slice(-4),
                expiryDate: `${data.expiryMonth}/${data.expiryYear}`,
                brand,
                isDefault: false,
            };
        } else {
            newPaymentMethod = {
                id: `pm-${Date.now()}`,
                type: "PayPal",
                isDefault: false,
            };
        }

        onSubmit(newPaymentMethod);
        form.reset();
        onOpenChange(false);
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        Add Payment Method
                    </DialogTitle>
                    <DialogDescription>
                        Add a new payment method to your account.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form
                        onSubmit={form.handleSubmit(handleSubmit)}
                        className="space-y-4"
                    >
                        <FormField
                            control={form.control}
                            name="type"
                            render={({ field, fieldState }) => (
                                <FormItem>
                                    <FormLabel>Payment Type</FormLabel>
                                    <div className="relative">
                                        <Select
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger
                                                    className={fieldState.error ? "border-red-500" : ""}
                                                >
                                                    <SelectValue placeholder="Select payment type" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem value="Credit Card">Credit Card</SelectItem>
                                                <SelectItem value="PayPal">PayPal</SelectItem>
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
                                                    <TooltipContent
                                                        side="right"
                                                        className="bg-red-500 text-white"
                                                    >
                                                        <p>{fieldState.error.message}</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        )}
                                    </div>
                                </FormItem>
                            )}
                        />

                        {paymentType === "Credit Card" && (
                            <>
                                <FormField
                                    control={form.control}
                                    name="cardholderName"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Cardholder Name</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="John Doe"
                                                        {...field}
                                                        className={
                                                            fieldState.error ? "border-red-500 pr-10" : ""
                                                        }
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
                                                            <TooltipContent
                                                                side="right"
                                                                className="bg-red-500 text-white"
                                                            >
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
                                    name="cardNumber"
                                    render={({ field, fieldState }) => (
                                        <FormItem>
                                            <FormLabel>Card Number</FormLabel>
                                            <div className="relative">
                                                <FormControl>
                                                    <Input
                                                        placeholder="1234567890123456"
                                                        maxLength={16}
                                                        {...field}
                                                        className={
                                                            fieldState.error ? "border-red-500 pr-10" : ""
                                                        }
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
                                                            <TooltipContent
                                                                side="right"
                                                                className="bg-red-500 text-white"
                                                            >
                                                                <p>{fieldState.error.message}</p>
                                                            </TooltipContent>
                                                        </Tooltip>
                                                    </TooltipProvider>
                                                )}
                                            </div>
                                        </FormItem>
                                    )}
                                />

                                <div className="grid grid-cols-3 gap-4">
                                    <FormField
                                        control={form.control}
                                        name="expiryMonth"
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel>Month</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="MM"
                                                            maxLength={2}
                                                            {...field}
                                                            className={
                                                                fieldState.error ? "border-red-500 pr-10" : ""
                                                            }
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
                                                                <TooltipContent
                                                                    side="right"
                                                                    className="bg-red-500 text-white"
                                                                >
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
                                        name="expiryYear"
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel>Year</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="YY"
                                                            maxLength={2}
                                                            {...field}
                                                            className={
                                                                fieldState.error ? "border-red-500 pr-10" : ""
                                                            }
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
                                                                <TooltipContent
                                                                    side="right"
                                                                    className="bg-red-500 text-white"
                                                                >
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
                                        name="cvv"
                                        render={({ field, fieldState }) => (
                                            <FormItem>
                                                <FormLabel>CVV</FormLabel>
                                                <div className="relative">
                                                    <FormControl>
                                                        <Input
                                                            placeholder="123"
                                                            maxLength={4}
                                                            type="password"
                                                            {...field}
                                                            className={
                                                                fieldState.error ? "border-red-500 pr-10" : ""
                                                            }
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
                                                                <TooltipContent
                                                                    side="right"
                                                                    className="bg-red-500 text-white"
                                                                >
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
                            </>
                        )}

                        {paymentType === "PayPal" && (
                            <FormField
                                control={form.control}
                                name="paypalEmail"
                                render={({ field, fieldState }) => (
                                    <FormItem>
                                        <FormLabel>PayPal Email</FormLabel>
                                        <div className="relative">
                                            <FormControl>
                                                <Input
                                                    type="email"
                                                    placeholder="you@example.com"
                                                    {...field}
                                                    className={
                                                        fieldState.error ? "border-red-500 pr-10" : ""
                                                    }
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
                                                        <TooltipContent
                                                            side="right"
                                                            className="bg-red-500 text-white"
                                                        >
                                                            <p>{fieldState.error.message}</p>
                                                        </TooltipContent>
                                                    </Tooltip>
                                                </TooltipProvider>
                                            )}
                                        </div>
                                    </FormItem>
                                )}
                            />
                        )}

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
                            <Button type="submit">Add Payment Method</Button>
                        </div>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    );
}

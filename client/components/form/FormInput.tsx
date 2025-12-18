"use client";

import * as React from "react";
import { Control, FieldPath, FieldValues } from "react-hook-form";
import {
    FormControl,
    FormField,
    FormItem,
    FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { FaExclamationCircle } from "react-icons/fa";

interface FormInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>;
    name: TName;
    label?: string;
    placeholder?: string;
    type?: string;
    icon?: React.ReactNode;
    className?: string;
    inputClassName?: string;
}

export function FormInput<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    placeholder,
    type = "text",
    icon,
    className,
    inputClassName,
}: FormInputProps<TFieldValues, TName>) {
    return (
        <FormField
            control={control}
            name={name}
            render={({ field, fieldState }) => (
                <FormItem className={className}>
                    {label && <FormLabel>{label}</FormLabel>}
                    <div className="relative">
                        {icon && (
                            <div className="absolute left-3 top-3 text-muted-foreground/60 z-10">
                                {icon}
                            </div>
                        )}
                        <FormControl>
                            <Input
                                {...field}
                                type={type}
                                placeholder={placeholder}
                                className={cn(
                                    icon && "pl-10",
                                    fieldState.error && "border-red-500 focus-visible:ring-red-500/50 pr-10",
                                    !fieldState.error && field.value && "border-green-500 focus-visible:ring-green-500/50 pr-10",
                                    inputClassName
                                )}
                            />
                        </FormControl>

                        {/* Success icon */}
                        {!fieldState.error && field.value && (
                            <div className="absolute right-3 top-3 text-green-500 z-10">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    width="14"
                                    height="14"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                >
                                    <polyline points="20 6 9 17 4 12" />
                                </svg>
                            </div>
                        )}

                        {/* Error icon with tooltip */}
                        {fieldState.error && (
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="absolute right-3 top-3 text-red-500 animate-in fade-in zoom-in cursor-help z-10">
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
    );
}

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
import { FaEye, FaEyeSlash, FaExclamationCircle } from "react-icons/fa";

interface FormPasswordInputProps<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
> {
    control: Control<TFieldValues>;
    name: TName;
    label?: string;
    placeholder?: string;
    icon?: React.ReactNode;
    className?: string;
    inputClassName?: string;
}

export function FormPasswordInput<
    TFieldValues extends FieldValues = FieldValues,
    TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({
    control,
    name,
    label,
    placeholder = "••••••••",
    icon,
    className,
    inputClassName,
}: FormPasswordInputProps<TFieldValues, TName>) {
    const [showPassword, setShowPassword] = React.useState(false);

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
                                type={showPassword ? "text" : "password"}
                                placeholder={placeholder}
                                className={cn(
                                    icon ? "pl-10" : "",
                                    fieldState.error ? "border-red-500 focus-visible:ring-red-500/50 pr-20" : "pr-10",
                                    !fieldState.error && field.value && "border-green-500 focus-visible:ring-green-500/50",
                                    inputClassName
                                )}
                            />
                        </FormControl>

                        {/* Error icon with tooltip */}
                        {fieldState.error && (
                            <TooltipProvider delayDuration={0}>
                                <Tooltip>
                                    <TooltipTrigger asChild>
                                        <div className="absolute right-10 top-3 text-red-500 animate-in fade-in zoom-in cursor-help z-10">
                                            <FaExclamationCircle size={14} />
                                        </div>
                                    </TooltipTrigger>
                                    <TooltipContent side="right" className="bg-red-500 text-white">
                                        <p>{fieldState.error.message}</p>
                                    </TooltipContent>
                                </Tooltip>
                            </TooltipProvider>
                        )}

                        {/* Password visibility toggle */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground z-10"
                        >
                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                </FormItem>
            )}
        />
    );
}

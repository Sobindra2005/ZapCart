"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, LoginFormData } from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { FormPasswordInput } from "@/components/form/FormPasswordInput";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";

export default function LoginPage() {
    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    });

    const onSubmit = (data: LoginFormData) => {
        // Mock submit
        console.log("Logging in with:", data);
    };

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">Welcome Back!</h1>
                <p className="text-muted-foreground mt-2">
                    Sign in to access your cart, orders, and exclusive deals
                </p>
            </div>

            {/* Toggle Button */}
            <div className="bg-muted/50 p-1 rounded-lg grid grid-cols-2 gap-1">
                <div className="flex items-center justify-center bg-background rounded-md shadow-sm py-2 px-4 transition-all">
                    <span className="font-semibold text-sm">Sign In</span>
                </div>
                <Link
                    href="/signup"
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground py-2 px-4 transition-all"
                >
                    <span className="font-medium text-sm">Signup</span>
                </Link>
            </div>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                    <FormInput
                        control={form.control}
                        name="email"
                        label="Email Address"
                        placeholder="you@example.com"
                        type="email"
                        icon={<MdEmail size={18} />}
                    />

                    <div className="grid gap-2">
                        <div className="flex items-center justify-between">
                            <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                Password
                            </label>
                            <Link href="#" className="text-xs text-blue-600 hover:underline">
                                Forgot password?
                            </Link>
                        </div>
                        <FormPasswordInput
                            control={form.control}
                            name="password"
                            placeholder="••••••••"
                            icon={<FaLock size={16} />}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={!form.formState.isValid || form.formState.isSubmitting}
                    >
                        {form.formState.isSubmitting ? "Logging in..." : "Continue"}
                    </Button>
                </form>
            </Form>

            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                        Or Continue With
                    </span>
                </div>
            </div>

            <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="icon-lg" className="rounded-full border-gray-200">
                    <FcGoogle size={28} />
                </Button>
            </div>
        </div>
    );
}

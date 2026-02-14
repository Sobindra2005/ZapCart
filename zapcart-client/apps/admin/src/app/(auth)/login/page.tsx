"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginFormData } from "@repo/lib/schemas/auth.schema";
import { Button } from "@repo/ui/ui/button";
import { Form } from "@repo/ui/ui/form";
import { FormInput } from "@repo/ui/form/FormInput";
import { FormPasswordInput } from "@repo/ui/form/FormPasswordInput";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { authApi } from "@/utils/api";
import { useAuthStore, useUserStore } from "@/stores";
import { setAuthToken } from "@repo/lib/actions/auth.actions";
import { AuthPageWrapper } from "../components/AuthPageWrapper";
import { AuthFormWrapper } from "../components/AuthFormWrapper";

export default function AdminLoginPage() {
    const router = useRouter();
    const login = useAuthStore((state) => state.login);
    const setUser = useUserStore((state) => state.setUser);

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "admin@ecommerce.com",
            password: "Test@123456",
        },
    });

    const loginMutation = useMutation({
        mutationFn: authApi.login,
        onSuccess: async (response: any) => {
            console.log("Login response:", response);

            if (response?.data.data?.tokens?.accessToken) {
                await setAuthToken(response.data.data.tokens.accessToken);
            }

            toast.success("Login successful!", {
                description: "Welcome to ZapCart Admin!",
            });

            form.reset();
            setUser(response?.data?.user);
            login();
            router.push('/');
        },
        onError: (error: any) => {
            console.error("Login error:", error);
            const errorMessage = error.response?.data?.message || "Invalid email or password.";
            toast.error("Login failed", {
                description: `${errorMessage}${error.response?.status ? ` (Status: ${error.response.status})` : ""}`,
            });
        },
    });

    const onSubmit = (data: LoginFormData) => {
        loginMutation.mutate({
            email: data.email,
            password: data.password,
        });
    };

    return (
        <AuthPageWrapper
            title="Admin Login"
            description="Sign in to access the ZapCart admin dashboard"
        >
            <AuthFormWrapper>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormInput
                            control={form.control}
                            name="email"
                            label="Email Address"
                            placeholder="admin@zapcart.com"
                            type="email"
                            icon={<MdEmail size={18} />}
                        />

                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Password
                                </label>
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
                            disabled={!form.formState.isValid || loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Logging in..." : "Sign In to Admin"}
                        </Button>
                    </form>
                </Form>

                <div className="mt-6 p-3 bg-muted/50 rounded-lg">
                    <p className="text-xs text-muted-foreground text-center">
                        For security purposes, only authorized administrators can access this portal.
                    </p>
                </div>
            </AuthFormWrapper>
        </AuthPageWrapper>
    );
}

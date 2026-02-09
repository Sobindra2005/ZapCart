"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { loginSchema, LoginFormData } from "@repo/lib/schemas/auth.schema";
import { Button } from "@repo/ui/ui/button";
import { Form } from "@repo/ui/ui/form";
import { FormInput } from "@repo/ui/form/FormInput";
import { FormPasswordInput } from "@repo/ui/form/FormPasswordInput";
import { FcGoogle } from "react-icons/fc";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import { toast } from "sonner";
import { authApi } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore } from "@/stores";
import { setAuthToken } from "@/app/actions/auth.actions";
import { AuthToggle } from "../components/AuthToggle";
import { AuthPageWrapper } from "../components/AuthPageWrapper";
import { AuthFormWrapper } from "../components/AuthFormWrapper";

export default function LoginPage() {
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
        onSuccess: async (response) => {
            console.log("Login response:", response);

            // Access token is in response.data.tokens.accessToken
            if (response?.data?.tokens?.accessToken) {
                console.log("Setting auth token in httpOnly cookie");
                await setAuthToken(response.data.tokens.accessToken);
            }

            toast.success("Login successful!", {
                description: "Welcome back!",
            });
            form.reset();
            setUser(response?.data?.user);
            console.log("Login successful");
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
            title="Welcome Back!"
            description="Sign in to access your cart, orders, and exclusive deals"
        >
            {/* Toggle Button */}
            <AuthToggle />

            <AuthFormWrapper>
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
                            disabled={!form.formState.isValid || loginMutation.isPending}
                        >
                            {loginMutation.isPending ? "Logging in..." : "Continue"}
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
            </AuthFormWrapper>
        </AuthPageWrapper>
    );
}

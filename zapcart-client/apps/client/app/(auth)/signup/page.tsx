"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { signupSchema, SignupFormData } from "@repo/lib/schemas/auth.schema";
import { Button } from "@repo/ui/ui/button";
import { Form } from "@repo/ui/ui/form";
import { FormInput } from "@repo/ui/form/FormInput";
import { FormPasswordInput } from "@repo/ui/form/FormPasswordInput";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";
import { toast } from "sonner";
import { authApi } from "@/utils/api";
import { useRouter } from "next/navigation";
import { useAuthStore, useUserStore } from "@/stores";
import { setAuthToken } from "@/app/actions/auth.actions";
import { AuthToggle } from "../components/AuthToggle";
import { AuthPageWrapper } from "../components/AuthPageWrapper";
import { AuthFormWrapper } from "../components/AuthFormWrapper";

export default function SignupPage() {
    const router = useRouter();

    const login = useAuthStore((state) => state.login);
    const setUser = useUserStore((state) => state.setUser);

    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "john doe",
            email: "email@example.com",
            password: "hello123",
            confirmPassword: "hello123",
        },
    });

    const signupMutation = useMutation({
        mutationFn: authApi.signup,
        onSuccess: async (response) => {
            if (response?.data?.tokens?.accessToken) {
                console.log("Setting auth token in httpOnly cookie");
                await setAuthToken(response.data.tokens.accessToken);
            }
            toast.success("Account created successfully!", {
                description: "Please check your email to verify your account.",
            });
            form.reset();
            setUser(response?.data?.user);
            login();
            router.push('/')
            toast.success("Login successfully!", {
                description: "You have been logged in automatically.",
            });
        },
        onError: (error: any) => {
            console.error("Signup error:", error);
            const errorMessage = error.response?.data?.message || "Failed to create account. Please try again.";
            toast.error("Signup failed", {
                description: `${errorMessage}${error.response?.status ? ` (Status: ${error.response.status})` : ""}`,
            });
        },
    });

    const onSubmit = (data: SignupFormData) => {
        const nameParts = data.name.trim().split(" ");
        const lastName = nameParts.length > 1 ? nameParts.pop() : "";
        const firstName = nameParts.join(" ");

        signupMutation.mutate({
            firstName,
            lastName: lastName || "",
            email: data.email,
            password: data.password,
        });
    };

    const isFormValid =
        form.watch("name") &&
        form.watch("email") &&
        form.watch("password") &&
        form.watch("confirmPassword") &&
        form.formState.isValid;

    return (
        <AuthPageWrapper
            title="Create Your Account"
            description="Create an account to start shopping."
        >
            {/* Toggle Button */}
            <AuthToggle />

            <AuthFormWrapper>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
                        <FormInput
                            control={form.control}
                            name="name"
                            label="Full Name"
                            placeholder="Enter your full name"
                            type="text"
                            icon={<FaUser size={16} />}
                            inputClassName="h-11"
                        />

                        <FormInput
                            control={form.control}
                            name="email"
                            label="Email Address"
                            placeholder="you@example.com"
                            type="email"
                            icon={<MdEmail size={18} />}
                            inputClassName="h-11"
                        />

                        <FormPasswordInput
                            control={form.control}
                            name="password"
                            label="Password"
                            placeholder="••••••••"
                            icon={<FaLock size={16} />}
                            inputClassName="h-11"
                        />

                        <FormPasswordInput
                            control={form.control}
                            name="confirmPassword"
                            label="Confirm Password"
                            placeholder="••••••••"
                            icon={<FaLock size={16} />}
                            inputClassName="h-11"
                        />

                        <Button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl h-12 text-base font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!isFormValid || signupMutation.isPending}
                        >
                            {signupMutation.isPending ? "Creating Account..." : "Create Account"}
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
                        <FcGoogle size={20} />
                    </Button>
                </div>
            </AuthFormWrapper>
        </AuthPageWrapper>
    );
}

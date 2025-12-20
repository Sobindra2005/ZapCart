"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema, SignupFormData } from "@/lib/schemas/auth.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormInput } from "@/components/form/FormInput";
import { FormPasswordInput } from "@/components/form/FormPasswordInput";
import { FcGoogle } from "react-icons/fc";
import { FaUser, FaLock } from "react-icons/fa";
import { MdEmail } from "react-icons/md";

export default function SignupPage() {
    const form = useForm<SignupFormData>({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        },
    });

    const onSubmit = (data: SignupFormData) => {
        console.log("Signing up with:", data);
    };

    const isFormValid =
        form.watch("name") &&
        form.watch("email") &&
        form.watch("password") &&
        form.watch("confirmPassword") &&
        form.formState.isValid;

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold">Join Our Store</h1>
                <p className="text-muted-foreground mt-2">
                    Create an account to start shopping and enjoy exclusive offers
                </p>
            </div>

            {/* Toggle Button */}
            <div className="bg-muted/50 p-1 rounded-lg grid grid-cols-2 gap-1">
                <Link
                    href="/login"
                    className="flex items-center justify-center text-muted-foreground hover:text-foreground py-2 px-4 transition-all"
                >
                    <span className="font-medium text-sm">Sign In</span>
                </Link>
                <div className="flex items-center justify-center bg-background rounded-md shadow-sm py-2 px-4 transition-all">
                    <span className="font-semibold text-sm">Signup</span>
                </div>
            </div>

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
                        disabled={!isFormValid}
                    >
                        Create Account
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
        </div>
    );
}

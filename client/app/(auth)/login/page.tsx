"use client"

import Link from "next/link"
import * as React from "react" // For useState
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import { FaCheck, FaExclamationCircle, FaEye, FaEyeSlash, FaLock } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

export default function LoginPage() {
    const [formData, setFormData] = React.useState({
        email: "",
        password: ""
    })
    const [showPassword, setShowPassword] = React.useState(false)

    // Real-time validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    const isEmailValid = emailRegex.test(formData.email)
    const isEmailInvalid = formData.email.length > 0 && !isEmailValid

    // Password validation (just check for existence for login, or maybe min length if desired, but existence is key)
    const isPasswordValid = formData.password.length > 0

    const isFormValid = isEmailValid && isPasswordValid

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = () => {
        // Mock submit
        console.log("Logging in with:", formData)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-header-2 md:text-header-1 font-bold">Welcome Back!</h1>
                <p className="text-body-small md:text-body text-muted-foreground mt-2">Sign in to access your cart, orders, and exclusive deals</p>
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

            <div className="grid gap-4">
                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                        Email Address
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground/60">
                            <MdEmail size={18} />
                        </div>
                        <Input
                            id="email"
                            placeholder="you@example.com"
                            type="email"
                            className={`pl-10 ${isEmailValid ? "border-green-500 focus-visible:ring-green-500/50" : isEmailInvalid ? "border-red-500 focus-visible:ring-red-500/50" : ""}`}
                            value={formData.email}
                            onChange={handleChange}
                        />

                        {/* Validation Icons */}
                        {isEmailValid && (
                            <div className="absolute right-3 top-3 text-green-500">
                                <FaCheck size={14} />
                            </div>
                        )}
                        {isEmailInvalid && (
                            <div className="absolute right-3 top-3 text-red-500 animate-in fade-in zoom-in">
                                <FaExclamationCircle size={14} />
                            </div>
                        )}
                    </div>
                    {isEmailInvalid && <p className="text-xs text-red-500">Please enter a valid email address</p>}
                </div>

                <div className="grid gap-2">
                    <div className="flex items-center justify-between">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                            Password
                        </label>
                        <Link href="#" className="text-xs text-blue-600 hover:underline">Forgot password?</Link>
                    </div>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground/60">
                            <FaLock size={16} />
                        </div>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className="pl-10 pr-10"
                            value={formData.password}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                </div>

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl h-12 text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                >
                    Continue
                </Button>
            </div>

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
    )
}

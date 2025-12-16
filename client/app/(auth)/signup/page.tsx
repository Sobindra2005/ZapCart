"use client"

import Link from "next/link"
import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { FcGoogle } from "react-icons/fc"
import { FaUser, FaLock, FaCheck, FaExclamationCircle, FaEye, FaEyeSlash } from "react-icons/fa"
import { MdEmail } from "react-icons/md"

export default function SignupPage() {
    const [formData, setFormData] = React.useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [showPassword, setShowPassword] = React.useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = React.useState(false)

    // Validation Logic
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    const isNameValid = formData.name.length > 2
    const isNameInvalid = formData.name.length > 0 && !isNameValid

    const isEmailValid = emailRegex.test(formData.email)
    const isEmailInvalid = formData.email.length > 0 && !isEmailValid

    const isPasswordValid = formData.password.length >= 8
    const isPasswordInvalid = formData.password.length > 0 && !isPasswordValid

    // Confirm Password Validation
    // Valid only if matching password AND password itself is valid
    // Invalid if typed something (length > 0) AND (doesn't match OR password invalid)
    const isConfirmValid = formData.confirmPassword.length > 0 && formData.confirmPassword === formData.password && isPasswordValid
    const isConfirmInvalid = formData.confirmPassword.length > 0 && !isConfirmValid

    const isFormValid = isNameValid && isEmailValid && isPasswordValid && isConfirmValid

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target
        setFormData(prev => ({ ...prev, [id]: value }))
    }

    const handleSubmit = () => {
        console.log("Signing up with:", formData)
    }

    return (
        <div className="flex flex-col gap-6">
            <div className="text-center md:text-left">
                <h1 className="text-header-2 md:text-header-1 font-bold">Join Our Store</h1>
                <p className="text-body-small md:text-body text-muted-foreground mt-2">Create an account to start shopping and enjoy exclusive offers</p>
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

            <div className="grid gap-4">

                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="name">
                        Full Name
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground/60">
                            <FaUser size={16} />
                        </div>
                        <Input
                            id="name"
                            placeholder="Enter your full name"
                            type="text"
                            className={`pl-10 h-11 ${isNameValid ? "border-green-500 focus-visible:ring-green-500/50" : isNameInvalid ? "border-red-500 focus-visible:ring-red-500/50" : ""}`}
                            value={formData.name}
                            onChange={handleChange}
                        />
                        {isNameValid && <div className="absolute right-3 top-3 text-green-500"><FaCheck size={14} /></div>}
                        {isNameInvalid && <div className="absolute right-3 top-3 text-red-500"><FaExclamationCircle size={14} /></div>}
                    </div>
                    {isNameInvalid && <p className="text-xs text-red-500">Name must be at least 3 characters</p>}
                </div>

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
                            className={`pl-10 h-11 ${isEmailValid ? "border-green-500 focus-visible:ring-green-500/50" : isEmailInvalid ? "border-red-500 focus-visible:ring-red-500/50" : ""}`}
                            value={formData.email}
                            onChange={handleChange}
                        />
                        {isEmailValid && <div className="absolute right-3 top-3 text-green-500"><FaCheck size={14} /></div>}
                        {isEmailInvalid && <div className="absolute right-3 top-3 text-red-500"><FaExclamationCircle size={14} /></div>}
                    </div>
                    {isEmailInvalid && <p className="text-xs text-red-500">Please enter a valid email address</p>}
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="password">
                        Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground/60">
                            <FaLock size={16} />
                        </div>
                        <Input
                            id="password"
                            placeholder="••••••••"
                            type={showPassword ? "text" : "password"}
                            className={`pl-10 pr-10 h-11 ${isPasswordValid ? "border-green-500 focus-visible:ring-green-500/50" : isPasswordInvalid ? "border-red-500 focus-visible:ring-red-500/50" : ""}`}
                            value={formData.password}
                            onChange={handleChange}
                        />

                        {/* For password, show eye toggle instead of check/x inside unless we want both. 
                     Typically toggle is more important. We could put check/x to the left of toggle or just use border.
                     Let's use border for feedback and eye for toggle. 
                 */}
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    {isPasswordInvalid && <p className="text-xs text-red-500">Password must be at least 8 characters</p>}
                </div>

                <div className="grid gap-2">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="confirmPassword">
                        Confirm Password
                    </label>
                    <div className="relative">
                        <div className="absolute left-3 top-3 text-muted-foreground/60">
                            <FaLock size={16} />
                        </div>
                        <Input
                            id="confirmPassword"
                            placeholder="••••••••"
                            type={showConfirmPassword ? "text" : "password"}
                            className={`pl-10 pr-10 h-11 ${isConfirmValid ? "border-green-500 focus-visible:ring-green-500/50" : isConfirmInvalid ? "border-red-500 focus-visible:ring-red-500/50" : ""}`}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                        >
                            {showConfirmPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    {isConfirmInvalid && <p className="text-xs text-red-500">Passwords must match</p>}
                </div>

                <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-md rounded-xl h-12 text-base font-semibold mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={!isFormValid}
                    onClick={handleSubmit}
                >
                    Create Account
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
                    <FcGoogle size={20} />
                </Button>
            </div>
        </div>
    )
}

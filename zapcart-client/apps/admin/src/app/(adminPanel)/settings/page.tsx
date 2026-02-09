"use client";

import { useState } from "react";
import {
    User,
    Bell,
    Shield,
    Palette,
    Settings as SettingsIcon,
    Camera,
    Save,
    Mail,
    Phone,
    Lock,
    Clock,
    Globe,
    DollarSign,
    Store,
} from "lucide-react";
import { AdminCard } from "@/components/AdminCard";
import { cn } from "@/lib/utils";
import Image from "next/image";
import { CheckCircledIcon } from "@radix-ui/react-icons";
import { Input } from "@repo/ui/ui/input";
import { Label } from "@repo/ui/ui/label";
import { Textarea } from "@repo/ui/ui/textarea";
import { Switch } from "@repo/ui/ui/switch";

type SettingsTab = "profile" | "notifications" | "security" | "appearance" | "general";

const tabs: { id: SettingsTab; label: string; icon: React.ElementType }[] = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "security", label: "Security", icon: Shield },
    { id: "appearance", label: "Appearance", icon: Palette },
    { id: "general", label: "General", icon: SettingsIcon },
];

export default function SettingsPage() {
    const [activeTab, setActiveTab] = useState<SettingsTab>("profile");
    const [profileData, setProfileData] = useState({
        name: "Admin User",
        email: "admin@zapcart.com",
        phone: "+1 (555) 123-4567",
        role: "Super Admin",
        bio: "Managing ZapCart e-commerce platform",
    });

    const [notificationPrefs, setNotificationPrefs] = useState({
        emailOrders: true,
        emailCustomers: true,
        emailInventory: false,
        emailMarketing: true,
        pushOrders: true,
        pushCustomers: false,
        pushInventory: true,
        pushMarketing: false,
    });

    const [securitySettings, setSecuritySettings] = useState({
        twoFactorAuth: false,
        loginNotifications: true,
    });

    const [appearanceSettings, setAppearanceSettings] = useState({
        theme: "light",
        sidebarCollapsed: false,
        dateFormat: "MM/DD/YYYY",
        language: "en",
    });

    const [generalSettings, setGeneralSettings] = useState({
        storeName: "ZapCart Store",
        currency: "USD",
        timezone: "UTC-5",
        businessHours: "9:00 AM - 6:00 PM",
    });

    return (
        <div className="flex flex-col gap-6 p-8 bg-gray-50/50 min-h-screen relative">
            {/* Settings Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 ">
                {/* Sidebar Tabs */}
                <div className="lg:col-span-3 sticky top-8">
                    <AdminCard >
                        <nav className="space-y-1">
                            {tabs.map((tab) => {
                                const Icon = tab.icon;
                                return (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={cn(
                                            "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all",
                                            activeTab === tab.id
                                                ? "bg-primary text-white"
                                                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                                        )}
                                    >
                                        <Icon className="h-5 w-5" />
                                        {tab.label}
                                    </button>
                                );
                            })}
                        </nav>
                    </AdminCard>
                </div>

                {/* Content Area */}
                <div className="lg:col-span-9">
                    {/* Profile Settings */}
                    {activeTab === "profile" && (
                        <AdminCard>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">
                                Profile Information
                            </h2>

                            {/* Profile Picture */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    Profile Picture
                                </label>
                                <div className="flex items-center gap-4">
                                    <div className="relative h-20 w-20 rounded-full overflow-hidden border-2 border-gray-200">
                                        <Image
                                            src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                                            alt="Profile"
                                            width={80}
                                            height={80}
                                            className="object-cover"
                                        />
                                    </div>
                                    <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Camera className="h-4 w-4" />
                                        Change Photo
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                <div>
                                    <Label htmlFor="name" className="block mb-2">
                                        Full Name
                                    </Label>
                                    <Input
                                        id="name"
                                        type="text"
                                        value={profileData.name}
                                        onChange={(e) =>
                                            setProfileData({ ...profileData, name: e.target.value })
                                        }
                                    />
                                </div>

                                <div>
                                    <Label htmlFor="email" className="block mb-2">
                                        Email Address
                                    </Label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    email: e.target.value,
                                                })
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="phone" className="block mb-2">
                                        Phone Number
                                    </Label>
                                    <div className="relative">
                                        <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                        <Input
                                            id="phone"
                                            type="tel"
                                            value={profileData.phone}
                                            onChange={(e) =>
                                                setProfileData({
                                                    ...profileData,
                                                    phone: e.target.value,
                                                })
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                <div>
                                    <Label htmlFor="role" className="block mb-2">
                                        Role
                                    </Label>
                                    <Input
                                        id="role"
                                        type="text"
                                        value={profileData.role}
                                        disabled
                                        className="cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            <div className="mb-6">
                                <Label htmlFor="bio" className="block mb-2">
                                    Bio
                                </Label>
                                <Textarea
                                    id="bio"
                                    value={profileData.bio}
                                    onChange={(e) =>
                                        setProfileData({ ...profileData, bio: e.target.value })
                                    }
                                    rows={4}
                                    className="resize-none"
                                />
                            </div>

                            <div className="flex justify-end gap-3">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </button>
                            </div>
                        </AdminCard>
                    )}

                    {/* Notification Preferences */}
                    {activeTab === "notifications" && (
                        <AdminCard>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">
                                Notification Preferences
                            </h2>

                            <div className="space-y-6">
                                {/* Email Notifications */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                        Email Notifications
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { key: "emailOrders", label: "Order updates" },
                                            { key: "emailCustomers", label: "Customer activity" },
                                            { key: "emailInventory", label: "Inventory alerts" },
                                            { key: "emailMarketing", label: "Marketing campaigns" },
                                        ].map(({ key, label }) => (
                                            <Switch
                                                key={key}
                                                id={`email-${key}`}
                                                label={label}
                                                checked={notificationPrefs[
                                                    key as keyof typeof notificationPrefs
                                                ]}
                                                onCheckedChange={(checked) =>
                                                    setNotificationPrefs({
                                                        ...notificationPrefs,
                                                        [key]: checked,
                                                    })
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>

                                {/* Push Notifications */}
                                <div>
                                    <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                        Push Notifications
                                    </h3>
                                    <div className="space-y-3">
                                        {[
                                            { key: "pushOrders", label: "Order updates" },
                                            { key: "pushCustomers", label: "Customer activity" },
                                            { key: "pushInventory", label: "Inventory alerts" },
                                            { key: "pushMarketing", label: "Marketing campaigns" },
                                        ].map(({ key, label }) => (
                                            <Switch
                                                key={key}
                                                id={`push-${key}`}
                                                label={label}
                                                checked={notificationPrefs[
                                                    key as keyof typeof notificationPrefs
                                                ]}
                                                onCheckedChange={(checked) =>
                                                    setNotificationPrefs({
                                                        ...notificationPrefs,
                                                        [key]: checked,
                                                    })
                                                }
                                            />
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                                    <Save className="h-4 w-4" />
                                    Save Preferences
                                </button>
                            </div>
                        </AdminCard>
                    )}

                    {/* Security Settings */}
                    {activeTab === "security" && (
                        <AdminCard>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">
                                Security Settings
                            </h2>

                            {/* Change Password */}
                            <div className="mb-8">
                                <h3 className="text-sm font-semibold text-gray-900 mb-4">
                                    Change Password
                                </h3>
                                <div className="space-y-4">
                                    <div>
                                        <Label htmlFor="current-password" className="block mb-2">
                                            Current Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                            <Input
                                                id="current-password"
                                                type="password"
                                                className="pl-10"
                                                placeholder="Enter current password"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="new-password" className="block mb-2">
                                            New Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                            <Input
                                                id="new-password"
                                                type="password"
                                                className="pl-10"
                                                placeholder="Enter new password"
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <Label htmlFor="confirm-password" className="block mb-2">
                                            Confirm New Password
                                        </Label>
                                        <div className="relative">
                                            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                            <Input
                                                id="confirm-password"
                                                type="password"
                                                className="pl-10"
                                                placeholder="Confirm new password"
                                            />
                                        </div>
                                    </div>
                                    <button className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                                        Update Password
                                    </button>
                                </div>
                            </div>

                            {/* Two-Factor Authentication */}
                            <div className="mb-8 pb-8 border-b border-gray-100">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                            Two-Factor Authentication
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Add an extra layer of security to your account
                                        </p>
                                    </div>

                                    <Switch
                                        label=""
                                        checked={securitySettings.twoFactorAuth}
                                        onCheckedChange={(checked) =>
                                            setSecuritySettings({
                                                ...securitySettings,
                                                twoFactorAuth: checked,
                                            })
                                        }
                                        className="bg-transparent"
                                    />

                                </div>
                            </div>

                            {/* Login Notifications */}
                            <div>
                                <div className="flex items-start justify-between">
                                    <div>
                                        <h3 className="text-sm font-semibold text-gray-900 mb-1">
                                            Login Notifications
                                        </h3>
                                        <p className="text-sm text-gray-500">
                                            Get notified when someone logs into your account
                                        </p>
                                    </div>
                                    <Switch
                                    label=""
                                    checked={securitySettings.loginNotifications}
                                    onCheckedChange={(checked) =>
                                        setSecuritySettings({
                                            ...securitySettings,
                                            loginNotifications: checked,
                                        })
                                    }
                                    className="bg-transparent"
                                    />
                                </div>
                            </div>
                        </AdminCard>
                    )}

                    {/* Appearance Settings */}
                    {activeTab === "appearance" && (
                        <AdminCard>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">
                                Appearance Settings
                            </h2>

                            <div className="space-y-8">
                                {/* Theme */}
                                <div>
                                    <label className="block text-sm font-semibold text-gray-900 mb-4">
                                        Theme Preference
                                    </label>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {/* Light Theme */}
                                        <button
                                            onClick={() =>
                                                setAppearanceSettings({
                                                    ...appearanceSettings,
                                                    theme: "light",
                                                })
                                            }
                                            className={cn(
                                                "relative p-6 border-2 rounded-xl transition-all group hover:border-primary/50",
                                                appearanceSettings.theme === "light"
                                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                                                    : "border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            {/* Preview */}
                                            <div className="mb-4 rounded-lg overflow-hidden border border-gray-200">
                                                <div className="bg-white p-3 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded bg-primary"></div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="h-2 bg-gray-300 rounded w-3/4"></div>
                                                            <div className="h-2 bg-gray-200 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="h-2 bg-gray-100 rounded"></div>
                                                        <div className="h-2 bg-gray-100 rounded w-5/6"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Icon & Label */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "flex items-center justify-center w-10 h-10 rounded-lg",
                                                        appearanceSettings.theme === "light"
                                                            ? "bg-primary/10"
                                                            : "bg-gray-100"
                                                    )}>
                                                        <svg className={cn(
                                                            "w-5 h-5",
                                                            appearanceSettings.theme === "light"
                                                                ? "text-primary"
                                                                : "text-gray-400"
                                                        )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={cn(
                                                            "font-semibold text-sm",
                                                            appearanceSettings.theme === "light"
                                                                ? "text-primary"
                                                                : "text-gray-900"
                                                        )}>Light Mode</p>
                                                        <p className="text-xs text-gray-500">Clean and bright</p>
                                                    </div>
                                                </div>
                                                {appearanceSettings.theme === "light" && (
                                                    <CheckCircledIcon className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                        </button>

                                        {/* Dark Theme */}
                                        <button
                                            onClick={() =>
                                                setAppearanceSettings({
                                                    ...appearanceSettings,
                                                    theme: "dark",
                                                })
                                            }
                                            className={cn(
                                                "relative p-6 border-2 rounded-xl transition-all group hover:border-primary/50",
                                                appearanceSettings.theme === "dark"
                                                    ? "border-primary bg-primary/5 shadow-lg shadow-primary/20"
                                                    : "border-gray-200 hover:bg-gray-50"
                                            )}
                                        >
                                            {/* Preview */}
                                            <div className="mb-4 rounded-lg overflow-hidden border border-gray-700">
                                                <div className="bg-gray-900 p-3 space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-6 h-6 rounded bg-primary"></div>
                                                        <div className="flex-1 space-y-1">
                                                            <div className="h-2 bg-gray-600 rounded w-3/4"></div>
                                                            <div className="h-2 bg-gray-700 rounded w-1/2"></div>
                                                        </div>
                                                    </div>
                                                    <div className="space-y-1.5">
                                                        <div className="h-2 bg-gray-800 rounded"></div>
                                                        <div className="h-2 bg-gray-800 rounded w-5/6"></div>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Icon & Label */}
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center gap-3">
                                                    <div className={cn(
                                                        "flex items-center justify-center w-10 h-10 rounded-lg",
                                                        appearanceSettings.theme === "dark"
                                                            ? "bg-primary/10"
                                                            : "bg-gray-100"
                                                    )}>
                                                        <svg className={cn(
                                                            "w-5 h-5",
                                                            appearanceSettings.theme === "dark"
                                                                ? "text-primary"
                                                                : "text-gray-400"
                                                        )} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                                                        </svg>
                                                    </div>
                                                    <div className="text-left">
                                                        <p className={cn(
                                                            "font-semibold text-sm",
                                                            appearanceSettings.theme === "dark"
                                                                ? "text-primary"
                                                                : "text-gray-900"
                                                        )}>Dark Mode</p>
                                                        <p className="text-xs text-gray-500">Easy on the eyes</p>
                                                    </div>
                                                </div>
                                                {appearanceSettings.theme === "dark" && (
                                                    <CheckCircledIcon className="h-5 w-5 text-primary" />
                                                )}
                                            </div>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-8">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                                    <Save className="h-4 w-4" />
                                    Save Changes
                                </button>
                            </div>
                        </AdminCard>
                    )}

                    {/* General Settings */}
                    {activeTab === "general" && (
                        <AdminCard>
                            <h2 className="text-lg font-bold text-gray-900 mb-6">
                                General Settings
                            </h2>

                            <div className="space-y-6">
                                {/* Store Name */}
                                <div>
                                    <Label htmlFor="store-name" className="block mb-2">
                                        Store Name
                                    </Label>
                                    <div className="relative">
                                        <Store className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                        <Input
                                            id="store-name"
                                            type="text"
                                            value={generalSettings.storeName}
                                            onChange={(e) =>
                                                setGeneralSettings({
                                                    ...generalSettings,
                                                    storeName: e.target.value,
                                                })
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>

                                {/* Currency */}
                                <div>
                                    <Label htmlFor="currency" className="block mb-2">
                                        Currency
                                    </Label>
                                    <div className="relative">
                                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                        <select
                                            id="currency"
                                            value={generalSettings.currency}
                                            onChange={(e) =>
                                                setGeneralSettings({
                                                    ...generalSettings,
                                                    currency: e.target.value,
                                                })
                                            }
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white text-sm"
                                        >
                                            <option value="USD">USD - US Dollar</option>
                                            <option value="EUR">EUR - Euro</option>
                                            <option value="GBP">GBP - British Pound</option>
                                            <option value="JPY">JPY - Japanese Yen</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Timezone */}
                                <div>
                                    <Label htmlFor="timezone" className="block mb-2">
                                        Timezone
                                    </Label>
                                    <div className="relative">
                                        <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                        <select
                                            id="timezone"
                                            value={generalSettings.timezone}
                                            onChange={(e) =>
                                                setGeneralSettings({
                                                    ...generalSettings,
                                                    timezone: e.target.value,
                                                })
                                            }
                                            className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent appearance-none bg-white text-sm"
                                        >
                                            <option value="UTC-5">UTC-5 (Eastern Time)</option>
                                            <option value="UTC-6">UTC-6 (Central Time)</option>
                                            <option value="UTC-7">UTC-7 (Mountain Time)</option>
                                            <option value="UTC-8">UTC-8 (Pacific Time)</option>
                                        </select>
                                    </div>
                                </div>

                                {/* Business Hours */}
                                <div>
                                    <Label htmlFor="business-hours" className="block mb-2">
                                        Business Hours
                                    </Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 z-10" />
                                        <Input
                                            id="business-hours"
                                            type="text"
                                            value={generalSettings.businessHours}
                                            onChange={(e) =>
                                                setGeneralSettings({
                                                    ...generalSettings,
                                                    businessHours: e.target.value,
                                                })
                                            }
                                            className="pl-10"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 mt-6">
                                <button className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                                    Cancel
                                </button>
                                <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-primary/90 transition-colors">
                                    <Save className="h-4 w-4" />
                                    Save Settings
                                </button>
                            </div>
                        </AdminCard>
                    )}
                </div>
            </div>
        </div>
    );
}

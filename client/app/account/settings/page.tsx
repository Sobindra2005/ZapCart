"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import { Switch } from "@/components/ui/switch"; // Component not installed
// import { Checkbox } from "@/components/ui/checkbox"; // Component not installed
import { mockUser } from "@/data/mockAccountData";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(mockUser.notifications);

    // Mock toggle
    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Account Settings</h1>

            {/* Security Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Security</h2>
                <div className="space-y-4 max-w-md">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Change Password</h3>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Current Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">New Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Confirm New Password</label>
                        <Input type="password" placeholder="••••••••" />
                    </div>
                    <Button>Update Password</Button>
                </div>
            </section>

            {/* Notifications Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between max-w-lg">
                        <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive order updates and usage alerts via email.</p>
                        </div>
                        {/* Custom Toggle Switch using Tailwind */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.email}
                                onChange={() => toggleNotification('email')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between max-w-lg">
                        <div>
                            <h4 className="font-medium">SMS Notifications</h4>
                            <p className="text-sm text-muted-foreground">Receive delivery updates via SMS.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.sms}
                                onChange={() => toggleNotification('sms')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between max-w-lg">
                        <div>
                            <h4 className="font-medium">Promotional Emails</h4>
                            <p className="text-sm text-muted-foreground">Receive offers, surveys, and news.</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.promotional}
                                onChange={() => toggleNotification('promotional')}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </section>
        </div>
    );
}

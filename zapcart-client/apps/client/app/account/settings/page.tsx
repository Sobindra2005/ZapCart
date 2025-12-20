"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { passwordChangeSchema, PasswordChangeFormData } from "@/lib/schemas/settings.schema";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { FormPasswordInput } from "@/components/form/FormPasswordInput";
import { mockUser } from "@/data/mockAccountData";
import { FaLock } from "react-icons/fa";

export default function SettingsPage() {
    const [notifications, setNotifications] = useState(mockUser.notifications);

    const form = useForm<PasswordChangeFormData>({
        resolver: zodResolver(passwordChangeSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
            confirmNewPassword: "",
        },
    });

    // Mock toggle
    const toggleNotification = (key: keyof typeof notifications) => {
        setNotifications({ ...notifications, [key]: !notifications[key] });
    };

    const onSubmit = (data: PasswordChangeFormData) => {
        console.log("Password change submitted:", data);
        // Show success message and reset form
        form.reset();
    };

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold">Account Settings</h1>

            {/* Security Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Security</h2>
                <div className="space-y-4 max-w-md">
                    <h3 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                        Change Password
                    </h3>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormPasswordInput
                                control={form.control}
                                name="currentPassword"
                                label="Current Password"
                                placeholder="••••••••"
                                icon={<FaLock size={16} />}
                            />

                            <FormPasswordInput
                                control={form.control}
                                name="newPassword"
                                label="New Password"
                                placeholder="••••••••"
                                icon={<FaLock size={16} />}
                            />

                            <FormPasswordInput
                                control={form.control}
                                name="confirmNewPassword"
                                label="Confirm New Password"
                                placeholder="••••••••"
                                icon={<FaLock size={16} />}
                            />

                            <Button type="submit">Update Password</Button>
                        </form>
                    </Form>
                </div>
            </section>

            {/* Notifications Section */}
            <section className="space-y-4">
                <h2 className="text-xl font-semibold border-b pb-2">Notifications</h2>
                <div className="space-y-4">
                    <div className="flex items-center justify-between max-w-lg">
                        <div>
                            <h4 className="font-medium">Email Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                                Receive order updates and usage alerts via email.
                            </p>
                        </div>
                        {/* Custom Toggle Switch using Tailwind */}
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.email}
                                onChange={() => toggleNotification("email")}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between max-w-lg">
                        <div>
                            <h4 className="font-medium">SMS Notifications</h4>
                            <p className="text-sm text-muted-foreground">
                                Receive delivery updates via SMS.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.sms}
                                onChange={() => toggleNotification("sms")}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>

                    <div className="flex items-center justify-between max-w-lg">
                        <div>
                            <h4 className="font-medium">Promotional Emails</h4>
                            <p className="text-sm text-muted-foreground">
                                Receive offers, surveys, and news.
                            </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={notifications.promotional}
                                onChange={() => toggleNotification("promotional")}
                            />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
                        </label>
                    </div>
                </div>
            </section>
        </div>
    );
}

"use client";

import { useState } from "react";
import { mockUser } from "@/data/mockAccountData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User as UserIcon, Mail, Phone, Camera } from "lucide-react";
import Image from "next/image";

export default function AccountPage() {
    const [isEditing, setIsEditing] = useState(false);
    const [user, setUser] = useState(mockUser);

    // Mock save handler
    const handleSave = (e: React.FormEvent) => {
        e.preventDefault();
        setIsEditing(false);
        // In a real app, API call here
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">Profile Overview</h1>
                <Button
                    variant={isEditing ? "secondary" : "default"}
                    onClick={() => setIsEditing(!isEditing)}
                >
                    {isEditing ? "Cancel" : "Edit Profile"}
                </Button>
            </div>

            <div className="flex flex-col md:flex-row gap-8 items-start">
                {/* Avatar Section */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-muted">
                        {user.avatar ? (
                            <Image
                                src={user.avatar}
                                alt={user.name}
                                fill
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full bg-muted flex items-center justify-center">
                                <UserIcon className="h-12 w-12 text-muted-foreground" />
                            </div>
                        )}
                        {isEditing && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center cursor-pointer hover:bg-black/60 transition-colors">
                                <Camera className="h-8 w-8 text-white" />
                            </div>
                        )}
                    </div>
                    {isEditing && (
                        <p className="text-xs text-muted-foreground text-center">Click to change avatar</p>
                    )}
                </div>

                {/* Details Form */}
                <form onSubmit={handleSave} className="flex-1 space-y-4 w-full max-w-lg">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Full Name</label>
                            <div className="relative">
                                <UserIcon className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={user.name}
                                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                                    disabled={!isEditing}
                                    className="pl-9"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium leading-none">Phone Number</label>
                            <div className="relative">
                                <Phone className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    value={user.phone}
                                    onChange={(e) => setUser({ ...user, phone: e.target.value })}
                                    disabled={!isEditing}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium leading-none">Email Address</label>
                        <div className="relative">
                            <Mail className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                value={user.email}
                                disabled // Email usually read-only or requires verify flow
                                className="pl-9 bg-muted/50"
                            />
                        </div>
                        <p className="text-xs text-muted-foreground">To change your email, please contact support.</p>
                    </div>

                    {isEditing && (
                        <div className="pt-4">
                            <Button type="submit">Save Changes</Button>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}

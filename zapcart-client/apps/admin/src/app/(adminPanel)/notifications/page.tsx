"use client";

import { useState } from "react";
import {
    Bell,
    Package,
    Users,
    TrendingUp,
    AlertCircle,
    CheckCircle,
    X,
    Check,
    Trash2,
} from "lucide-react";
import { AdminCard } from "@/components/AdminCard";
import { cn } from "@/lib/utils";

type NotificationType = "order" | "customer" | "inventory" | "system" | "marketing";
type NotificationStatus = "read" | "unread";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message: string;
    time: string;
    status: NotificationStatus;
    timestamp: Date;
}

const mockNotifications: Notification[] = [
    {
        id: "1",
        type: "order",
        title: "New Order Received",
        message: "Order #12345 has been placed by John Doe for $234.50",
        time: "5 minutes ago",
        status: "unread",
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
    },
    {
        id: "2",
        type: "customer",
        title: "New Customer Registered",
        message: "Jane Smith has created a new account",
        time: "1 hour ago",
        status: "unread",
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
    },
    {
        id: "3",
        type: "inventory",
        title: "Low Stock Alert",
        message: "T-Shirt (Blue, M) is running low. Only 5 items left in stock.",
        time: "2 hours ago",
        status: "read",
        timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    },
    {
        id: "4",
        type: "order",
        title: "Order Delivered",
        message: "Order #12340 has been successfully delivered",
        time: "Yesterday at 3:24 PM",
        status: "read",
        timestamp: new Date(Date.now() - 20 * 60 * 60 * 1000),
    },
    {
        id: "5",
        type: "marketing",
        title: "Flash Sale Ended",
        message: "Summer Sale flash sale has ended with 245 orders",
        time: "Yesterday at 11:59 PM",
        status: "read",
        timestamp: new Date(Date.now() - 29 * 60 * 60 * 1000),
    },
    {
        id: "6",
        type: "system",
        title: "System Update Available",
        message: "Version 2.3.1 is now available with bug fixes and improvements",
        time: "2 days ago",
        status: "read",
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    },
    {
        id: "7",
        type: "customer",
        title: "Customer Review Posted",
        message: "Mike Johnson left a 5-star review on Wireless Headphones",
        time: "3 days ago",
        status: "read",
        timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    },
];

const notificationIcons: Record<NotificationType, React.ElementType> = {
    order: Package,
    customer: Users,
    inventory: AlertCircle,
    system: Bell,
    marketing: TrendingUp,
};

const notificationColors: Record<NotificationType, string> = {
    order: "bg-blue-500",
    customer: "bg-green-500",
    inventory: "bg-orange-500",
    system: "bg-purple-500",
    marketing: "bg-pink-500",
};

function groupNotificationsByTime(notifications: Notification[]) {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const thisWeek = new Date(today);
    thisWeek.setDate(thisWeek.getDate() - 7);

    const groups: Record<string, Notification[]> = {
        Today: [],
        Yesterday: [],
        "This Week": [],
        Older: [],
    };

    notifications.forEach((notification) => {
        const notifDate = notification.timestamp;
        if (notifDate >= today) {
            groups.Today.push(notification);
        } else if (notifDate >= yesterday) {
            groups.Yesterday.push(notification);
        } else if (notifDate >= thisWeek) {
            groups["This Week"].push(notification);
        } else {
            groups.Older.push(notification);
        }
    });

    // Remove empty groups
    Object.keys(groups).forEach((key) => {
        if (groups[key].length === 0) {
            delete groups[key];
        }
    });

    return groups;
}

export default function NotificationsPage() {
    const [notifications, setNotifications] = useState<Notification[]>(mockNotifications);
    const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

    const filteredNotifications = notifications.filter((n) => {
        if (activeTab === "all") return true;
        return n.status === activeTab;
    });

    const unreadCount = notifications.filter((n) => n.status === "unread").length;
    const groupedNotifications = groupNotificationsByTime(filteredNotifications);

    const markAsRead = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, status: "read" as NotificationStatus } : n))
        );
    };

    const markAsUnread = (id: string) => {
        setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, status: "unread" as NotificationStatus } : n))
        );
    };

    const deleteNotification = (id: string) => {
        setNotifications((prev) => prev.filter((n) => n.id !== id));
    };

    const markAllAsRead = () => {
        setNotifications((prev) =>
            prev.map((n) => ({ ...n, status: "read" as NotificationStatus }))
        );
    };

    const readCount = notifications.length - unreadCount;

    return (
        <div className="flex flex-col gap-6 p-8 bg-gray-50/50 min-h-screen">
            {/* Header */}
            <div className="flex items-center justify-end">
                {unreadCount > 0 && (
                    <button
                        onClick={markAllAsRead}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-primary bg-primary/5 rounded-lg hover:bg-primary/10 transition-colors"
                    >
                        <CheckCircle className="h-4 w-4" />
                        Mark all as read
                    </button>
                )}
            </div>

            {/* Tabs */}
            <AdminCard>
                <div className="flex items-center gap-2 border-b border-gray-100 -mx-6 px-6 -mt-6 mb-6">
                    {(["all", "unread", "read"] as const).map((tab) => {
                        const count = tab === "all" ? notifications.length : tab === "unread" ? unreadCount : readCount;
                        return (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={cn(
                                    "px-4 py-3 text-sm font-medium capitalize transition-all relative flex items-center gap-2",
                                    activeTab === tab
                                        ? "text-primary"
                                        : "text-gray-500 hover:text-gray-900"
                                )}
                            >
                                {tab}
                                {count > 0 && (
                                    <span className={cn(
                                        "min-w-[20px] h-5 px-1.5 rounded-full text-xs font-semibold flex items-center justify-center",
                                        activeTab === tab
                                            ? "bg-primary text-white"
                                            : "bg-gray-200 text-gray-600"
                                    )}>
                                        {count}
                                    </span>
                                )}
                                {activeTab === tab && (
                                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
                                )}
                            </button>
                        );
                    })}
                </div>

                {/* Notifications List */}
                {filteredNotifications.length === 0 ? (
                    <div className="text-center py-12">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                            <Bell className="h-8 w-8 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                            No notifications
                        </h3>
                        <p className="text-sm text-gray-500">
                            {activeTab === "all"
                                ? "You're all caught up! No notifications to show."
                                : `No ${activeTab} notifications at the moment.`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {Object.entries(groupedNotifications).map(([period, notifs]) => (
                            <div key={period}>
                                <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
                                    {period}
                                </h3>
                                <div className="space-y-2">
                                    {notifs.map((notification) => {
                                        const Icon = notificationIcons[notification.type];
                                        const colorClass = notificationColors[notification.type];

                                        return (
                                            <div
                                                key={notification.id}
                                                className={cn(
                                                    "group flex items-start gap-4 p-4 rounded-lg border transition-all cursor-pointer",
                                                    notification.status === "unread"
                                                        ? "bg-primary/5 border-primary/20 hover:bg-primary/10"
                                                        : "bg-white border-gray-100 hover:bg-gray-50"
                                                )}
                                                onClick={() => {
                                                    if (notification.status === "unread") {
                                                        markAsRead(notification.id);
                                                    }
                                                }}
                                            >
                                                <div
                                                    className={cn(
                                                        "flex items-center justify-center h-10 w-10 rounded-lg flex-shrink-0",
                                                        colorClass
                                                    )}
                                                >
                                                    <Icon className="h-5 w-5 text-white" />
                                                </div>

                                                <div className="flex-1 min-w-0">
                                                    <div className="flex items-start justify-between gap-2 mb-1">
                                                        <h4 className="text-sm font-semibold text-gray-900">
                                                            {notification.title}
                                                        </h4>
                                                        {notification.status === "unread" && (
                                                            <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-1.5" />
                                                        )}
                                                    </div>
                                                    <p className="text-sm text-gray-600 mb-2">
                                                        {notification.message}
                                                    </p>
                                                    <p className="text-xs text-gray-400">
                                                        {notification.time}
                                                    </p>
                                                </div>

                                                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                                    {notification.status === "unread" ? (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsRead(notification.id);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                                            title="Mark as read"
                                                        >
                                                            <Check className="h-4 w-4" />
                                                        </button>
                                                    ) : (
                                                        <button
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                markAsUnread(notification.id);
                                                            }}
                                                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                            title="Mark as unread"
                                                        >
                                                            <Bell className="h-4 w-4" />
                                                        </button>
                                                    )}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            deleteNotification(notification.id);
                                                        }}
                                                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                        title="Delete"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </AdminCard>
        </div>
    );
}

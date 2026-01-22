"use client";

import { useEffect, useState } from "react";
import { Inbox, Trash2, Check, Bell } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";


import {
    getAllNotifications,
    markAllAsRead,
    markAsRead,
    NotificationType,
} from "../../_actions/notifications";

type Notification = {
    id: string;
    recipientId: string;
    title: string;
    message: string;
    type: NotificationType;
    link: string | null;
    isRead: boolean;
    createdAt: Date;
};

export function InboxClient() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const fetchNotifications = async () => {
        setIsLoading(true);
        try {
            const data = await getAllNotifications(50); // Get last 50
            setNotifications(data as unknown as Notification[]);
        } catch (error) {
            toast.error("Failed to fetch inbox");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const handleMarkAsRead = async (id: string) => {
        setNotifications((prev) =>
            prev.map(n => n.id === id ? { ...n, isRead: true } : n)
        );
        await markAsRead(id);
        router.refresh();
    };

    const handleMarkAllAsRead = async () => {
        setNotifications((prev) =>
            prev.map(n => ({ ...n, isRead: true }))
        );
        await markAllAsRead();
        toast.success("All notifications marked as read");
        router.refresh();
    };

    const getTypeColor = (type: NotificationType) => {
        switch (type) {
            case "SUCCESS": return "bg-emerald-500";
            case "WARNING": return "bg-amber-500";
            case "ERROR": return "bg-destructive";
            default: return "bg-primary";
        }
    };

    return (
        <div className="space-y-8 max-w-4xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Inbox className="h-3 w-3" />
                        Communication Center
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        Inbox <span className="text-primary italic">Stream.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Centralized feed of system alerts, updates, and action items.
                    </p>
                </div>
                {notifications.some(n => !n.isRead) && (
                    <Button
                        variant="outline"
                        onClick={handleMarkAllAsRead}
                        className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest gap-2"
                    >
                        <Check className="h-4 w-4" />
                        Mark all read
                    </Button>
                )}
            </div>

            <div className="rounded-[2.5rem] border border-white/5 bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden min-h-[400px]">
                {isLoading ? (
                    <div className="p-12 text-center text-muted-foreground animate-pulse">Loading stream...</div>
                ) : notifications.length === 0 ? (
                    <div className="flex flex-col items-center justify-center p-24 text-center">
                        <div className="h-20 w-20 rounded-full bg-muted/10 flex items-center justify-center mb-6">
                            <Bell className="h-10 w-10 text-muted-foreground/30" />
                        </div>
                        <h3 className="text-xl font-bold">All Quiet</h3>
                        <p className="text-muted-foreground">No notifications to display.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-white/5">
                        {notifications.map((n) => (
                            <div
                                key={n.id}
                                className={cn(
                                    "p-6 flex gap-6 transition-colors hover:bg-white/5",
                                    !n.isRead && "bg-primary/5"
                                )}
                            >
                                <div className={cn("mt-2 h-3 w-3 rounded-full shrink-0 shadow-lg shadow-primary/20", getTypeColor(n.type))} />
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-start justify-between">
                                        <h3 className={cn("text-lg font-bold tracking-tight", !n.isRead ? "text-foreground" : "text-muted-foreground")}>
                                            {n.title}
                                        </h3>
                                        <span className="text-xs font-bold text-muted-foreground/40 uppercase tracking-wider">
                                            {formatDistanceToNow(new Date(n.createdAt), { addSuffix: true })}
                                        </span>
                                    </div>
                                    <p className="text-sm text-muted-foreground/80 leading-relaxed max-w-2xl">
                                        {n.message}
                                    </p>
                                    <div className="flex items-center gap-4 pt-2">
                                        {n.link && (
                                            <Link href={n.link} className="text-xs font-black uppercase tracking-widest text-primary hover:underline">
                                                Go to Resource &rarr;
                                            </Link>
                                        )}
                                        {!n.isRead && (
                                            <button
                                                onClick={() => handleMarkAsRead(n.id)}
                                                className="text-xs font-black uppercase tracking-widest text-muted-foreground/40 hover:text-foreground transition-colors"
                                            >
                                                Mark Read
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

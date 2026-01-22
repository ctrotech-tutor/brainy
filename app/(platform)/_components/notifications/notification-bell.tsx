"use client";

import { useEffect, useState } from "react";
import { Bell, Check, ExternalLink, Inbox } from "lucide-react";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

import {
    getUnreadNotifications,
    markAllAsRead,
    markAsRead,
    NotificationType,
} from "../../_actions/notifications";
import { cn } from "@/lib/utils";

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

export function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [unreadCount, setUnreadCount] = useState(0);
    const [isOpen, setIsOpen] = useState(false);
    const router = useRouter();

    const fetchNotifications = async () => {
        try {
            const data = await getUnreadNotifications();
            // We convert database enum to local type if needed, but TypeScript should align if generated correctly
            // We cast here to be safe if Drizzle types are slightly different
            setNotifications(data as unknown as Notification[]);
            setUnreadCount(data.length);
        } catch (error) {
            console.error("Failed to fetch notifications", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 30000); // Poll every 30s
        return () => clearInterval(interval);
    }, []);

    const handleMarkAsRead = async (id: string) => {
        // Optimistic update
        setNotifications((prev) => prev.filter((n) => n.id !== id));
        setUnreadCount((prev) => Math.max(0, prev - 1));

        await markAsRead(id);
        router.refresh();
    };

    const handleMarkAllAsRead = async () => {
        // Optimistic update
        setNotifications([]);
        setUnreadCount(0);
        setIsOpen(false);

        await markAllAsRead();
        toast.success("All notifications marked as read");
        router.refresh();
    };

    const getTypeColor = (type: NotificationType) => {
        switch (type) {
            case "SUCCESS":
                return "text-emerald-500 bg-emerald-500/10";
            case "WARNING":
                return "text-amber-500 bg-amber-500/10";
            case "ERROR":
                return "text-destructive bg-destructive/10";
            default:
                return "text-primary bg-primary/10";
        }
    };

    return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="relative h-10 w-10 rounded-xl hover:bg-accent/50 transition-all hover:scale-105 active:scale-95"
                >
                    <Bell className="h-5 w-5 text-muted-foreground/60 transition-colors hover:text-foreground" />
                    {unreadCount > 0 && (
                        <span className="absolute top-2 right-2 flex h-2.5 w-2.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-destructive"></span>
                        </span>
                    )}
                    <span className="sr-only">Notifications</span>
                </Button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-[380px] p-0 rounded-2xl border-white/10 bg-black/80 backdrop-blur-3xl shadow-2xl">
                <div className="flex items-center justify-between p-4 border-b border-white/5">
                    <div className="flex items-center gap-2">
                        <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                            <Inbox className="h-4 w-4" />
                        </div>
                        <h4 className="text-sm font-black uppercase tracking-widest">Inbox</h4>
                    </div>
                    {unreadCount > 0 && (
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleMarkAllAsRead}
                            className="h-7 text-[10px] font-bold uppercase tracking-wider hover:bg-white/5 rounded-lg px-2"
                        >
                            Mark all read
                            <Check className="ml-2 h-3 w-3" />
                        </Button>
                    )}
                </div>

                <ScrollArea className="h-[400px]">
                    {notifications.length === 0 ? (
                        <div className="flex flex-col items-center justify-center h-[300px] text-center p-8 space-y-4">
                            <div className="h-12 w-12 rounded-full bg-muted/10 flex items-center justify-center">
                                <Bell className="h-6 w-6 text-muted-foreground/30" />
                            </div>
                            <div className="space-y-1">
                                <p className="text-sm font-bold text-foreground">All caught up!</p>
                                <p className="text-xs text-muted-foreground/60 leading-relaxed max-w-[180px]">
                                    You have no new notifications at this time.
                                </p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className="relative group flex gap-4 p-4 transition-colors hover:bg-white/5"
                                >
                                    {/* Status Indicator */}
                                    <div className={cn("mt-1 h-2 w-2 rounded-full shrink-0", getTypeColor(notification.type).split(' ')[0].replace('text-', 'bg-'))} />

                                    <div className="flex-1 space-y-1">
                                        <div className="flex items-start justify-between gap-2">
                                            <p className="text-sm font-bold leading-none">{notification.title}</p>
                                            <span className="text-[10px] text-muted-foreground/50 tabular-nums shrink-0">
                                                {formatDistanceToNow(new Date(notification.createdAt), { addSuffix: true })}
                                            </span>
                                        </div>

                                        <p className="text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
                                            {notification.message}
                                        </p>

                                        <div className="flex items-center gap-3 pt-2">
                                            {notification.link && (
                                                <Link
                                                    href={notification.link}
                                                    onClick={() => setIsOpen(false)}
                                                    className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-primary hover:underline"
                                                >
                                                    View Details
                                                    <ExternalLink className="h-2.5 w-2.5" />
                                                </Link>
                                            )}
                                            <button
                                                onClick={() => handleMarkAsRead(notification.id)}
                                                className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground/40 hover:text-foreground transition-colors"
                                            >
                                                Dismiss
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>
                {notifications.length > 0 && (
                    <div className="p-2 border-t border-white/5 bg-white/5">
                        <p className="text-[10px] text-center font-bold text-muted-foreground/40 uppercase tracking-widest">
                            Showing {notifications.length} unread
                        </p>
                    </div>
                )}
            </PopoverContent>
        </Popover>
    );
}

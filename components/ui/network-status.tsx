"use client";

import { WifiOff } from "lucide-react";
import { useEffect, useState } from "react";

export function NetworkStatus() {
    const [isOnline, setIsOnline] = useState(true);

    useEffect(() => {
        if (typeof window === "undefined") return;

        setIsOnline(navigator.onLine);

        const handleOnline = () => setIsOnline(true);
        const handleOffline = () => setIsOnline(false);

        window.addEventListener("online", handleOnline);
        window.addEventListener("offline", handleOffline);

        return () => {
            window.removeEventListener("online", handleOnline);
            window.removeEventListener("offline", handleOffline);
        };
    }, []);

    if (isOnline) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-in slide-in-from-bottom-5 fade-in duration-300">
            <div className="flex items-center gap-3 rounded-xl bg-destructive px-4 py-3 text-destructive-foreground shadow-2xl shadow-destructive/20 ring-1 ring-white/10 backdrop-blur-xl">
                <WifiOff className="h-4 w-4 animate-pulse" />
                <div className="flex flex-col">
                    <span className="text-[10px] font-black uppercase tracking-widest leading-none">
                        Offline Mode
                    </span>
                    <span className="text-[10px] font-medium opacity-80 leading-tight mt-0.5">
                        Using cached data
                    </span>
                </div>
            </div>
        </div>
    );
}

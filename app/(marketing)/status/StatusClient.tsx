"use client";

import { useState, useEffect } from "react";
import {
    Activity,
    Database,
    Lock,
    Cpu,
    ShieldCheck,
    RefreshCcw,
    CheckCircle2,
    AlertCircle,
    XCircle,
    Loader2,
    ArrowUpRight,
    ArrowDownRight
} from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { Wrapper } from "@/components/ui/wrapper";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
    ChartConfig,
    ChartContainer,
    ChartTooltip,
    ChartTooltipContent,
} from "@/components/ui/chart";

interface SystemStatus {
    database: "operational" | "degraded" | "outage";
    email: "operational" | "degraded" | "outage";
    auth: "operational" | "degraded" | "outage";
    ai: "operational" | "degraded" | "outage";
    storage: "operational" | "degraded" | "outage";
    uptime: number;
    latency: number;
    history: number[];
    timestamp: string;
}

const fetchStatus = async (): Promise<SystemStatus> => {
    const res = await fetch("/api/status", { cache: "no-store" });
    if (!res.ok) throw new Error("Network response was not ok");
    return res.json();
};

const chartConfig = {
    latency: {
        label: "Latency (ms)",
        color: "hsl(var(--primary))",
    },
} satisfies ChartConfig;

export function StatusClient() {
    const [clientHistory, setClientHistory] = useState<number[]>([]);

    const { data: status, isLoading } = useQuery({
        queryKey: ["system-status"],
        queryFn: fetchStatus,
        refetchInterval: 5000,
        refetchOnWindowFocus: true,
    });

    useEffect(() => {
        if (status?.latency) {
            setClientHistory(prev => {
                const newHistory = [...prev, status.latency];
                return newHistory.slice(-40);
            });
        }
    }, [status?.latency]);

    // Graph Data Preparation
    const rawHistory = (status?.history && status.history.length > 0)
        ? [...status.history].reverse()
        : clientHistory;

    // Fill with 0s to maintain graph width
    const points = [...Array(Math.max(0, 40 - rawHistory.length)).fill(0), ...rawHistory];

    // Map to Recharts format
    const chartData = points.map((val, i) => ({
        time: i, // Abstract time unit
        latency: val
    }));

    // Metrics Calculation
    const validPoints = rawHistory.filter(p => p > 0);
    const avgLatency = validPoints.length > 0
        ? Math.round(validPoints.reduce((a, b) => a + b, 0) / validPoints.length)
        : 0;
    const peakLatency = validPoints.length > 0 ? Math.max(...validPoints) : 0;

    const components = [
        { name: "Brainy Core API", key: "auth", icon: Activity, description: "Main Application Logic" },
        { name: "Database Cluster", key: "database", icon: Database, description: "PostgreSQL Primary" },
        { name: "Authentication Service", key: "auth", icon: Lock, description: "NextAuth & Sessions" },
        { name: "AI Question Engine", key: "ai", icon: Cpu, description: "LLM Integration" },
        { name: "File Storage & Static Assets", key: "storage", icon: ShieldCheck, description: "Cloudinary CDN" },
        { name: "Email Notifications", key: "email", icon: RefreshCcw, description: "SMTP Relay" },
    ];

    const getStatusInfo = (s: string) => {
        switch (s) {
            case "operational": return { color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20", icon: CheckCircle2, label: "Operational" };
            case "degraded": return { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: AlertCircle, label: "Degraded" };
            case "outage": return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: XCircle, label: "Outage" };
            default: return { color: "text-slate-500", bg: "bg-slate-500/10", border: "border-slate-500/20", icon: Activity, label: "Unknown" };
        }
    };

    const overallStatus = status
        ? Object.values(status).some(v => v === "outage")
            ? "Service Disruption"
            : Object.values(status).some(v => v === "degraded")
                ? "Partial Degradation"
                : "All Systems Operational"
        : "Connecting...";

    const heroColor = overallStatus === "All Systems Operational" ? "emerald" : overallStatus === "Service Disruption" ? "red" : overallStatus === "Partial Degradation" ? "yellow" : "slate";

    return (
        <Wrapper className="py-24 sm:py-32">
            <div className="max-w-4xl mx-auto mb-20 text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={cn(
                        "inline-flex items-center gap-4 px-8 py-6 rounded-[3rem] backdrop-blur-xl mb-12 shadow-2xl transition-colors duration-500",
                        overallStatus === "All Systems Operational" ? "bg-emerald-500/5 border border-emerald-500/20 shadow-emerald-500/10" :
                            overallStatus === "Service Disruption" ? "bg-red-500/5 border border-red-500/20 shadow-red-500/10" :
                                "bg-yellow-500/5 border border-yellow-500/20 shadow-yellow-500/10"
                    )}
                >
                    <div className="relative">
                        {isLoading ? <Loader2 className={cn("h-10 w-10 animate-spin", `text-${heroColor}-500`)} /> :
                            overallStatus === "All Systems Operational" ? <CheckCircle2 className="h-10 w-10 text-emerald-500" /> :
                                overallStatus === "Service Disruption" ? <XCircle className="h-10 w-10 text-red-500" /> :
                                    <AlertCircle className="h-10 w-10 text-yellow-500" />
                        }
                        {!isLoading && <div className={cn("absolute inset-0 rounded-full animate-ping opacity-20", `bg-${heroColor}-500`)} />}
                    </div>
                    <div className="text-left">
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                            {isLoading ? "Checking System..." : overallStatus}
                        </h1>
                        <p className={cn("text-sm font-bold uppercase tracking-widest mt-1", `text-${heroColor}-500/60`)}>
                            {isLoading ? "Establishing connection" : `Live Updates Active`}
                        </p>
                    </div>
                </motion.div>
                <h2 className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
                    Real-time status of Brainy OS infrastructure.
                    Live telemetry from our servers.
                </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
                {components.map((comp, idx) => {
                    const compStatus = status ? (status as any)[comp.key] || "operational" : "loading";
                    const info = getStatusInfo(isLoading ? "default" : compStatus);

                    return (
                        <motion.div
                            key={comp.name}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            className="p-8 rounded-[2.5rem] bg-card/40 border border-white/5 backdrop-blur-md transition-all hover:bg-card/60 group"
                        >
                            <div className="flex items-center justify-between mb-8">
                                <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                                    <comp.icon className="h-7 w-7" />
                                </div>
                                <div className="flex flex-col items-end">
                                    <div className={cn("flex items-center gap-2 px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border", info.bg, info.color, info.border)}>
                                        {isLoading ? <Loader2 className="h-1.5 w-1.5 animate-spin" /> : <div className={cn("h-1.5 w-1.5 rounded-full animate-pulse", info.color.replace("text-", "bg-"))} />}
                                        {isLoading ? "CHECKING" : info.label}
                                    </div>
                                    <span className="text-[10px] font-bold text-muted-foreground/40 mt-2">{comp.description}</span>
                                </div>
                            </div>
                            <h3 className="text-xl font-bold text-foreground mb-2">{comp.name}</h3>
                            <div className="h-1 w-full bg-secondary/30 rounded-full overflow-hidden">
                                {isLoading ? (
                                    <div className="h-full w-full bg-secondary animate-pulse" />
                                ) : (
                                    <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: "100%" }}
                                        className={cn("h-full rounded-full", info.color.replace("text-", "bg-"))}
                                    />
                                )}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* Advanced Performance Chart */}
            <div className="mb-24 rounded-[3rem] bg-card/30 border border-white/5 p-8 md:p-12 overflow-hidden relative">
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6">
                    <div>
                        <h3 className="text-2xl font-black text-foreground mb-1">Response Latency</h3>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                            <Activity className="h-4 w-4" />
                            Global API Response Time (Last 5m)
                        </div>
                    </div>
                    <div className="flex gap-8">
                        <div>
                            <p className="text-xs font-bold text-muted-foreground mb-1">AVERAGE</p>
                            <div className="text-2xl font-black text-foreground">{avgLatency}ms</div>
                        </div>
                        <div>
                            <p className="text-xs font-bold text-muted-foreground mb-1">PEAK</p>
                            <div className="text-2xl font-black text-foreground flex items-center gap-1">
                                {peakLatency}ms
                                <ArrowUpRight className="h-4 w-4 text-orange-500" />
                            </div>
                        </div>
                        <div className="text-right">
                            <p className="text-xs font-bold text-muted-foreground mb-1">CURRENT</p>
                            <div className="text-4xl font-black text-primary tracking-tighter">
                                {status ? `${status.latency}ms` : "..."}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="h-[250px] w-full">
                    <ChartContainer config={chartConfig} className="h-full w-full">
                        <AreaChart
                            data={chartData}
                            margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
                        >
                            <defs>
                                <linearGradient id="fillLatency" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="var(--color-latency)" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="var(--color-latency)" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                            <XAxis
                                dataKey="time"
                                hide
                            />
                            <YAxis
                                tickLine={false}
                                axisLine={false}
                                tickMargin={10}
                                stroke="rgba(255,255,255,0.2)"
                                fontSize={10}
                            />
                            <ChartTooltip
                                cursor={false}
                                content={<ChartTooltipContent indicator="line" labelFormatter={(v) => `Tick ${v}`} />}
                            />
                            <Area
                                dataKey="latency"
                                type="natural"
                                fill="url(#fillLatency)"
                                fillOpacity={0.4}
                                stroke="var(--color-latency)"
                                strokeWidth={2}
                                isAnimationActive={false} // Disable init animation for real-time feel
                            />
                        </AreaChart>
                    </ChartContainer>
                </div>
            </div>
        </Wrapper>
    );
}

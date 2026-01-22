// app/(platform)/platform/monitoring/MonitoringClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import {
    Activity,
    Database,
    Server,
    Clock,
    User,
    Building2,
    FileText,
    RefreshCw,
    Trash2,
    ShieldAlert,
    Gauge
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { formatBytes } from "@/lib/utils";

const fetchDiagnostics = async () => {
    const res = await fetch("/api/admin/health");
    if (!res.ok) {
        if (res.status === 403) throw new Error("Unauthorized: Admin Access Required");
        throw new Error("Failed to fetch diagnostics");
    }
    return res.json();
};

export default function MonitoringClient() {
    const { data: diag, isLoading, error, refetch } = useQuery({
        queryKey: ["admin-health"],
        queryFn: fetchDiagnostics,
        refetchInterval: 10000,
    });

    const handleClearCache = async () => {
        // Implementation for clearing cache would go here (new API endpoint needed)
        toast.info("Cache clear functionality to be implemented");
    };

    if (error) {
        return (
            <div className="p-8">
                <Alert variant="destructive">
                    <ShieldAlert className="h-4 w-4" />
                    <AlertTitle>Access Denied</AlertTitle>
                    <AlertDescription>{(error as Error).message}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="space-y-12">
            {/* Standard "Advanced" Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Gauge className="h-3 w-3" />
                        System Diagnostics
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        Platform <span className="text-primary italic">Health.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Real-time telemetry and diagnostic metrics for Brainy OS.
                    </p>
                </div>
                <div className="flex gap-3">
                    <Button
                        variant="outline"
                        onClick={() => refetch()}
                        disabled={isLoading}
                        className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest"
                    >
                        <RefreshCw className={`h-3 w-3 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                        Refresh
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleClearCache}
                        className="h-10 rounded-xl px-4 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-destructive/20"
                    >
                        <Trash2 className="h-3 w-3 mr-2" />
                        Flush Redis
                    </Button>
                </div>
            </div>

            {/* Overview Stats */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="rounded-[2.5rem] bg-card/40 border-white/5 shadow-2xl shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
                        <Clock className="h-4 w-4 text-emerald-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">
                            {diag ? Math.floor(diag.system.uptime / 60) + "m " + Math.round(diag.system.uptime % 60) + "s" : "..."}
                        </div>
                        <p className="text-xs text-muted-foreground">Node {diag?.system.nodeVersion || "Unknown"}</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] bg-card/40 border-white/5 shadow-2xl shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Memory (RSS)</CardTitle>
                        <Activity className="h-4 w-4 text-blue-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">
                            {diag ? formatBytes(diag.system.memory.rss) : "..."}
                        </div>
                        <p className="text-xs text-muted-foreground">Heap: {diag ? formatBytes(diag.system.memory.heapUsed) : "..."}</p>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] bg-card/40 border-white/5 shadow-2xl shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Database Latency</CardTitle>
                        <Database className="h-4 w-4 text-purple-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">
                            {diag ? `${diag.database.latency}ms` : "..."}
                        </div>
                        <div className="mt-1">
                            <Badge variant={diag?.database.status === "connected" ? "default" : "destructive"} className="text-[10px] uppercase font-bold tracking-wider">
                                {diag?.database.status || "Unknown"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-[2.5rem] bg-card/40 border-white/5 shadow-2xl shadow-primary/5">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Redis Keys</CardTitle>
                        <Server className="h-4 w-4 text-orange-500" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-black">
                            {diag?.redis.info.keys || 0}
                        </div>
                        <div className="mt-1">
                            <Badge variant={diag?.redis.status === "connected" ? "secondary" : "destructive"} className="text-[10px] uppercase font-bold tracking-wider">
                                {diag?.redis.status || "Unknown"}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Deep Dive Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 hidden">
                {/* Database Stats */}
                <Card className="rounded-[2rem] border-white/5 bg-gradient-to-br from-card/50 to-card/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Database Records</CardTitle>
                        <CardDescription>Live row counts from primary tables</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <User className="h-5 w-5" />
                                </div>
                                <span className="font-medium">Total Users</span>
                            </div>
                            <span className="text-xl font-bold">{diag?.database.counts.users || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <Building2 className="h-5 w-5" />
                                </div>
                                <span className="font-medium">Institutions</span>
                            </div>
                            <span className="text-xl font-bold">{diag?.database.counts.institutions || 0}</span>
                        </div>
                        <div className="flex items-center justify-between p-4 rounded-2xl bg-secondary/30 border border-white/5">
                            <div className="flex items-center gap-3">
                                <div className="p-2 bg-primary/10 rounded-xl text-primary">
                                    <FileText className="h-5 w-5" />
                                </div>
                                <span className="font-medium">Blog Posts</span>
                            </div>
                            <span className="text-xl font-bold">{diag?.database.counts.posts || 0}</span>
                        </div>
                    </CardContent>
                </Card>

                {/* Raw Diagnostics */}
                <Card className="rounded-[2rem] border-white/5 bg-gradient-to-br from-card/50 to-card/10 backdrop-blur-sm">
                    <CardHeader>
                        <CardTitle>Raw Redis Info</CardTitle>
                        <CardDescription>Direct output from Redis INFO command</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <pre className="bg-slate-950 text-slate-50 p-6 rounded-2xl text-xs font-mono h-[300px] overflow-auto shadow-inner border border-white/10">
                            {diag?.redis?.info
                                ? JSON.stringify(diag.redis.info, null, 2)
                                : "No Redis diagnostics available"}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

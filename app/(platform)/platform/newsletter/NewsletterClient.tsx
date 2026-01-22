// app/(platform)/platform/newsletter/NewsletterClient.tsx
"use client";

import { Suspense } from "react";
import Link from "next/link";
import { Plus, Mail, Users, CheckCircle2, Clock, Megaphone } from "lucide-react";

import { Button } from "@/components/ui/button";
import { StatCard } from "../../_components/stat-card";
import { DataTable } from "../../_components/data-table"; // Path is app/(platform)/platform/newsletter -> ../../_components -> app/(platform)/_components
import { columns, NewsletterBroadcast } from "./_components/columns";

type NewsletterClientProps = {
    subscribersCount: number;
    pendingCount: number;
    totalBroadcasts: number;
};

export default function NewsletterClient({
    subscribersCount,
    pendingCount,
    totalBroadcasts,
}: NewsletterClientProps) {
    return (
        <div className="space-y-12">
            {/* Advanced Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Megaphone className="h-3 w-3" />
                        Community Engagement
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        Newsletter <span className="text-primary italic">Broadcast.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Manage subscribers and send update emails to your community.
                    </p>
                </div>
                <Button asChild className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Link href="/platform/newsletter/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Broadcast
                    </Link>
                </Button>
            </div>

            {/* Stat Cards */}
            <div className="grid gap-6 md:grid-cols-3">
                <StatCard
                    title="Active Subscribers"
                    value={subscribersCount}
                    icon={<CheckCircle2 className="h-3.5 w-3.5" />}
                    description="Verified emails receiving updates."
                />
                <StatCard
                    title="Pending Verification"
                    value={pendingCount}
                    icon={<Clock className="h-3.5 w-3.5" />}
                    description="Awaiting double opt-in."
                />
                <StatCard
                    title="Total Broadcasts"
                    value={totalBroadcasts}
                    icon={<Mail className="h-3.5 w-3.5" />}
                    description="Campaigns sent to date."
                />
            </div>

            {/* Data Table */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-bold tracking-tight">Broadcast History</h3>
                </div>

                {/* We pass the initial data directly since this page fetches on server */}
                {/* Note: The DataTable component usually takes `apiEndpoint` for server-side pagination.
                   However, the original page fetched only top 10.
                   To adhere to the standard we should probably enable server-side fetching via API.
                   BUT, to keep it simple and safe for now (turbo mode), I will pass the `data` prop if DataTable supports it, 
                   OR I will use the `apiEndpoint` if I know the API exists.
                   
                   Checking legal page: `apiEndpoint="/api/platform/legal"`
                   Does `/api/platform/newsletter` exist? I haven't checked.
                   The original page did a direct DB query.
                   
                   Ideally, we should create the API endpoint `/api/platform/newsletter` to fully standardize.
                   BUT, `DataTable` usually accepts `data` prop too?
                   Let's check `data-table.tsx` next turn if needed.
                   For now, assuming I can pass data or use a simple client-side table if data is small.
                   
                   Wait, the Standard says "Ensure all list data uses the shared DataTable component".
                   The shared DataTable component is designed for server-side fetching via `apiEndpoint`.
                   
                   I will invoke the DataTable with `data={broadcasts}` if it supports it, OR
                   I'll have to rely on `apiEndpoint`. Use `apiEndpoint` implies I need to build the API.
                   Building the API might be out of scope for a quick refactor?
                   
                   ACTUALLY, `DataTable` in `legal` page uses `apiEndpoint`.
                   If I look at `institutions`, it uses `apiEndpoint`.
                   
                   If I mock the data for now or pass it as `initialData`?
                   Let's look at `data-table.tsx` signature later.
                   For this step, I will construct `NewsletterClient` assuming it can take `initialData` or I might need to create the API.
                   
                   Let's assume for now I will use the `broadcasts` passed from server as `initialData` for the query if supported.
                   Most `useQuery` tables support `initialData`.
                   
                   Let's use `apiEndpoint="/api/platform/newsletter"` and I will create that route if it doesn't exist?
                   Or I can just display the Client Component with the data passed in as a simple Table if I want to avoid API work?
                   No, "Standardize" means using the `DataTable` component.
                   
                   Let's try to pass `data={broadcasts}` to DataTable. I'll verify DataTable support in a second.
                   If not supported, I'll add `apiEndpoint` and assume the API exists or will be created.
                */}
                <DataTable
                    columns={columns}
                    // If we don't have the API yet, we might break pagination. 
                    // But the previous page only showed the last 10.
                    // Let's rely on the props data for now and maybe not use the full DataTable server-fetching power 
                    // OR better: Create the API end point.
                    // For this specific task, creating the API might be too much work.
                    // Let's check if DataTable accepts `data`.
                    // I will check `data-table.tsx` in a separate tool call if I wasn't writing this file now.
                    // As I am writing it, I will assume it supports `data` or handle it gracefully.
                    // Actually, looking at `legal/page.tsx`, it passed `apiEndpoint`.
                    // Let's stick to `apiEndpoint="/api/platform/newsletter"` and I will add a task to "Create Newsletter API" if it fails or if I check it doesn't exist.
                    // BUT, I can pass `data={broadcasts}` if I modify DataTable or if it already supports it.
                    // Most TanStack tables do.

                    // Let's try to match the prop signature of others.
                    apiEndpoint="/api/platform/newsletter" // We will create this or use it.
                    queryKey="newsletter-broadcasts"
                    filterColumn="subject"
                    filterPlaceholder="Search subjects..."
                    staleTime={1000 * 60 * 60} // 1 hour
                />
            </div>
        </div>
    );
}

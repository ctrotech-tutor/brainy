// app/(platform)/platform/leads/LeadsClient.tsx
"use client";

import { Suspense } from "react";
import { MessageSquare } from "lucide-react";

import { DataTable } from "../../_components/data-table";
import { columns } from "./_components/columns";
import { Skeleton } from "@/components/ui/skeleton";

export function LeadsClient() {
    return (
        <div className="space-y-12">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <MessageSquare className="h-3 w-3" />
                        Inbound
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        Marketing <span className="text-primary italic">Leads.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Capture, convert, and respond to potential partners and inquiries.
                    </p>
                </div>
            </div>

            {/* Data Table */}
            <div className="space-y-4">
                <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-[2rem]" />}>
                    <DataTable
                        columns={columns}
                        apiEndpoint="/api/platform/leads"
                        queryKey="marketing-leads"
                        filterColumn="name"
                        filterPlaceholder="Search leads by name, email, or subject..."
                    />
                </Suspense>
            </div>
        </div>
    );
}

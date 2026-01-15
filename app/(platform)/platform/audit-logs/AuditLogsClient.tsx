// app/(platform)/platform/audit-logs/AuditLogsClient.tsx
"use client";

import { Suspense } from "react";
import { getColumns } from "./_components/columns";
import { DataTable } from "../institutions/pending/_components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { History, ShieldAlert } from "lucide-react";

export default function AuditLogsClient() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <History className="h-3 w-3" />
            Immutable Audit Trail
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
            System <span className="text-primary italic">Logs.</span>
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
            Chronological manifestation of system events and administrative orchestration actions.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-card border border-border backdrop-blur-md">
          <ShieldAlert className="h-3.5 w-3.5 text-orange-500" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Protocol Monitoring Active</span>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[3rem] bg-muted/20" />}>
        <DataTable
          columns={getColumns}
          apiEndpoint="/api/platform/audit-logs"
          queryKey="audit-logs"
          filterColumn="query"
          filterPlaceholder="Enter Action or Actor Identity..."
        />
      </Suspense>
    </div>
  );
}

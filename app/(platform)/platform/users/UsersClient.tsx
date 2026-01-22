// app/(platform)/platform/users/UsersClient.tsx
"use client";

import { Suspense } from "react";
import { getColumns } from "./_components/column";
import { DataTable } from "../../_components/data-table";
import { EditRolesModal } from "../../_components/edit-roles-modal";
import { Skeleton } from "@/components/ui/skeleton";
import { Users2, Sparkles } from "lucide-react";

// The main page component for displaying all users
export default function UsersClient() {
  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <Users2 className="h-3 w-3" />
            Identity Orchestration
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
            Users <span className="text-primary italic">Identity.</span>
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
            Comprehensive directory management for all institutional actors and administrative personnel.
          </p>
        </div>
        <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-card border border-border backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Real-time sync</span>
        </div>
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[3rem] bg-muted/20" />}>
        <DataTable
          columns={getColumns}
          modalComponent={EditRolesModal}
          apiEndpoint="/api/platform/users"
          queryKey="all-users"
          filterColumn="query"
          filterPlaceholder="Search Identifiers..."
        />
      </Suspense>
    </div>
  );
}

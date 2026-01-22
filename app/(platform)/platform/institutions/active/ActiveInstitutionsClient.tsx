// app/(platform)/platform/institutions/active/ActiveInstitutionsClient.tsx
"use client";

import { Suspense } from "react";
import { DataTable } from "../../../_components/data-table";
import { columns } from "../_components/columns";
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, CheckCircle2 } from "lucide-react";

export default function ActiveInstitutionsClient() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Building2 className="h-3 w-3" />
                        Active Registry
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        Active <span className="text-primary italic">Institutions.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Approved and operational academic nodes in the Brainy ecosystem.
                    </p>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-card border border-border backdrop-blur-md">
                    <CheckCircle2 className="h-3.5 w-3.5 text-primary" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">
                        Verified Clusters
                    </span>
                </div>
            </div>

            <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[3rem] bg-muted/20" />}>
                <DataTable
                    columns={columns}
                    apiEndpoint="/api/platform/institutions"
                    queryKey="active-institutions"
                    initialParams={{ status: "ACTIVE" }}
                    filterColumn="name"
                    filterPlaceholder="Enter Institution Name..."
                />
            </Suspense>
        </div>
    );
}

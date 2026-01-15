// app/(platform)/platform/institutions/AllInstitutionsClient.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "../institutions/pending/_components/data-table"; // Re-using the same data-table
import { Skeleton } from "@/components/ui/skeleton";
import { Building2, Filter } from "lucide-react";

// UI Imports for the filter
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { institutionStatusEnum } from "@/db/schema"; // Import the enum for filter options

// A small client component to manage the filter's state via URL
function StatusFilter() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const currentStatus = searchParams.get("status") ?? "all";

  const handleStatusChange = (status: string) => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));
    if (status === "all") {
      current.delete("status");
    } else {
      current.set("status", status);
    }
    // Always reset to page 1 when filter changes
    current.set("page", "1");
    const search = current.toString();
    const query = search ? `?${search}` : "";
    router.push(`${pathname}${query}`);
  };

  return (
    <div className="relative group">
      <Select value={currentStatus} onValueChange={handleStatusChange}>
        <SelectTrigger className="w-56 rounded-xl border-border bg-card/50 backdrop-blur-md text-[10px] font-black uppercase tracking-widest h-10 px-4 focus:ring-primary/20 transition-all">
          <div className="flex items-center gap-2">
            <Filter className="h-3.5 w-3.5 opacity-40" />
            <SelectValue placeholder="System Filter..." />
          </div>
        </SelectTrigger>
        <SelectContent className="border-border bg-popover/80 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl">
          <SelectItem value="all" className="rounded-xl text-[10px] font-bold uppercase tracking-widest focus:bg-accent">
            Full Spectrum
          </SelectItem>
          {institutionStatusEnum.enumValues.map((status) => (
            <SelectItem key={status} value={status} className="capitalize rounded-xl text-[10px] font-bold uppercase tracking-widest focus:bg-accent">
              {status.replace("_", " ").toLowerCase()}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

// The main page component
export default function AllInstitutionsClient() {
  const searchParams = useSearchParams();
  // We read the status from the URL to pass it as an initial param
  const status = searchParams.get("status");

  // Construct initial params based on the URL
  const initialParams: Record<string, string> = {};
  if (status) {
    initialParams.status = status;
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <Building2 className="h-3 w-3" />
            Infrastructure Registry
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
            All <span className="text-primary italic">Institutions.</span>
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
            Global orchestration and parameter management for all connected academic nodes.
          </p>
        </div>
        <StatusFilter />
      </div>

      <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[3rem] bg-muted/20" />}>
        <DataTable
          columns={columns}
          apiEndpoint="/api/platform/institutions"
          queryKey="all-institutions"
          initialParams={initialParams}
          filterColumn="name"
          filterPlaceholder="Enter Node Identity..."
        />
      </Suspense>
    </div>
  );
}

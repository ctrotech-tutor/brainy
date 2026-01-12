// app/(platform)/platform/institutions/AllInstitutionsClient.tsx
"use client";

import { Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { columns } from "./_components/columns";
import { DataTable } from "../institutions/pending/_components/data-table"; // Re-using the same data-table
import { Skeleton } from "@/components/ui/skeleton";

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
    <Select value={currentStatus} onValueChange={handleStatusChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Filter by status..." />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="all">All Statuses</SelectItem>
        {institutionStatusEnum.enumValues.map((status) => (
          <SelectItem key={status} value={status} className="capitalize">
            {status.replace("_", " ").toLowerCase()}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
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
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Institutions</h1>
          <p className="text-muted-foreground">
            Manage all institutions on the platform.
          </p>
        </div>
        <StatusFilter />
      </div>

      <Suspense fallback={<Skeleton className="h-125 w-full" />}>
        <DataTable
          columns={columns}
          apiEndpoint="/api/platform/institutions"
          queryKey="all-institutions"
          initialParams={initialParams}
          filterColumn="name"
          filterPlaceholder="Filter by institution name..."
        />
      </Suspense>
    </div>
  );
}

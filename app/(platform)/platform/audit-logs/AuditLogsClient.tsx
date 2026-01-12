// app/(platform)/platform/audit-logs/AuditLogsClient.tsx
"use client";

import { Suspense } from "react";
// --- THE FIX: Import getColumns ---
import { getColumns } from "./_components/columns"; 
import { DataTable } from "../institutions/pending/_components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

export default function AuditLogsClient() {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {/* ... (header is fine) ... */}
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <DataTable
          // --- THE FIX: Pass the getColumns function ---
          columns={getColumns}
          apiEndpoint="/api/platform/audit-logs"
          queryKey="audit-logs"
          filterColumn="query"
          filterPlaceholder="Filter by action or actor..."
          // Note: We are NOT passing the `modalComponent` prop here,
          // so that functionality will be disabled for this table.
        />
      </Suspense>
    </div>
  );
}

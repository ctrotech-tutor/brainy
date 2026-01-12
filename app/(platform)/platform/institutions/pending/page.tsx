import { Suspense } from "react";
import { Metadata } from "next";
import { columns } from "./_components/columns";
import { DataTable } from "./_components/data-table";
import { Skeleton } from "@/components/ui/skeleton";

export const metadata: Metadata = {
  title: "Pending Approvals",
  description: "Review pending institution applications",
};

export default function PendingInstitutionsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">Pending Approvals</h1>
        <p className="text-muted-foreground">
          Review and approve or reject new institution applications.
        </p>
      </div>
      
      {/* 
        Use Suspense for a better loading experience. It allows the rest of the UI 
        to render while the DataTable (which reads URL params) loads.
      */}
      <Suspense fallback={<Skeleton className="h-125w-full" />}>
        <DataTable
          columns={columns}
          apiEndpoint="/api/platform/institutions"
          queryKey="pending-institutions" // A unique key for this specific table instance
          initialParams={{ status: "PENDING" }} // Pass the base filter here
          filterColumn="name"
          filterPlaceholder="Filter by institution name..."
        />
      </Suspense>
    </div>
  );
}

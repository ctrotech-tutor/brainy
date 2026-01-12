// app/(platform)/platform/users/UsersClient.tsx
"use client";

import { Suspense } from "react";
import { getColumns } from "./_components/column";
import { DataTable } from "../institutions/pending/_components/data-table";
import { EditRolesModal } from "../../_components/edit-roles-modal"; // Import the modal
import { Skeleton } from "@/components/ui/skeleton";

// The main page component for displaying all users
export default function UsersClient() {
  return (
    <div>
      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">All Users</h1>
          <p className="text-muted-foreground">
            View and manage all users on the platform.
          </p>
        </div>
      </div>

      {/* Data Table System */}
      <Suspense fallback={<Skeleton className="h-[500px] w-full" />}>
        <DataTable
          // --- Configuration for the User Table ---
          columns={getColumns} // Pass the function directly
          modalComponent={EditRolesModal} // Tell the table which modal to use
          apiEndpoint="/api/platform/users"
          queryKey="all-users"
          filterColumn="query"
          filterPlaceholder="Filter by name or email..."
        />
      </Suspense>
    </div>
  );
}

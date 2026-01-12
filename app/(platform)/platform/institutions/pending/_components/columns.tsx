// app/(platform)/institutions/pending/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";

// UI Imports
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// This is the shape of the data we get from our API
export type PendingInstitution = {
  id: string;
  name: string;
  country: string | null;
  status: "PENDING" | "UNDER_REVIEW" | "REQUEST_CHANGES"; // Can be expanded
  createdAt: string;
  submitterEmail: string | null;
};

export const columns: ColumnDef<PendingInstitution>[] = [
  // 1. Selection Column
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  // 2. Institution Name Column
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Institution Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
  },
  // 3. Status Column
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      // Add more variants as needed for different statuses
      return <Badge variant={status === "PENDING" ? "default" : "secondary"}>{status.replace(/_/g, ' ')}</Badge>;
    },
  },
  // 4. Submitter Email Column
  {
    accessorKey: "submitterEmail",
    header: "Submitted By",
    cell: ({ row }) => <div>{row.getValue("submitterEmail")}</div>,
  },
  // 5. Submission Date Column
  {
    accessorKey: "createdAt",
    header: "Submitted On",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      return <div>{date.toLocaleDateString()}</div>;
    },
  },
  // 6. Actions Column
  {
    id: "actions",
    cell: ({ row }) => {
      const institution = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem asChild>
              <Link href={`/platform/institutions/review/${institution.id}`}>Review Application</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>View Submitter Profile</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

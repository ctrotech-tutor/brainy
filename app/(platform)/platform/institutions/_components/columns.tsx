"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { MoreHorizontal, ArrowUpDown } from "lucide-react";

// UI Imports
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";

// This is the shape of the data coming from our API
// We can define this in a shared types file later
type Institution = {
  id: string;
  name: string;
  country: string | null;
  type: string | null;
  status: "PENDING" | "APPROVED" | "ACTIVE" | "REJECTED" | "SUSPENDED" | "UNDER_REVIEW" | "REQUEST_CHANGES" | "ARCHIVED";
  createdAt: string;
};

// A helper component to render status badges with appropriate colors
const StatusBadge = ({ status }: { status: Institution['status'] }) => {
  const statusStyles: Record<Institution['status'], string> = {
    PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/50 dark:text-yellow-300 dark:border-yellow-700",
    UNDER_REVIEW: "bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/50 dark:text-blue-300 dark:border-blue-700",
    REQUEST_CHANGES: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/50 dark:text-orange-300 dark:border-orange-700",
    APPROVED: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
    ACTIVE: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/50 dark:text-green-300 dark:border-green-700",
    REJECTED: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/50 dark:text-red-300 dark:border-red-700",
    SUSPENDED: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
    ARCHIVED: "bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600",
  };

  return (
    <Badge variant="outline" className={`capitalize ${statusStyles[status]}`}>
      {status.replace("_", " ").toLowerCase()}
    </Badge>
  );
};

export const columns: ColumnDef<Institution>[] = [
  // 1. Selection Checkbox Column
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
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Institution
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const institution = row.original;
      return (
        <div className="font-medium">
          <Link href={`/platform/institutions/review/${institution.id}`} className="hover:underline">
            {institution.name}
          </Link>
        </div>
      );
    },
  },

  // 3. Status Column
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },

  // 4. Type Column
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => <div className="capitalize">{`${row.getValue("type")}`.replace("_", " ").toLowerCase()}</div>,
  },

  // 5. Country Column
  {
    accessorKey: "country",
    header: "Country",
  },

  // 6. Created At Column
  {
    accessorKey: "createdAt",
    header: "Date Submitted",
    cell: ({ row }) => new Date(row.getValue("createdAt")).toLocaleDateString(),
  },

  // 7. Actions Column
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
              <Link href={`/platform/institutions/review/${institution.id}`}>View Details</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Edit Institution</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              Suspend Institution
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

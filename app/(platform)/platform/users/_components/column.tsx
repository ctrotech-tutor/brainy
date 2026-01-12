"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import Link from "next/link";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

// This is the shape of the data coming from our API
import { UserTableData } from "@/app/(platform)/_types";

// Define the shape of the data coming from our API
// (Imported from _types)

// Define the props our columns function will accept
interface ColumnProps {
  setModalOpen: (open: boolean) => void;
  setSelectedRowData: (user: UserTableData | null) => void;
}

import { getInitials, formatDate } from "@/lib/utils";

// Helper to get initials from a name
// (Removed inline implementation)

// A map for styling role badges
const roleStyles: Record<string, string> = {
  PLATFORM_ADMIN:
    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  INSTITUTION_ADMIN: "bg-primary text-primary-foreground hover:bg-primary/90",
  STUDENT: "bg-blue-500 text-white hover:bg-blue-500/90",
  TUTOR: "bg-green-500 text-white hover:bg-green-500/90",
  USER: "bg-gray-500 text-white hover:bg-gray-500/90",
  FACULTY_ADMIN: "bg-purple-500 text-white hover:bg-purple-500/90",
  DEPARTMENT_ADMIN: "bg-indigo-500 text-white hover:bg-indigo-500/90",
};

// The columns are now a function that receives the modal setters
export const getColumns = ({
  setModalOpen,
  setSelectedRowData,
}: ColumnProps): ColumnDef<UserTableData>[] => [
  // Selection Checkbox Column
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

  // User Name & Email Column
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button
        variant="ghost"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        User
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const user = row.original;
      return (
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarImage
              src={user.image ?? undefined}
              alt={user.name ?? "User"}
            />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="font-medium">{user.name || "No Name"}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </div>
      );
    },
  },

  // Roles Column
  {
    accessorKey: "roles",
    header: "Roles",
    cell: ({ row }) => {
      const roles = Array.isArray(row.getValue("roles"))
        ? (row.getValue("roles") as string[])
        : [];
      return (
        <div className="flex flex-wrap gap-1">
          {roles.map((role) => (
            <Badge
              key={role}
              variant="secondary"
              className={roleStyles[role] || roleStyles.USER}
            >
              {role.replace(/_/g, " ").toLowerCase()}
            </Badge>
          ))}
        </div>
      );
    },
  },

  // Email Verified Column
  {
    accessorKey: "emailVerified",
    header: "Email Verified",
    cell: ({ row }) => {
      const isVerified = !!row.getValue("emailVerified");
      return isVerified ? (
        <CheckCircle2 className="h-5 w-5 text-green-500" />
      ) : (
        <XCircle className="h-5 w-5 text-muted-foreground" />
      );
    },
  },

  // Date Joined Column
  {
    accessorKey: "createdAt",
    header: "Date Joined",
    cell: ({ row }) => formatDate(row.getValue("createdAt")),
  },

  // Actions Column
  {
    id: "actions",
    cell: ({ row }) => {
      const user = row.original;
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
              <Link href={`/platform/users/${user.id}`}>View Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => {
                setSelectedRowData(user);
                setModalOpen(true);
              }}
            >
              Edit Roles
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive focus:bg-destructive/10 focus:text-destructive">
              Suspend User
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

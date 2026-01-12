"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDistanceToNow } from "date-fns";

// UI Imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// This is the shape of a single data item from our API
type AuditLog = {
  id: string;
  action: string;
  resourceId: string | null;
  resourceTable: string | null;
  createdAt: string;
  actor: {
    id: string;
    name: string | null;
    email: string;
  } | null; // Actor can be null if the user was deleted
};

// A helper to format the action string
const formatAction = (action: string) => {
  return action.replace(/_/g, " ").toLowerCase();
};

// A helper to generate a link to the resource, if possible
const getResourceLink = (table: string | null, id: string | null) => {
  if (!table || !id) return null;
  switch (table) {
    case "institutions":
      return `/platform/institutions/review/${id}`;
    case "users":
      return `/platform/users/${id}`;
    default:
      return null;
  }
};

export const getColumns = (): ColumnDef<AuditLog>[] => [
  // 1. Action Column
  {
    accessorKey: "action",
    header: "Action",
    cell: ({ row }) => {
      const log = row.original;
      const resourceLink = getResourceLink(log.resourceTable, log.resourceId);

      return (
        <div className="flex flex-col">
          <span className="font-medium capitalize">{formatAction(log.action)}</span>
          {resourceLink ? (
            <Link href={resourceLink} className="text-xs text-muted-foreground hover:underline">
              View Resource
            </Link>
          ) : (
            log.resourceId && <span className="text-xs text-muted-foreground">ID: {log.resourceId}</span>
          )}
        </div>
      );
    },
  },

  // 2. Actor Column
  {
    accessorKey: "actor",
    header: "Performed By",
    cell: ({ row }) => {
      const actor = row.original.actor;
      if (!actor) {
        return <span className="text-muted-foreground italic">System/Deleted User</span>;
      }
      return (
        <div className="flex flex-col">
          <span className="font-medium">{actor.name || "Unnamed User"}</span>
          <span className="text-xs text-muted-foreground">{actor.email}</span>
        </div>
      );
    },
  },

  // 3. Date/Time Column
  {
    accessorKey: "createdAt",
    header: "Date",
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const relativeTime = formatDistanceToNow(date, { addSuffix: true });
      const fullDate = date.toLocaleString();

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <span className="cursor-help underline decoration-dotted">{relativeTime}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>{fullDate}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

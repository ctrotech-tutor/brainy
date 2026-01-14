"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { MoreHorizontal, ArrowUpDown, ExternalLink, ShieldAlert, FileSearch, Building2 } from "lucide-react";

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
import { cn } from "@/lib/utils";

// This is the shape of the data coming from our API
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
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    UNDER_REVIEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    REQUEST_CHANGES: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    SUSPENDED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    ARCHIVED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };

  return (
    <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-black tracking-widest rounded-full border shadow-sm", statusStyles[status])}>
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
        className="translate-y-[2px] border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px] border-white/10 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
        className="px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group/header"
      >
        Institution Node
        <ArrowUpDown className="ml-2 h-3.5 w-3.5 opacity-0 group-hover/header:opacity-100 transition-opacity" />
      </Button>
    ),
    cell: ({ row }) => {
      const institution = row.original;
      return (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center shrink-0">
            <Building2 className="h-4 w-4 text-primary/60" />
          </div>
          <div className="flex flex-col">
            <Link
              href={`/platform/institutions/review/${institution.id}`}
              className="font-black text-sm tracking-tight text-foreground hover:text-primary transition-colors flex items-center gap-1.5 group/link"
            >
              {institution.name}
              <ExternalLink className="h-3 w-3 opacity-0 group-hover/link:opacity-100 transition-all -translate-y-0.5" />
            </Link>
            <span className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
              ID: {institution.id.slice(0, 8)}...
            </span>
          </div>
        </div>
      );
    },
  },

  // 3. Status Column
  {
    accessorKey: "status",
    header: "Registry Status",
    cell: ({ row }) => <StatusBadge status={row.getValue("status")} />,
  },

  // 4. Type Column
  {
    accessorKey: "type",
    header: "Classification",
    cell: ({ row }) => <div className="capitalize text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">{`${row.getValue("type")}`.replace("_", " ").toLowerCase()}</div>,
  },

  // 5. Country Column
  {
    accessorKey: "country",
    header: "Jurisdiction",
    cell: ({ row }) => <div className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40">{row.getValue("country") || "International"}</div>,
  },

  // 6. Created At Column
  {
    accessorKey: "createdAt",
    header: "Registry Timestamp",
    cell: ({ row }) => (
      <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 tabular-nums">
        {new Date(row.getValue("createdAt")).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: '2-digit'
        })}
      </div>
    ),
  },

  // 7. Actions Column
  {
    id: "actions",
    cell: ({ row }) => {
      const institution = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-lg hover:bg-white/5 border border-transparent hover:border-white/10 transition-all">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4 opacity-40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-white/10 bg-black/60 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl">
            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-3 py-2">Node Operations</DropdownMenuLabel>
            <DropdownMenuItem asChild className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest focus:bg-white/5 transition-all">
              <Link href={`/platform/institutions/review/${institution.id}`} className="flex items-center gap-3">
                <FileSearch className="h-4 w-4 opacity-60" />
                Review Manifest
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest focus:bg-white/5 transition-all">
              Edit Parameters
            </DropdownMenuItem>
            <DropdownMenuSeparator className="bg-white/5 mx-2" />
            <DropdownMenuItem className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-widest text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 transition-all">
              <ShieldAlert className="h-4 w-4 mr-3" />
              Sever Connection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

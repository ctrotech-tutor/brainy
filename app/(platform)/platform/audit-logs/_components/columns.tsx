"use client";

import { ColumnDef } from "@tanstack/react-table";
import Link from "next/link";
import { formatDistanceToNow, format } from "date-fns";
import { Activity, User, Calendar, ExternalLink, ShieldCheck, Fingerprint } from "lucide-react";

// UI Imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getInitials } from "@/lib/utils";

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
    image?: string | null;
  } | null; // Actor can be null if the user was deleted
};

// A helper to format the action string
const formatAction = (action: string) => {
  return action.replace(/_/g, " ").toUpperCase();
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
    header: ({ column }) => (
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
        Event Vector
      </div>
    ),
    cell: ({ row }) => {
      const log = row.original;
      const resourceLink = getResourceLink(log.resourceTable, log.resourceId);

      return (
        <div className="flex flex-col gap-1.5 py-1">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-primary/5 border border-primary/10">
              <Activity className="h-3 w-3 text-primary" />
            </div>
            <span className="text-[10px] font-black tracking-widest text-foreground uppercase">{formatAction(log.action)}</span>
          </div>
          {resourceLink ? (
            <Link href={resourceLink} className="inline-flex items-center gap-1.5 text-[9px] font-bold text-primary/60 hover:text-primary transition-colors pl-7 uppercase tracking-tight">
              <ExternalLink className="h-2.5 w-2.5" />
              Manifest Link
            </Link>
          ) : (
            log.resourceId && (
              <div className="flex items-center gap-1.5 text-[9px] font-bold text-muted-foreground/30 pl-7 uppercase tracking-tight font-mono">
                <Fingerprint className="h-2.5 w-2.5" />
                {log.resourceId.slice(0, 8)}...
              </div>
            )
          )}
        </div>
      );
    },
  },

  // 2. Actor Column
  {
    accessorKey: "actor",
    header: ({ column }) => (
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
        Orchestrator
      </div>
    ),
    cell: ({ row }) => {
      const actor = row.original.actor;
      if (!actor) {
        return (
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/5">
            <ShieldCheck className="h-3.5 w-3.5 text-muted-foreground/40" />
            <span className="text-[10px] font-black text-muted-foreground/40 uppercase tracking-widest italic">System Protocol</span>
          </div>
        );
      }
      return (
        <div className="flex items-center gap-3">
          <Avatar className="h-8 w-8 rounded-lg border border-white/5 shadow-lg">
            <AvatarFallback className="bg-primary/5 text-primary text-[9px] font-black uppercase">
              {getInitials(actor.name)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <span className="text-[10px] font-black text-foreground leading-none mb-1 uppercase tracking-tight">{actor.name || "UNNAMED ENTITY"}</span>
            <span className="text-[9px] font-bold text-muted-foreground/30 uppercase tracking-widest">{actor.email}</span>
          </div>
        </div>
      );
    },
  },

  // 3. Date/Time Column
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
        Manifest Timestamp
      </div>
    ),
    cell: ({ row }) => {
      const date = new Date(row.getValue("createdAt"));
      const relativeTime = formatDistanceToNow(date, { addSuffix: true });
      const fullDate = format(date, "MMM dd, yyyy · HH:mm:ss 'UTC'");

      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 text-[10px] font-bold text-muted-foreground/60 cursor-help group">
                <Calendar className="h-3 w-3 opacity-40 group-hover:text-primary transition-colors" />
                <span className="uppercase tracking-widest group-hover:text-foreground transition-colors">{relativeTime}</span>
              </div>
            </TooltipTrigger>
            <TooltipContent className="border-white/10 bg-black/80 backdrop-blur-xl rounded-xl p-3 shadow-2xl">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white">
                {fullDate}
              </p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    },
  },
];

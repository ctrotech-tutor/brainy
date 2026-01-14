"use client";

import { ColumnDef } from "@tanstack/react-table";
import {
  MoreHorizontal,
  ArrowUpDown,
  CheckCircle2,
  XCircle,
  UserCircle,
  ShieldCheck,
  Mail,
  Calendar,
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
import { cn } from "@/lib/utils";

// This is the shape of the data coming from our API
import { UserTableData } from "@/app/(platform)/_types";

// Define the props our columns function will accept
interface ColumnProps {
  setModalOpen: (open: boolean) => void;
  setSelectedRowData: (user: UserTableData | null) => void;
}

import { getInitials, formatDate } from "@/lib/utils";

// A map for styling role badges
const roleStyles: Record<string, string> = {
  PLATFORM_ADMIN: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  INSTITUTION_ADMIN: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  STUDENT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  TUTOR: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  USER: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  FACULTY_ADMIN: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  DEPARTMENT_ADMIN: "bg-sky-500/10 text-sky-500 border-sky-500/20",
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
          className="translate-y-[2px] border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
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
          className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 hover:text-primary transition-colors p-0"
        >
          Identity
          <ArrowUpDown className="ml-2 h-3 w-3" />
        </Button>
      ),
      cell: ({ row }) => {
        const user = row.original;
        return (
          <div className="flex items-center gap-4 py-1">
            <div className="relative group">
              <Avatar className="h-10 w-10 rounded-xl border border-white/5 shadow-2xl transition-transform group-hover:scale-105">
                <AvatarImage
                  src={user.image ?? undefined}
                  alt={user.name ?? "User"}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary/5 text-primary text-[10px] font-black uppercase rounded-xl">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <div className="absolute inset-0 rounded-xl bg-primary/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-bold text-foreground leading-none mb-1">{user.name || "UNREGISTERED"}</span>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-tight">
                <Mail className="h-2.5 w-2.5" />
                {user.email}
              </div>
            </div>
          </div>
        );
      },
    },

    // Roles Column
    {
      accessorKey: "roles",
      header: ({ column }) => (
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Authorization
        </div>
      ),
      cell: ({ row }) => {
        const roles = Array.isArray(row.getValue("roles"))
          ? (row.getValue("roles") as string[])
          : [];
        return (
          <div className="flex flex-wrap gap-1.5">
            {roles.map((role) => (
              <Badge
                key={role}
                variant="outline"
                className={cn("px-2 py-0.5 text-[9px] font-black tracking-widest uppercase rounded-full border shadow-sm", roleStyles[role] || roleStyles.USER)}
              >
                {role.replace(/_/g, " ")}
              </Badge>
            ))}
          </div>
        );
      },
    },

    // Email Verified Column
    {
      accessorKey: "emailVerified",
      header: ({ column }) => (
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Status
        </div>
      ),
      cell: ({ row }) => {
        const isVerified = !!row.getValue("emailVerified");
        return (
          <div className="flex items-center gap-2">
            {isVerified ? (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-emerald-500/80">Verified</span>
              </div>
            ) : (
              <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-rose-500/5 border border-rose-500/10">
                <XCircle className="h-3 w-3 text-rose-500" />
                <span className="text-[9px] font-black uppercase tracking-widest text-rose-500/80">Pending</span>
              </div>
            )}
          </div>
        );
      },
    },

    // Date Joined Column
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">
          Onboarding
        </div>
      ),
      cell: ({ row }) => (
        <div className="flex items-center gap-2 text-xs font-bold text-muted-foreground/70">
          <Calendar className="h-3.5 w-3.5 opacity-40" />
          {formatDate(row.getValue("createdAt"))}
        </div>
      ),
    },

    // Actions Column
    {
      id: "actions",
      cell: ({ row }) => {
        const user = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0 hover:bg-white/5 rounded-xl">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4 text-muted-foreground/60" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl rounded-2xl p-2">
              <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-3 py-2">
                User Protocols
              </DropdownMenuLabel>
              <DropdownMenuItem asChild className="rounded-xl focus:bg-white/5">
                <Link href={`/platform/users/${user.id}`} className="flex items-center gap-2 w-full text-[10px] font-bold uppercase tracking-widest">
                  <UserCircle className="h-3.5 w-3.5" />
                  View Profile
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem
                onSelect={() => {
                  setSelectedRowData(user);
                  setModalOpen(true);
                }}
                className="rounded-xl focus:bg-white/5 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2"
              >
                <ShieldCheck className="h-3.5 w-3.5" />
                Edit Permissions
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-white/5 mx-1" />
              <DropdownMenuItem className="rounded-xl text-rose-500 focus:bg-rose-500/10 focus:text-rose-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 rotate-180" />
                Revoke Access
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

// app/(platform)/platform/newsletter/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Mail, ArrowUpDown, User, Calendar } from "lucide-react";

// Define the shape of our data
export type NewsletterBroadcast = {
    id: string;
    subject: string;
    status: "DRAFT" | "SCHEDULED" | "SENDING" | "COMPLETED" | "FAILED";
    recipientsCount: number;
    createdAt: string | Date; // Depending on how it comes from DB
    author: {
        name: string | null;
    } | null;
};

export const columns: ColumnDef<NewsletterBroadcast>[] = [
    // Column 1: Subject
    {
        accessorKey: "subject",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group"
            >
                Subject
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Button>
        ),
        cell: ({ row }) => {
            return (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <Mail className="h-5 w-5" />
                    </div>
                    <span className="font-bold text-sm text-foreground leading-none">{row.getValue("subject")}</span>
                </div>
            );
        },
    },

    // Column 2: Status
    {
        accessorKey: "status",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as string;
            return (
                <Badge variant={status === "COMPLETED" ? "default" : "secondary"} className="font-bold px-2.5 py-0.5 text-[10px] tracking-widest rounded-full uppercase">
                    {status}
                </Badge>
            );
        },
    },

    // Column 3: Recipients
    {
        accessorKey: "recipientsCount",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Recipients</div>,
        cell: ({ row }) => (
            <div className="font-mono text-sm font-bold">
                {row.getValue("recipientsCount")}
            </div>
        ),
    },

    // Column 4: Author
    {
        accessorKey: "author.name",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60"> sent by</div>,
        cell: ({ row }) => {
            const author = row.original.author;
            return (
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <User className="h-3 w-3" />
                    {author?.name || "Unknown System"}
                </div>
            );
        },
    },

    // Column 5: Created At
    {
        accessorKey: "createdAt",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Date</div>,
        cell: ({ row }) => (
            <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                <Calendar className="h-3 w-3 text-muted-foreground/60" />
                {format(new Date(row.getValue("createdAt")), "MMM d, yyyy")}
            </div>
        ),
    },
];

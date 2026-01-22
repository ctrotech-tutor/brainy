"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Globe, Lock, Edit2, Eye, Trash2, FileText, ArrowUpDown } from "lucide-react";
import { DeleteLegalDocument } from "./DeleteLegalDocument";

// Define the shape of our data, consistent with other column files
export type LegalDocument = {
    id: string;
    title: string;
    slug: string;
    isPublished: boolean;
    version: number;
    lastUpdated: string;
    updatedBy: {
        name: string | null;
    } | null;
};

export const columns: ColumnDef<LegalDocument>[] = [
    // Column 1: Document Title & Slug
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group"
            >
                Document Title
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Button>
        ),
        cell: ({ row }) => {
            const doc = row.original;
            return (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-accent text-primary border border-border">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <span className="font-bold text-sm text-foreground leading-none">{doc.title}</span>
                        <div className="flex items-center gap-1.5 text-xs text-muted-foreground/60 mt-1.5">
                            {doc.isPublished ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                            <span>/{doc.slug}</span>
                        </div>
                    </div>
                </div>
            );
        },
    },

    // Column 2: Status
    {
        accessorKey: "isPublished",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</div>,
        cell: ({ row }) => {
            const isPublished = row.getValue("isPublished");
            return isPublished ? (
                <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 font-bold px-2.5 py-0.5 text-[10px] tracking-widest rounded-full">
                    Published
                </Badge>
            ) : (
                <Badge variant="outline" className="border-border text-muted-foreground font-bold px-2.5 py-0.5 text-[10px] tracking-widest rounded-full">
                    Draft
                </Badge>
            );
        },
    },

    // Column 3: Version
    {
        accessorKey: "version",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Version</div>,
        cell: ({ row }) => (
            <Badge variant="secondary" className="bg-accent text-foreground font-mono text-[10px] px-1.5">
                v{row.getValue("version")}
            </Badge>
        ),
    },

    // Column 4: Last Updated
    {
        accessorKey: "lastUpdated",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Last Updated</div>,
        cell: ({ row }) => {
            const doc = row.original;
            return (
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-foreground">
                        {format(new Date(doc.lastUpdated), "MMM d, yyyy")}
                    </span>
                    <span className="text-xs text-muted-foreground mt-0.5">
                        by {doc.updatedBy?.name || "System"}
                    </span>
                </div>
            );
        },
    },

    // Column 5: Actions
    {
        id: "actions",
        cell: ({ row }) => {
            const doc = row.original;
            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0 rounded-xl hover:bg-accent">
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground/60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-56 border-border bg-popover/80 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl">
                            <DropdownMenuLabel className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 px-3 py-2">
                                Document Protocols
                            </DropdownMenuLabel>
                            <DropdownMenuItem asChild className="rounded-xl focus:bg-accent text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                                <Link href={`/platform/legal/${doc.id}`}>
                                    <Edit2 className="h-3.5 w-3.5" />
                                    Edit Document
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl focus:bg-accent text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 cursor-pointer">
                                <Link href={`/legal/${doc.slug}`} target="_blank">
                                    <Eye className="h-3.5 w-3.5" />
                                    Public Preview
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border mx-1" />
                            <DropdownMenuItem className="rounded-xl text-destructive focus:bg-destructive/10 focus:text-destructive text-[10px] font-bold uppercase tracking-widest cursor-pointer p-0">
                                <DeleteLegalDocument documentId={doc.id} documentTitle={doc.title} />
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

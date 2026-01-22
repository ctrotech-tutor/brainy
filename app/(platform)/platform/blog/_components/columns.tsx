// app/(platform)/platform/blog/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash2, ArrowUpDown, FileText, Calendar, Tag } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
    publishedAt: string | null;
    views: number;
    createdAt: string;
    author: {
        id: string;
        name: string | null;
    };
    category: {
        id: string;
        name: string;
    } | null;
}

const statusColors = {
    DRAFT: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    PUBLISHED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ARCHIVED: "bg-slate-500/10 text-slate-500 border-slate-500/20",
};

export const columns: ColumnDef<BlogPost>[] = [
    // Column 1: Title
    {
        accessorKey: "title",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group"
            >
                Post Title
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Button>
        ),
        cell: ({ row }) => {
            const post = row.original;
            return (
                <div className="flex items-center gap-3 py-1">
                    <div className="h-10 w-10 flex-shrink-0 flex items-center justify-center rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <FileText className="h-5 w-5" />
                    </div>
                    <div className="flex flex-col">
                        <Link
                            href={`/platform/blog/${post.id}/edit`}
                            className="font-bold text-sm text-foreground hover:text-primary transition-colors line-clamp-1"
                        >
                            {post.title}
                        </Link>
                        <span className="text-xs text-muted-foreground">/{post.slug}</span>
                    </div>
                </div>
            );
        },
    },

    // Column 2: Status
    {
        accessorKey: "status",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Status</div>,
        cell: ({ row }) => {
            const status = row.getValue("status") as BlogPost["status"];
            return (
                <Badge
                    className={cn(
                        "rounded-lg text-[10px] font-black tracking-widest uppercase px-2 py-0.5 border",
                        statusColors[status]
                    )}
                >
                    {status}
                </Badge>
            );
        },
    },

    // Column 3: Category
    {
        accessorKey: "category",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Category</div>,
        cell: ({ row }) => {
            const category = row.original.category;
            return category ? (
                <div className="flex items-center gap-2">
                    <Tag className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-medium text-muted-foreground">{category.name}</span>
                </div>
            ) : (
                <span className="text-sm text-muted-foreground/50 italic">Uncategorized</span>
            );
        },
    },

    // Column 4: Views
    {
        accessorKey: "views",
        header: ({ column }) => (
            <Button
                variant="ghost"
                onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                className="px-0 hover:bg-transparent text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 group"
            >
                Views
                <ArrowUpDown className="ml-2 h-3 w-3 opacity-0 group-hover:opacity-100" />
            </Button>
        ),
        cell: ({ row }) => {
            const views = row.getValue("views") as number;
            return (
                <div className="flex items-center gap-2 text-sm font-mono font-bold text-muted-foreground">
                    <Eye className="h-3 w-3 opacity-50" />
                    {views.toLocaleString()}
                </div>
            );
        },
    },

    // Column 5: Published At
    {
        accessorKey: "publishedAt",
        header: () => <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60">Date</div>,
        cell: ({ row }) => {
            const publishedAt = row.getValue("publishedAt") as string | null;
            return (
                <div className="flex items-center gap-2 text-xs font-medium text-foreground">
                    <Calendar className="h-3 w-3 text-muted-foreground/60" />
                    {publishedAt ? format(new Date(publishedAt), "MMM d, yyyy") : "Draft"}
                </div>
            );
        },
    },

    // Column 6: Actions
    {
        id: "actions",
        cell: ({ row }) => {
            const post = row.original;

            return (
                <div className="text-right">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button
                                variant="ghost"
                                className="h-8 w-8 p-0 rounded-xl hover:bg-accent"
                            >
                                <MoreHorizontal className="h-4 w-4 text-muted-foreground/60" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                            align="end"
                            className="w-48 border-white/10 bg-black/80 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl"
                        >
                            <DropdownMenuItem asChild className="rounded-xl focus:bg-accent cursor-pointer text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 py-2">
                                <Link href={`/platform/blog/${post.id}/edit`}>
                                    <Pencil className="h-3.5 w-3.5" />
                                    Edit Post
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild className="rounded-xl focus:bg-accent cursor-pointer text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 py-2">
                                <Link href={`/blog/${post.slug}`} target="_blank">
                                    <Eye className="h-3.5 w-3.5" />
                                    Live Preview
                                </Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="bg-border/50 mx-1" />
                            <DropdownMenuItem className="rounded-xl focus:bg-destructive/10 focus:text-destructive cursor-pointer text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 py-2 text-muted-foreground">
                                <Trash2 className="h-3.5 w-3.5" />
                                Delete
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            );
        },
    },
];

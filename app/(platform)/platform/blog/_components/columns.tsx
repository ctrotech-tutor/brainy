// app/(platform)/platform/blog/_components/columns.tsx
"use client";

import { ColumnDef } from "@tanstack/react-table";
import { format } from "date-fns";
import { Eye, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
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
    PUBLISHED: "bg-green-500/10 text-green-500 border-green-500/20",
    ARCHIVED: "bg-gray-500/10 text-gray-500 border-gray-500/20",
};

export const columns: ColumnDef<BlogPost>[] = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => {
            const post = row.original;
            return (
                <div className="flex flex-col">
                    <Link
                        href={`/platform/blog/${post.id}/edit`}
                        className="font-bold text-foreground hover:text-primary transition-colors line-clamp-1"
                    >
                        {post.title}
                    </Link>
                    <span className="text-xs text-muted-foreground">/{post.slug}</span>
                </div>
            );
        },
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => {
            const status = row.getValue("status") as BlogPost["status"];
            return (
                <span
                    className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border",
                        statusColors[status]
                    )}
                >
                    {status}
                </span>
            );
        },
    },
    {
        accessorKey: "category",
        header: "Category",
        cell: ({ row }) => {
            const category = row.original.category;
            return category ? (
                <span className="text-sm text-muted-foreground">{category.name}</span>
            ) : (
                <span className="text-sm text-muted-foreground/50 italic">Uncategorized</span>
            );
        },
    },
    {
        accessorKey: "views",
        header: "Views",
        cell: ({ row }) => {
            const views = row.getValue("views") as number;
            return (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Eye className="h-4 w-4" />
                    {views.toLocaleString()}
                </div>
            );
        },
    },
    {
        accessorKey: "publishedAt",
        header: "Published",
        cell: ({ row }) => {
            const publishedAt = row.getValue("publishedAt") as string | null;
            return (
                <span className="text-sm text-muted-foreground">
                    {publishedAt ? format(new Date(publishedAt), "MMM dd, yyyy") : "Not published"}
                </span>
            );
        },
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const post = row.original;

            return (
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            className="h-8 w-8 p-0 hover:bg-accent"
                        >
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                        align="end"
                        className="border-border bg-popover/80 backdrop-blur-2xl rounded-2xl p-2 shadow-2xl"
                    >
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-accent cursor-pointer">
                            <Link href={`/platform/blog/${post.id}/edit`} className="flex items-center">
                                <Pencil className="mr-2 h-4 w-4" />
                                Edit
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild className="rounded-xl focus:bg-accent cursor-pointer">
                            <Link href={`/blog/${post.slug}`} target="_blank" className="flex items-center">
                                <Eye className="mr-2 h-4 w-4" />
                                View
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-border" />
                        <DropdownMenuItem className="rounded-xl focus:bg-destructive/10 focus:text-destructive cursor-pointer">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            );
        },
    },
];

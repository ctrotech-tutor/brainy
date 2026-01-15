// app/(platform)/platform/legal/page.tsx
import { Metadata } from "next";
import { db } from "@/db";
import { legalDocuments } from "@/db/schema";
import { desc } from "drizzle-orm";
import { Scale, Plus, Search, FileText, Globe, Lock, MoreVertical, Edit2, Trash2, Eye } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
    title: "Legal Management | Brainy Platform",
    description: "Manage platform policies, terms, and agreements.",
};

export default async function LegalManagementPage() {
    const documents = await db.query.legalDocuments.findMany({
        with: {
            updatedBy: true,
        },
        orderBy: [desc(legalDocuments.lastUpdated)],
    });

    return (
        <div className="flex flex-col gap-8">
            {/* Header Section */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground flex items-center gap-3">
                        <Scale className="h-8 w-8 text-primary" />
                        Legal Management
                    </h1>
                    <p className="text-muted-foreground mt-1 text-lg">
                        Create and manage platform-wide policies, terms, and legal agreements.
                    </p>
                </div>
                <Button className="w-full sm:w-auto gap-2 shadow-xl shadow-primary/20 transition-all hover:scale-105" asChild>
                    <Link href="/platform/legal/new">
                        <Plus className="h-4 w-4" />
                        Create New Policy
                    </Link>
                </Button>
            </div>

            {/* Stats Overview */}
            <div className="grid gap-4 md:grid-cols-4">
                <Card className="border-border bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Total Documents</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{documents.length}</div>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Published</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-success">
                            {documents.filter(d => d.isPublished).length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Drafts</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold text-amber-500">
                            {documents.filter(d => !d.isPublished).length}
                        </div>
                    </CardContent>
                </Card>
                <Card className="border-border bg-card/50 backdrop-blur-xl">
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">Last Updated</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold text-primary">
                            {documents.length > 0 ? format(documents[0].lastUpdated, "MMM d, yyyy") : "N/A"}
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Data Table Section */}
            <Card className="border-border bg-card/50 backdrop-blur-xl overflow-hidden shadow-2xl">
                <CardHeader className="border-b border-border bg-muted/20 backdrop-blur-2xl">
                    <div className="flex items-center justify-between">
                        <div className="relative w-full max-w-sm">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search policies..."
                                className="pl-10 border-border bg-card focus-visible:ring-primary/50"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="p-0">
                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-border bg-muted/20 text-sm font-medium text-muted-foreground uppercase tracking-wider">
                                    <th className="px-6 py-4">Title & Slug</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Version</th>
                                    <th className="px-6 py-4">Last Updated</th>
                                    <th className="px-6 py-4 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-border">
                                {documents.map((doc) => (
                                    <tr key={doc.id} className="group hover:bg-accent transition-colors duration-200">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="h-10 w-10 flex items-center justify-center rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-300">
                                                    <FileText className="h-5 w-5" />
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="font-semibold text-foreground leading-none">{doc.title}</span>
                                                    <span className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1">
                                                        {doc.isPublished ? <Globe className="h-3 w-3" /> : <Lock className="h-3 w-3" />}
                                                        /{doc.slug}
                                                    </span>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {doc.isPublished ? (
                                                <Badge className="bg-success/10 text-success border-success/20 hover:bg-success/20 font-bold px-2.5">
                                                    Published
                                                </Badge>
                                            ) : (
                                                <Badge variant="outline" className="border-border text-muted-foreground font-bold px-2.5">
                                                    Draft
                                                </Badge>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Badge variant="secondary" className="bg-accent text-foreground font-mono text-[10px] px-1.5">
                                                v{doc.version}
                                            </Badge>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-foreground">
                                                    {format(doc.lastUpdated, "MMM d, yyyy")}
                                                </span>
                                                <span className="text-xs text-muted-foreground mt-0.5">
                                                    by {doc.updatedBy?.name || "System"}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:bg-accent hover:text-foreground">
                                                        <MoreVertical className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end" className="w-56 border-border bg-popover/80 backdrop-blur-xl shadow-2xl">
                                                    <DropdownMenuLabel>Legal Actions</DropdownMenuLabel>
                                                    <DropdownMenuSeparator className="bg-border" />
                                                    <DropdownMenuItem asChild className="gap-2 cursor-pointer focus:bg-primary focus:text-primary-foreground transition-colors">
                                                        <Link href={`/platform/legal/${doc.id}`}>
                                                            <Edit2 className="h-4 w-4" />
                                                            Edit Content
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem asChild className="gap-2 cursor-pointer focus:bg-accent transition-colors">
                                                        <Link href={`/legal/${doc.slug}`} target="_blank">
                                                            <Eye className="h-4 w-4" />
                                                            Public Preview
                                                        </Link>
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator className="bg-border" />
                                                    <DropdownMenuItem className="gap-2 text-destructive cursor-pointer focus:bg-destructive focus:text-destructive-foreground transition-colors">
                                                        <Trash2 className="h-4 w-4" />
                                                        Archive Document
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </td>
                                    </tr>
                                ))}

                                {documents.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                                            <div className="flex flex-col items-center gap-3">
                                                <FileText className="h-12 w-12 opacity-20" />
                                                <p className="text-lg">No legal documents found.</p>
                                                <Button variant="link" asChild>
                                                    <Link href="/platform/legal/new">Create your first policy</Link>
                                                </Button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

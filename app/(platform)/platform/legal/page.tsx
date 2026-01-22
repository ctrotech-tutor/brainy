import { Metadata } from "next";
import { db } from "@/db";
import { desc } from "drizzle-orm";
import Link from "next/link";
import { format } from "date-fns";
import { Suspense } from "react"; // Import Suspense
import { Scale, Plus, FileText, Globe, Clock, LockIcon } from "lucide-react";

// UI Components
import { Button } from "@/components/ui/button";
import { StatCard } from "@/app/(platform)/_components/stat-card";
import { DataTable } from "../../_components/data-table";
import { columns } from "./_components/columns";
import { DataTableSkeleton } from "../../_components/data-table-skeleton";
import { legalDocuments } from "@/db/schema";

export const metadata: Metadata = {
    title: "Legal Management",
    description: "Manage platform policies, terms, and agreements.",
};

export default async function LegalManagementPage() {
    // 1. Fetch data for the StatCards on the server
    const documents = await db.query.legalDocuments.findMany({
        orderBy: [desc(legalDocuments.lastUpdated)],
    });

    return (
        <div className="space-y-12">
            {/* Action 1: The consistent "Golden Rule" header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Scale className="h-3 w-3" />
                        Compliance Framework
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        Legal <span className="text-primary italic">Registry.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Create and manage platform-wide policies, terms, and legal agreements.
                    </p>
                </div>
                <Button asChild className="h-10 rounded-xl px-6 text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 transition-all hover:scale-105 active:scale-95">
                    <Link href="/platform/legal/new">
                        <Plus className="mr-2 h-4 w-4" />
                        New Document
                    </Link>
                </Button>
            </div>

            {/* Action 2: The consistent StatCards using server-fetched data */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                <StatCard
                    title="Total Documents"
                    value={documents.length}
                    icon={<FileText className="h-3.5 w-3.5" />}
                    description="Authored policies and terms."
                />
                <StatCard
                    title="Published"
                    value={documents.filter(d => d.isPublished).length}
                    icon={<Globe className="h-3.5 w-3.5" />}
                    description="Live and viewable by public."
                />
                <StatCard
                    title="Drafts"
                    value={documents.filter(d => !d.isPublished).length}
                    icon={<LockIcon className="h-3.5 w-3.5" />}
                    description="In-progress, not yet live."
                />
                <StatCard
                    title="Last Update"
                    value={documents.length > 0 ? format(new Date(documents[0].lastUpdated), "MMM d, yyyy") : "N/A"}
                    icon={<Clock className="h-3.5 w-3.5" />}
                    description="Most recent modification."
                />
            </div>

            {/* Action 3: The client-side DataTable with its Suspense boundary */}
            <Suspense fallback={<DataTableSkeleton columnCount={5} />}>
                <DataTable
                    columns={columns}
                    apiEndpoint="/api/platform/legal" // This still needs to be created
                    queryKey="legal-documents"
                    filterColumn="title"
                    filterPlaceholder="Search by title..."
                />
            </Suspense>
        </div>
    );
}

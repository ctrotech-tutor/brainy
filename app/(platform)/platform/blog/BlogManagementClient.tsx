// app/(platform)/platform/blog/BlogManagementClient.tsx
"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { FileText, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "../../_components/data-table";
import { columns } from "./_components/columns";

export default function BlogManagementClient() {
    const router = useRouter();

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <FileText className="h-3 w-3" />
                        Content Management
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        Blog <span className="text-primary italic">Management.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Create, edit, and publish blog posts for the Brainy OS platform.
                    </p>
                </div>
                <Button
                    onClick={() => router.push("/platform/blog/new")}
                    className="rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest px-6 h-10 gap-2"
                >
                    <Plus className="h-3.5 w-3.5" />
                    Create Post
                </Button>
            </div>

            <Suspense fallback={<Skeleton className="h-[600px] w-full rounded-[3rem] bg-muted/20" />}>
                <DataTable
                    columns={columns}
                    apiEndpoint="/api/platform/blog"
                    queryKey="blog-posts"
                    filterColumn="title"
                    filterPlaceholder="Search posts..."
                    staleTime={1000 * 60 * 15} // 15 minutes
                />
            </Suspense>
        </div>
    );
}

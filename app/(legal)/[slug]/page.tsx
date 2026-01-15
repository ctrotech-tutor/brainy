// app/(legal)/[slug]/page.tsx
import { Metadata } from "next";
import { db } from "@/db";
import { legalDocuments } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { format } from "date-fns";
import { Scale, Globe, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface LegalPageProps {
    params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: LegalPageProps): Promise<Metadata> {
    const { slug } = await params;
    const doc = await db.query.legalDocuments.findFirst({
        where: and(
            eq(legalDocuments.slug, slug),
            eq(legalDocuments.isPublished, true)
        ),
    });

    if (!doc) return { title: "Not Found | Brainy" };

    return {
        title: `${doc.title} | Brainy Legal`,
        description: `Official ${doc.title} for the Brainy platform.`,
    };
}

export default async function DynamicLegalPage({ params }: LegalPageProps) {
    const { slug } = await params;

    const doc = await db.query.legalDocuments.findFirst({
        where: and(
            eq(legalDocuments.slug, slug),
            eq(legalDocuments.isPublished, true)
        ),
    });

    if (!doc) {
        notFound();
    }

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            {/* Back Button */}
            <Button variant="ghost" size="sm" asChild className="mb-8 gap-2 text-muted-foreground hover:text-foreground">
                <Link href="/">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Home
                </Link>
            </Button>

            <div className="flex flex-col gap-6 mb-12">
                <div className="flex items-center gap-3 text-primary">
                    <Scale className="h-10 w-10 p-2 rounded-xl bg-primary/10" />
                    <span className="text-sm font-bold uppercase tracking-widest">Brainy Legal</span>
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tight text-foreground leading-[1.1]">
                    {doc.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b border-white/5 pb-8">
                    <div className="flex items-center gap-1.5 font-medium">
                        <Globe className="h-4 w-4" />
                        Public Official Version
                    </div>
                    <span className="text-white/10">•</span>
                    <div>Version {doc.version}</div>
                    <span className="text-white/10">•</span>
                    <div>Last Updated: {format(doc.lastUpdated, "MMMM d, yyyy")}</div>
                </div>
            </div>

            {/* Markdown Content */}
            <article className="prose prose-invert prose-slate max-w-none prose-h2:text-primary prose-h2:mt-12 prose-h2:mb-6 prose-p:text-muted-foreground prose-p:leading-relaxed prose-li:text-muted-foreground prose-strong:text-foreground animate-in fade-in slide-in-from-bottom-4 duration-500">
                <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                        h1: ({ node, ...props }) => <h1 className="sr-only" {...props} />, // Title already rendered above
                        h2: ({ node, ...props }) => <h2 className="text-2xl font-bold mt-12 mb-6 text-primary scroll-m-20" {...props} />,
                        p: ({ node, ...props }) => <p className="text-muted-foreground leading-relaxed mb-6 text-lg" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-8 space-y-3 text-muted-foreground" {...props} />,
                        li: ({ node, ...props }) => <li className="pl-2" {...props} />,
                        strong: ({ node, ...props }) => <strong className="text-foreground font-bold" {...props} />,
                        a: ({ node, ...props }) => <a className="text-primary hover:text-primary/80 transition-colors underline underline-offset-4" {...props} />,
                    }}
                >
                    {doc.content}
                </ReactMarkdown>
            </article>

            {/* Footer Branding */}
            <div className="mt-20 pt-12 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6 opacity-50 text-xs">
                <p>© {new Date().getFullYear()} Brainy Platform. All rights reserved.</p>
                <div className="flex items-center gap-4">
                    <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
                    <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
                    <Link href="/about" className="hover:text-foreground transition-colors">About</Link>
                </div>
            </div>
        </div>
    );
}

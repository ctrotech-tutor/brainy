import { notFound } from "next/navigation";
import { getDocBySlug } from "@/lib/docs";
import { Wrapper } from "@/components/ui/wrapper";
import { DocsSidebar } from "@/components/docs/DocsSidebar";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ChevronRight, Calendar, Clock, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface DocPageProps {
    params: Promise<{
        slug: string[];
    }>;
}

export default async function DocPage({ params }: DocPageProps) {
    const resolvedParams = await params;
    const doc = getDocBySlug(resolvedParams.slug);

    if (!doc) {
        notFound();
    }

    return (
        <Wrapper className="py-24 sm:py-32">
            <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
                {/* Sidebar - Hidden on mobile, can be added to a sheet later */}
                <aside className="hidden lg:block">
                    <DocsSidebar />
                </aside>

                {/* Content */}
                <div className="max-w-4xl">
                    {/* Breadcrumbs */}
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/40 mb-8 overflow-x-auto whitespace-nowrap">
                        <Link href="/docs" className="hover:text-primary transition-colors">Docs</Link>
                        {resolvedParams.slug.map((segment, idx) => (
                            <div key={segment} className="flex items-center gap-2">
                                <ChevronRight className="h-3 w-3" />
                                <span className={idx === resolvedParams.slug.length - 1 ? "text-primary/60" : "hover:text-primary transition-colors cursor-pointer"}>
                                    {segment.replace(/-/g, " ")}
                                </span>
                            </div>
                        ))}
                    </nav>

                    <article className="prose prose-slate dark:prose-invert max-w-none">
                        {/* Custom markdown rendering to match theme */}
                        <ReactMarkdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                                h1: ({ children }) => (
                                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tighter text-foreground mb-8 leading-[1.1]">
                                        {children}
                                    </h1>
                                ),
                                h2: ({ children }) => (
                                    <h2 className="text-2xl font-black tracking-tight text-foreground mt-12 mb-6 flex items-center gap-3">
                                        <div className="h-2 w-2 rounded-full bg-primary" />
                                        {children}
                                    </h2>
                                ),
                                h3: ({ children }) => (
                                    <h3 className="text-xl font-bold tracking-tight text-foreground mt-8 mb-4">
                                        {children}
                                    </h3>
                                ),
                                p: ({ children }) => (
                                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                                        {children}
                                    </p>
                                ),
                                ul: ({ children }) => (
                                    <ul className="space-y-4 mb-8 list-none pl-0">
                                        {children}
                                    </ul>
                                ),
                                li: ({ children }) => (
                                    <li className="flex items-start gap-4 text-muted-foreground group">
                                        <div className="mt-2.5 h-1.5 w-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors flex-shrink-0" />
                                        <span className="text-lg leading-relaxed">{children}</span>
                                    </li>
                                ),
                                strong: ({ children }) => (
                                    <strong className="font-black text-foreground">{children}</strong>
                                ),
                                hr: () => (
                                    <hr className="my-12 border-border" />
                                ),
                                a: ({ href, children }) => (
                                    <Link
                                        href={href || "#"}
                                        className="text-primary underline decoration-primary/20 underline-offset-8 hover:decoration-primary transition-all font-bold"
                                    >
                                        {children}
                                    </Link>
                                )
                            }}
                        >
                            {doc.content}
                        </ReactMarkdown>
                    </article>

                    {/* Doc Footer */}
                    <div className="mt-20 pt-10 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-6">
                        <Link
                            href="/docs"
                            className="group flex items-center gap-3 text-sm font-bold text-muted-foreground hover:text-foreground transition-all"
                        >
                            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-border group-hover:border-primary/20 group-hover:text-primary transition-all">
                                <ArrowLeft className="h-5 w-5" />
                            </div>
                            Back to Hub
                        </Link>

                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                <Calendar className="h-3.5 w-3.5" />
                                Updated Today
                            </div>
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                                <Clock className="h-3.5 w-3.5" />
                                5 Min Read
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Wrapper>
    );
}

// app/(marketing)/blog/[slug]/not-found.tsx
import { Wrapper } from "@/components/ui/wrapper";
import Link from "next/link";
import { FileQuestion, ArrowLeft } from "lucide-react";

export default function NotFound() {
    return (
        <Wrapper className="py-24 sm:py-32">
            <div className="max-w-2xl mx-auto text-center px-4">
                <div className="h-24 w-24 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto mb-8">
                    <FileQuestion className="h-12 w-12 text-primary" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground mb-6">
                    Blog Post Not Found
                </h1>
                <p className="text-xl text-muted-foreground mb-12">
                    The blog post you're looking for doesn't exist or has been removed.
                </p>
                <Link
                    href="/blog"
                    className="inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-black uppercase tracking-widest hover:bg-primary/90 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5" />
                    Back to Blog
                </Link>
            </div>
        </Wrapper>
    );
}

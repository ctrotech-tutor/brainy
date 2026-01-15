"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Book, ChevronRight, GraduationCap, Zap, Building2, ShieldCheck, HelpCircle } from "lucide-react";

const navigation = [
    {
        title: "Introduction",
        links: [
            { title: "Getting Started", href: "/docs/getting-started", icon: Book },
        ],
    },
    {
        title: "Students",
        links: [
            { title: "Taking Assessments", href: "/docs/students/taking-assessments", icon: GraduationCap },
        ],
    },
    {
        title: "Tutors",
        links: [
            { title: "Creating Quizzes", href: "/docs/tutors/creating-quizzes", icon: Zap },
        ],
    },
    {
        title: "Institutions",
        links: [
            { title: "Onboarding", href: "/docs/institutions/onboarding", icon: Building2 },
        ],
    },
];

export function DocsSidebar() {
    const pathname = usePathname();

    return (
        <nav className="sticky top-24 space-y-8 pr-6">
            {navigation.map((group) => (
                <div key={group.title} className="space-y-3">
                    <h4 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
                        {group.title}
                    </h4>
                    <ul className="space-y-1">
                        {group.links.map((link) => {
                            const isActive = pathname === link.href;
                            const Icon = link.icon;
                            return (
                                <li key={link.href}>
                                    <Link
                                        href={link.href}
                                        className={cn(
                                            "group flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-bold transition-all",
                                            isActive
                                                ? "bg-primary/10 text-primary shadow-sm"
                                                : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
                                        )}
                                    >
                                        <div className={cn(
                                            "flex h-8 w-8 items-center justify-center rounded-lg border transition-all",
                                            isActive
                                                ? "border-primary/20 bg-background text-primary"
                                                : "border-border bg-card text-muted-foreground group-hover:border-primary/20"
                                        )}>
                                            <Icon className="h-4 w-4" />
                                        </div>
                                        {link.title}
                                        <ChevronRight className={cn(
                                            "ml-auto h-3.5 w-3.5 opacity-0 transition-all",
                                            isActive ? "opacity-100 translate-x-0" : "group-hover:opacity-40 -translate-x-1"
                                        )} />
                                    </Link>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            ))}

            {/* Quick Help Card */}
            <div className="mt-12 p-6 rounded-3xl bg-card border border-border shadow-sm">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent text-primary border border-border mb-4">
                    <HelpCircle className="h-5 w-5" />
                </div>
                <h5 className="font-black text-foreground text-sm mb-2">Stuck?</h5>
                <p className="text-[11px] text-muted-foreground leading-relaxed mb-4">
                    Can't find what you need? Our support team is available 24/7.
                </p>
                <Link
                    href="/contact"
                    className="text-[10px] font-black uppercase tracking-widest text-primary hover:underline underline-offset-4"
                >
                    Contact Support
                </Link>
            </div>
        </nav>
    );
}

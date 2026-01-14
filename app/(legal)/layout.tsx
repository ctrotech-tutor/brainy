"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  FileText,
  Shield,
  HandMetal,
  Scale,
  Building2,
  UserRound,
  Cookie
} from "lucide-react";

import { BackgroundDecor } from "@/components/core/background-decor";

const legalLinks = [
  { name: "Terms of Service", href: "/terms", icon: FileText },
  { name: "Privacy Policy", href: "/privacy", icon: Shield },
  { name: "Acceptable Use", href: "/acceptable-use", icon: HandMetal },
  { name: "Academic Integrity", href: "/academic-integrity", icon: Scale },
  { name: "Institution Agreement", href: "/institution-agreement", icon: Building2 },
  { name: "Tutor Agreement", href: "/tutor-agreement", icon: UserRound },
  { name: "Cookie Policy", href: "/cookies", icon: Cookie },
];

export default function LegalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <div className="relative min-h-screen bg-background">
      <BackgroundDecor />

      <Wrapper className="py-24 sm:py-32">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar Navigation */}
          <aside className="lg:w-72 flex-shrink-0">
            <div className="sticky top-32 space-y-2">
              <h2 className="px-4 mb-6 text-sm font-bold uppercase tracking-widest text-muted-foreground/60">
                Legal Center
              </h2>
              <nav className="flex flex-col gap-1">
                {legalLinks.map((link) => {
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "group flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground hover:bg-card hover:text-foreground"
                      )}
                    >
                      <link.icon className={cn(
                        "h-5 w-5 transition-transform duration-300 group-hover:scale-110",
                        isActive ? "text-primary-foreground" : "text-muted-foreground"
                      )} />
                      {link.name}
                      {isActive && (
                        <motion.div
                          layoutId="legal-active-indicator"
                          className="ml-auto h-1.5 w-1.5 rounded-full bg-primary-foreground"
                        />
                      )}
                    </Link>
                  );
                })}
              </nav>

              <div className="mt-12 p-6 rounded-3xl bg-card/40 border border-white/5 backdrop-blur-md">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  Last Updated: Jan 2026<br />
                  For legal inquiries, contact <Link href="/contact" className="text-primary hover:underline">legal@brainy.os</Link>
                </p>
              </div>
            </div>
          </aside>

          {/* Content Area */}
          <main className="flex-1 min-w-0">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="prose prose-lg prose-invert max-w-none 
                prose-headings:font-black prose-headings:tracking-tighter prose-headings:text-foreground
                prose-p:text-muted-foreground/90 prose-p:leading-relaxed
                prose-li:text-muted-foreground/90
                prose-strong:text-foreground prose-strong:font-bold
                prose-a:text-primary prose-a:no-underline hover:prose-a:underline
                bg-card/30 border border-white/5 rounded-[3rem] p-8 md:p-16 backdrop-blur-xl"
            >
              {children}
            </motion.div>
          </main>
        </div>
      </Wrapper>
    </div>
  );
}

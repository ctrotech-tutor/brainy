"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
  Book,
  Search,
  GraduationCap,
  Zap,
  Building2,
  ShieldCheck,
  Code2,
  Terminal,
  ChevronRight,
  ArrowUpRight,
  Lightbulb,
  Workflow
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { cn } from "@/lib/utils";

const docCategories = [
  {
    title: "Introduction",
    icon: Book,
    description: "New to Brainy? Start here to understand our core philosophy and how to get your institution running.",
    links: [
      { name: "Getting Started", href: "/docs/getting-started" },
      { name: "Core Features", href: "/docs/getting-started#key-features" }
    ]
  },
  {
    title: "For Students",
    icon: GraduationCap,
    description: "Learn how to take quizzes, track your progress, and manage your academic profile.",
    links: [
      { name: "Taking an Assessment", href: "/docs/students/taking-assessments" },
      { name: "Viewing Results", href: "/docs/students/taking-assessments#viewing-results" },
      { name: "Integrity Protocol", href: "/docs/students/taking-assessments#the-integrity-protocol" }
    ]
  },
  {
    title: "For Tutors",
    icon: Zap,
    description: "Master quiz creation, AI-assisted question generation, and department management.",
    links: [
      { name: "Creating Your First Quiz", href: "/docs/tutors/creating-quizzes" },
      { name: "Using AI Assist", href: "/docs/tutors/creating-quizzes#using-ai-assist" },
      { name: "Integrity Settings", href: "/docs/tutors/creating-quizzes#integrity-settings" }
    ]
  },
  {
    title: "For Institutions",
    icon: Building2,
    description: "Setup your hierarchy, manage faculties, and enforce institution-wide integrity.",
    links: [
      { name: "Institution Onboarding", href: "/docs/institutions/onboarding" },
      { name: "Verification Process", href: "/docs/institutions/onboarding#verification-process" },
      { name: "Auditing & Analytics", href: "/docs/institutions/onboarding#auditing--analytics" }
    ]
  }
];

export default function DocsPage() {
  return (
    <>
      <Wrapper className="py-24 sm:py-32">
        {/* Docs Hero */}
        <div className="max-w-4xl mx-auto text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-black uppercase tracking-widest mb-8">
              <Book className="h-4 w-4" />
              Documentation Hub
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.9]">
              How it <span className="text-primary prose-italics">Works.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-12">
              Explore our comprehensive guides, technical references, and best
              practices to get the most out of Brainy OS.
            </p>

            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search the documentation..."
                className="h-16 rounded-[2rem] bg-card border-border pl-16 pr-8 text-lg shadow-2xl shadow-primary/5 backdrop-blur-xl focus-visible:ring-primary/20 transition-all focus-visible:scale-[1.02]"
              />
              <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-accent border border-border text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                <Terminal className="h-3 w-3" />
                Ctrl + K
              </div>
            </div>
          </motion.div>
        </div>

        {/* Categories Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-24">
          {docCategories.map((cat, idx) => (
            <motion.div
              key={cat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="group p-10 md:p-12 rounded-[3.5rem] bg-card border border-border shadow-sm transition-all hover:bg-accent/40 hover:border-primary/20 hover:shadow-xl"
            >
              <div className="flex items-start justify-between mb-8">
                <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform border border-primary/20">
                  <cat.icon className="h-8 w-8" />
                </div>
                <Link
                  href={cat.links[0].href}
                  className="h-10 w-10 rounded-full bg-accent border border-border flex items-center justify-center text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all"
                >
                  <ArrowUpRight className="h-5 w-5" />
                </Link>
              </div>

              <h3 className="text-3xl font-black tracking-tight text-foreground mb-4">{cat.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-8">{cat.description}</p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-border">
                {cat.links.map(link => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="flex items-center gap-2 text-sm font-bold text-muted-foreground hover:text-primary transition-colors group/link"
                  >
                    <ChevronRight className="h-3.5 w-3.5 text-primary opacity-0 group-hover/link:opacity-100 transition-all -translate-x-2 group-hover/link:translate-x-0" />
                    {link.name}
                  </Link>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Quick Links Section */}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 p-10 rounded-[2.5rem] bg-primary/5 border border-border backdrop-blur-md">
            <h3 className="text-xl font-black text-foreground mb-6 flex items-center gap-2">
              <Workflow className="h-5 w-5 text-primary" />
              Developer API
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed mb-8">
              Integrate Brainy directly into your existing institutional LMS with our
              robust REST API and Webhooks.
            </p>
            <Link href="#" className="flex items-center gap-2 text-sm font-black text-primary hover:gap-4 transition-all">
              Go to API Docs <ArrowUpRight className="h-5 w-5" />
            </Link>
          </div>

          <div className="lg:col-span-2 p-10 rounded-[2.5rem] bg-card border border-border shadow-sm flex flex-col md:flex-row items-center gap-10">
            <div className="h-20 w-20 rounded-[2rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 flex-shrink-0 border border-emerald-500/20">
              <Lightbulb className="h-10 w-10" />
            </div>
            <div>
              <h3 className="text-xl font-black text-foreground mb-3">Best Practices for Educators</h3>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6">
                Discover how to design more effective questions and structure your
                faculties for maximum efficiency and security.
              </p>
              <div className="flex gap-4">
                <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-border hover:bg-accent transition-all">Read Guide</Button>
                <Button variant="outline" className="h-11 px-6 rounded-xl font-bold border-border hover:bg-accent transition-all">Watch Tutorial</Button>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

"use client";

import { useState } from "react";
import { Wrapper } from "@/components/ui/wrapper";
import { Input } from "@/components/ui/input";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  HelpCircle,
  BookOpen,
  MessageCircle,
  Shield,
  ChevronDown,
  Sparkles,
  Zap,
  Building2,
  GraduationCap
} from "lucide-react";
import { cn } from "@/lib/utils";

import { FAQS, FAQ_CATEGORIES } from "@/lib/faqs";
import { useEffect } from "react";

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // Deep linking support
  useEffect(() => {
    const hash = window.location.hash.replace("#", "");
    if (hash && FAQS.find(f => f.id === hash)) {
      setExpandedId(hash);
      const element = document.getElementById(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, []);

  const handleExpand = (id: string) => {
    const newId = expandedId === id ? null : id;
    setExpandedId(newId);
    if (newId) {
      window.history.replaceState(null, "", `#${id}`);
    } else {
      window.history.replaceState(null, "", window.location.pathname);
    }
  };

  const filteredFaqs = FAQS.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === "all" || faq.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <>
      <Wrapper className="py-24 sm:py-32">
        {/* Header Section */}
        <div className="max-w-3xl mx-auto text-center mb-16 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <BookOpen className="h-3.5 w-3.5" />
              Help Center
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8">
              How can we <span className="text-primary prose-italics">assist you?</span>
            </h1>

            <div className="relative max-w-2xl mx-auto group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                type="text"
                placeholder="Search for questions, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 rounded-[2rem] bg-card border-border pl-16 pr-8 text-lg shadow-2xl shadow-primary/5 backdrop-blur-xl focus-visible:ring-primary/20 transition-all focus-visible:scale-[1.02]"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-[280px_1fr] gap-12 items-start">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-1 space-y-8">
            <div className="space-y-3">
              <h2 className="px-4 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Knowledge Base</h2>
              <nav className="flex flex-col gap-1">
                <button
                  onClick={() => setActiveCategory("all")}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                    activeCategory === "all"
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "text-muted-foreground hover:bg-card hover:text-foreground"
                  )}
                >
                  <Sparkles className="h-5 w-5" />
                  All FAQs
                </button>
                {FAQ_CATEGORIES.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={cn(
                      "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold transition-all",
                      activeCategory === cat.id
                        ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                        : "text-muted-foreground hover:bg-card hover:text-foreground"
                    )}
                  >
                    <cat.icon className="h-5 w-5" />
                    {cat.name}
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-8 rounded-[2.5rem] bg-card border border-border shadow-sm">
              <h3 className="font-black text-foreground mb-4">Need more help?</h3>
              <p className="text-xs text-muted-foreground mb-6 leading-relaxed">
                If you can't find the answer you're looking for, feel free to contact
                our support team.
              </p>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl font-bold border-border hover:bg-accent transition-all">
                <Link href="/contact" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </aside>

          {/* FAQ List */}
          <div className="flex-1">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  layout
                >
                  {filteredFaqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      id={faq.id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      className={cn(
                        "rounded-[2.5rem] border transition-all duration-300 overflow-hidden",
                        expandedId === faq.id
                          ? "bg-card border-primary/20 shadow-xl"
                          : "bg-card/40 border-border hover:border-primary/10"
                      )}
                    >
                      <button
                        onClick={() => handleExpand(faq.id)}
                        className="w-full flex items-center justify-between p-8 md:p-10 text-left group"
                      >
                        <span className="text-xl md:text-2xl font-black tracking-tight text-foreground pr-8">
                          {faq.question}
                        </span>
                        <div className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-full bg-accent border border-border flex items-center justify-center transition-all duration-300",
                          expandedId === faq.id ? "rotate-180 bg-primary/20 text-primary border-primary/20" : "group-hover:border-primary/20"
                        )}>
                          <ChevronDown className="h-6 w-6" />
                        </div>
                      </button>
                      <AnimatePresence>
                        {expandedId === faq.id && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3, ease: "easeInOut" }}
                          >
                            <div className="px-8 md:px-10 pb-10">
                              <div className="h-px bg-border mb-8" />
                              <p className="text-lg text-muted-foreground leading-relaxed">
                                {faq.answer}
                              </p>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-24 rounded-[3rem] bg-accent/20 border border-dashed border-border"
                >
                  <HelpCircle className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                  <p className="text-xl font-bold text-muted-foreground">
                    No matching questions found.
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Try searching for different keywords or browse categories.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

// Minimal Button/Link replacements since they aren't imported in my initial guess but I should use UI components
import { Button } from "@/components/ui/button";
import Link from "next/link";

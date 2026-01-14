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

const categories = [
  { id: "general", name: "General", icon: HelpCircle },
  { id: "students", name: "Students", icon: GraduationCap },
  { id: "tutors", name: "Tutors", icon: Zap },
  { id: "institutions", name: "Institutions", icon: Building2 },
  { id: "security", name: "Security", icon: Shield },
];

const faqs = [
  {
    id: 1,
    category: "general",
    question: "What is Brainy OS?",
    answer: "Brainy OS is a comprehensive academic assessment ecosystem designed to streamline testing, grading, and result management while ensuring the highest standards of integrity."
  },
  {
    id: 2,
    category: "security",
    question: "How does Brainy prevent cheating?",
    answer: "We use a multi-layered approach including time-windowed assessments, activity pattern recognition, IP tracking, and role-based verification to ensure every test is fair and genuine."
  },
  {
    id: 3,
    category: "students",
    question: "Can I take a quiz on my mobile phone?",
    answer: "Yes! Brainy is fully responsive. As long as your institution allows mobile access for a specific assessment, you can take quizzes on any modern smartphone browser."
  },
  {
    id: 4,
    category: "tutors",
    question: "How do I use the AI quiz generator?",
    answer: "Our AI assistant can help you generate questions based on topics or uploaded text. Simply navigate to your dashboard, select 'Create Quiz', and use the 'AI Assist' option."
  },
  {
    id: 5,
    category: "institutions",
    question: "How do we verify our institution?",
    answer: "Institutions must submit official documentation through the onboarding process. Our team reviews these documents to ensure only legitimate academic bodies are verified on the platform."
  },
  {
    id: 6,
    category: "general",
    question: "Is there a free plan for students?",
    answer: "Students access Brainy through their institutions or tutors. There are no direct costs to students for participating in assessments assigned to them."
  },
];

export default function HelpPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [expandedId, setExpandedId] = useState<number | null>(null);

  const filteredFaqs = faqs.filter(faq => {
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

            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-6 w-6 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for questions, categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-16 rounded-[2rem] bg-card/50 border-white/10 pl-16 pr-8 text-lg shadow-2xl shadow-primary/5 backdrop-blur-xl focus-visible:ring-primary/20"
              />
            </div>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-4 gap-12 items-start">
          {/* Categories Sidebar */}
          <aside className="lg:col-span-1 space-y-6">
            <h2 className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60 px-4">Categories</h2>
            <nav className="flex flex-col gap-2">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
                  activeCategory === "all"
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                    : "text-muted-foreground hover:bg-card hover:text-foreground"
                )}
              >
                <Sparkles className="h-5 w-5" />
                All FAQs
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "flex items-center gap-3 px-6 py-4 rounded-2xl text-sm font-bold transition-all",
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

            <div className="p-8 rounded-[2rem] bg-card/40 border border-white/5 backdrop-blur-md">
              <h3 className="font-black text-foreground mb-4">Need more help?</h3>
              <p className="text-sm text-muted-foreground mb-6 leading-relaxed">
                If you can't find the answer you're looking for, feel free to contact
                our support team.
              </p>
              <Button asChild variant="outline" className="w-full h-12 rounded-xl font-bold border-white/10">
                <Link href="/contact" className="flex items-center justify-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Contact Support
                </Link>
              </Button>
            </div>
          </aside>

          {/* FAQ List */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="popLayout">
              {filteredFaqs.length > 0 ? (
                <motion.div
                  className="space-y-4"
                  layout
                >
                  {filteredFaqs.map((faq) => (
                    <motion.div
                      key={faq.id}
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={cn(
                        "rounded-[2.5rem] border transition-all duration-300 overflow-hidden",
                        expandedId === faq.id
                          ? "bg-card border-primary/20 shadow-2xl"
                          : "bg-card/40 border-white/5 hover:border-white/10"
                      )}
                    >
                      <button
                        onClick={() => setExpandedId(expandedId === faq.id ? null : faq.id)}
                        className="w-full flex items-center justify-between p-8 md:p-10 text-left"
                      >
                        <span className="text-xl md:text-2xl font-black tracking-tight text-foreground pr-8">
                          {faq.question}
                        </span>
                        <div className={cn(
                          "flex-shrink-0 h-10 w-10 rounded-full bg-secondary/50 flex items-center justify-center transition-transform duration-300",
                          expandedId === faq.id ? "rotate-180 bg-primary/20 text-primary" : ""
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
                              <div className="h-px bg-white/5 mb-8" />
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
                  className="text-center py-24 rounded-[3rem] bg-card/20 border border-dashed border-white/10"
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

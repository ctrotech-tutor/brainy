import Link from "next/link";
import { ArrowRight, University, ShieldCheck, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "Student Verification Phase",
  description: "Initialize your institutional identity sequence.",
};

export default function StudentOnboardingStartPage() {
  return (
    <div className="w-full space-y-12">
      {/* Narrative Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" />
          Sequence Phase 02
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
          Identity <span className="text-primary italic">Verification.</span>
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base font-medium text-muted-foreground leading-relaxed">
          To unlock the full potential of Brainy Multi-Agent AI, we need to establish a cryptographically secure link to your institution.
        </p>
      </div>

      {/* Verification Matrix */}
      <div className="relative p-8 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 transition-opacity" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary border border-primary/20 shadow-xl">
              <University className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-6 w-full max-w-md">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-white/5 pb-4">
              Required Protocol Data
            </h3>

            <div className="grid gap-4">
              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary/80">Protocol A</div>
                  <div className="text-xs font-bold text-foreground">Official University Email (.edu)</div>
                </div>
              </div>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-white/2 border border-white/5 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-primary/80">Protocol B</div>
                  <div className="text-xs font-bold text-foreground">Matriculation / Student ID</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Sequence */}
      <div className="flex flex-col items-center gap-6">
        <Button
          asChild
          className="group relative h-16 w-full max-w-sm rounded-[1.25rem] bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
        >
          <Link href="/onboarding/student/details">
            Enter Verification Data
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center leading-relaxed">
          Sequence takes approximately 120 seconds. <br />
          Encrypted with military-grade SHA-256.
        </div>
      </div>
    </div>
  );
}

import Link from "next/link";
import { ArrowRight, Building, Sparkles, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import { motion } from "framer-motion";

export const metadata: Metadata = {
  title: "Institution Registry",
  description: "Initialize your institutional gateway sequence.",
};

export default function InstitutionOnboardingStartPage() {
  return (
    <div className="w-full space-y-12">
      {/* Narrative Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" />
          Institutional Protocol 01
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
          Institutional <span className="text-primary italic">Gateway.</span>
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base font-medium text-muted-foreground leading-relaxed">
          Standardize your institutional assessment infrastructure with Brainy's secure, Multi-Agent AI ecosystem.
        </p>
      </div>

      {/* Protocol Roadmap */}
      <div className="relative p-8 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 transition-opacity" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-primary/10 text-primary border border-primary/20 shadow-xl">
              <Building className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-8 w-full max-w-lg">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-white/5 pb-4">
              Registry Sequence Overview
            </h3>

            <div className="grid gap-6">
              <div className="flex items-start gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10 font-black text-xs">01</div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-foreground">Structural Setup</div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">Define institutional metadata and administrative contact nodes.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10 font-black text-xs">02</div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-foreground">Identity Handshake</div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">Cryptographic proof of authority via official institutional email.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/10 font-black text-xs">03</div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-foreground">Gateway Activation</div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">Final audit by Brainy security engineers within 24 hours.</p>
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
          <Link href="/onboarding/institution/details">
            Activate Registry Flow
            <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </Button>

        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">
          <div className="flex items-center gap-2">
            <Clock className="h-3 w-3" />
            24h Response SLA
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" />
            Verified Network
          </div>
        </div>
      </div>
    </div>
  );
}

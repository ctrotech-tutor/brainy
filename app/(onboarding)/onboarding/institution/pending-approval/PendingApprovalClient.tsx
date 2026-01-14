"use client";

import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Hourglass, ShieldCheck, ArrowRight, Sparkles, UserCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PendingApprovalClient() {
  const router = useRouter();

  const handleContinue = () => {
    router.push("/dashboard");
  };

  return (
    <div className="w-full space-y-12">
      {/* Narrative Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-[10px] font-black uppercase tracking-widest text-amber-500">
          <Hourglass className="h-3 w-3" />
          Queue Sequence Active
        </div>
        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-[1.1]">
          Registry <span className="text-amber-500 italic">Review.</span>
        </h1>
        <p className="max-w-xl mx-auto text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed">
          Your institutional application is currently undergoing standard security audit and integrity verification.
        </p>
      </div>

      {/* Status Card */}
      <div className="relative p-8 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-transparent opacity-50 transition-opacity" />

        <div className="relative z-10 flex flex-col items-center text-center space-y-8">
          <div className="relative">
            <div className="absolute inset-0 bg-amber-500/20 blur-2xl rounded-full" />
            <div className="relative flex h-20 w-20 items-center justify-center rounded-[2rem] bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-xl">
              <UserCheck className="h-10 w-10" />
            </div>
          </div>

          <div className="space-y-8 w-full max-w-lg">
            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground/60 border-b border-white/5 pb-4 text-center">
              Audit Progression
            </h3>

            <div className="grid gap-6">
              <div className="flex items-start gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-foreground">Integrity Handshake</div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">A Brainy engineer will manually verify your institutional credentials.</p>
                </div>
              </div>

              <div className="flex items-start gap-4 text-left">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 border border-amber-500/10">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="space-y-1">
                  <div className="text-xs font-black uppercase tracking-widest text-foreground">Signal Notification</div>
                  <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-relaxed">Approval status will be transmitted via email within 24-48 hours.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Action Sequence */}
      <div className="flex flex-col items-center gap-6">
        <Button
          onClick={handleContinue}
          className="group relative h-16 w-full max-w-sm rounded-[1.25rem] bg-foreground text-background font-black uppercase tracking-widest shadow-2xl transition-all hover:scale-[1.02] active:scale-95"
        >
          Proceed to Gateway
          <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
        </Button>

        <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 text-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-3 w-3" />
            Limited Access Active
          </div>
          <div className="h-4 w-px bg-white/5" />
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-3 w-3" />
            Audited Flow
          </div>
        </div>
      </div>
    </div>
  );
}

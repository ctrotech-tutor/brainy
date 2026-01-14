"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Loader2, Sparkles, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { RoleSelector } from "@/components/get-started/role-selector";
import { roleData, type SelectableRole } from "@/lib/roles";

export default function ChoosePathClient() {
  const router = useRouter();
  const [activeRole, setActiveRole] = useState<SelectableRole>("student");

  const { mutate: setIntent, isPending } = useMutation({
    mutationFn: async (intent: SelectableRole) => {
      const response = await axios.post("/api/onboarding/intent", { intent });
      return response.data;
    },
    onSuccess: (data) => {
      router.push(data.nextStep || `/onboarding/${activeRole}/start`);
    },
    onError: (error: any) => {
      toast.error("Cloud Error: Failed to initialize sequence.");
      console.error(error);
    }
  });

  const handleContinue = () => setIntent(activeRole);

  const activeData = roleData[activeRole];
  const ActiveVisual = activeData.visual;

  return (
    <div className="w-full space-y-12">
      {/* Narrative Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary">
          <Sparkles className="h-3 w-3" />
          Onboarding Sequence 01
        </div>
        <h1 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]">
          Define Your <span className="text-primary italic">Identity.</span>
        </h1>
        <p className="max-w-xl mx-auto text-sm md:text-base font-medium text-muted-foreground leading-relaxed">
          Welcome to the Brainy ecosystem. Please select your institutional profile to initialize your customized dashboard.
        </p>
      </motion.div>

      {/* Role Selection Matrix */}
      <div className="mx-auto max-w-md">
        <RoleSelector activeRole={activeRole} setActiveRole={setActiveRole} />
      </div>

      {/* Dynamic Role Preview */}
      <div className="relative min-h-[340px] flex items-center justify-center p-8 rounded-[3rem] bg-card/30 border border-white/5 backdrop-blur-xl shadow-2xl overflow-hidden group">
        <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-transparent to-secondary/5 opacity-50 transition-opacity group-hover:opacity-100" />

        <AnimatePresence mode="wait">
          <motion.div
            key={activeRole}
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.05, y: -20 }}
            transition={{ duration: 0.4, ease: "circOut" }}
            className="relative z-10 flex flex-col items-center text-center space-y-6"
          >
            <div className="p-4 rounded-[2rem] bg-white/5 border border-white/10 shadow-inner">
              <ActiveVisual />
            </div>
            <div className="space-y-2">
              <h3 className="text-2xl font-black tracking-tighter text-foreground uppercase">
                {activeData.title}
              </h3>
              <p className="max-w-md text-sm font-medium text-muted-foreground leading-relaxed">
                {activeData.description}
              </p>
            </div>

            <div className="flex items-center gap-6 pt-4 border-t border-white/5">
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">Features</div>
                <div className="text-xs font-bold text-foreground">Multi-Agent AI</div>
              </div>
              <div className="h-8 w-px bg-white/5" />
              <div className="flex flex-col items-center gap-1">
                <div className="text-[10px] font-black uppercase tracking-widest text-primary/60">SLA</div>
                <div className="text-xs font-bold text-foreground">99.9% Uptime</div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Action Sequence */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col items-center gap-6"
      >
        <Button
          onClick={handleContinue}
          disabled={isPending}
          className="group relative h-16 w-full max-w-sm rounded-[1.25rem] bg-primary text-primary-foreground font-black uppercase tracking-widest shadow-2xl shadow-primary/20 transition-all hover:shadow-primary/40 hover:scale-[1.02] active:scale-95"
        >
          {isPending ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <>
              Initialize {activeData.title} Profile
              <ArrowRight className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" />
            </>
          )}
        </Button>

        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">
          <ShieldCheck className="h-3 w-3" />
          Encrypted handshake in progress
        </div>
      </motion.div>
    </div>
  );
}

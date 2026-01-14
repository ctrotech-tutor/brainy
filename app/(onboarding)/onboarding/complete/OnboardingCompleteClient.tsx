"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Sparkles, Loader2 } from "lucide-react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function OnboardingCompleteClient() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/dashboard");
    }, 4500);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="w-full space-y-12">
      {/* Narrative Header */}
      <div className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black uppercase tracking-widest text-primary"
        >
          <Sparkles className="h-3 w-3" />
          Sequence Finalized
        </motion.div>

        <motion.h1
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="text-4xl md:text-6xl font-black tracking-tighter text-foreground leading-[1.1]"
        >
          Setup <span className="text-primary italic">Manifest.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="max-w-xl mx-auto text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed"
        >
          Your identity parameters and institutional credentials have been successfully integrated into the Brainy secure ecosystem.
        </motion.p>
      </div>

      {/* Celebratory Visual */}
      <div className="relative flex justify-center py-12">
        <div className="relative">
          {/* Background Glows */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="absolute inset-x-[-4rem] inset-y-[-4rem] bg-linear-to-br from-primary/30 to-secondary/30 blur-[4rem] rounded-full opacity-50"
          />

          <motion.div
            initial={{ rotate: -20, scale: 0.5, opacity: 0 }}
            animate={{ rotate: 0, scale: 1, opacity: 1 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20,
              delay: 0.6,
            }}
            className="relative z-10 flex h-32 w-32 items-center justify-center rounded-[3rem] bg-card border border-white/10 shadow-2xl backdrop-blur-3xl"
          >
            <ShieldCheck className="h-16 w-16 text-primary" />
          </motion.div>

          {/* Orbiting particles or effects could go here if more complexity is needed */}
        </div>
      </div>

      {/* Redirect Notice */}
      <div className="flex flex-col items-center gap-8">
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
            <Loader2 className="h-4 w-4 animate-spin text-primary" />
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Initialising Gateway Protocol...</span>
          </div>

          <div className="flex items-center gap-6 text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">
            <div className="flex items-center gap-2">
              Identity Root Check
            </div>
            <div className="h-4 w-px bg-white/5" />
            <div className="flex items-center gap-2 text-primary">
              SHA-384 Audited
            </div>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 pt-4"
        >
          Identity node globally synchronized.
        </motion.div>
      </div>
    </div>
  );
}

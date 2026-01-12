// components/mockup/InstitutionDashboardVisual.tsx
"use client";

import { motion } from "framer-motion";
import { ShieldCheck, Building, Users } from "lucide-react";
import { cn } from "@/lib/utils";

const InstitutionDashboardVisual = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      viewport={{ once: true }}
      className="relative w-full max-w-md select-none"
    >
      {/* Ambient Glow */}
      <div className="absolute -inset-6 rounded-3xl bg-gradient-to-tr from-primary/30 via-sky-500/20 to-green-400/20 blur-3xl opacity-70" />

      {/* Visual Mockup */}
      <div
        className={cn(
          "relative overflow-hidden rounded-3xl",
          "bg-gradient-to-br from-background/70 to-background/30",
          "backdrop-blur-2xl border border-white/10",
          "shadow-[0_30px_80px_-20px_rgba(0,0,0,0.6)]"
        )}
      >
        {/* Grain Overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-overlay bg-[url('/noise.jpeg')]" />

        <div className="p-6 space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-widest text-muted-foreground">
                Admin Dashboard
              </p>
              <h3 className="text-sm font-semibold text-foreground/80">
                Institutional Overview
              </h3>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-success/10 px-3 py-1 text-xs text-success">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-md">
              <p className="text-xs text-muted-foreground">Faculties</p>
              <p className="mt-1 text-2xl font-bold text-foreground/90">8</p>
            </div>
            <div className="rounded-2xl bg-white/5 p-4 backdrop-blur-md">
              <p className="text-xs text-muted-foreground">Total Users</p>
              <p className="mt-1 text-2xl font-bold text-foreground/90">1,204</p>
            </div>
          </div>

          {/* Department List (visual only) */}
          <div className="space-y-3">
            <p className="text-xs font-medium text-muted-foreground">
              Managed Departments
            </p>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <Building className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground/80">
                  Dept. of Computer Science
                </p>
                <p className="text-[10px] text-muted-foreground">
                  15 Tutors, 250 Students
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3 opacity-70">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-medium text-foreground/80">
                  Faculty of Business
                </p>
                <p className="text-[10px] text-muted-foreground">
                  12 Tutors, 180 Students
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default InstitutionDashboardVisual;

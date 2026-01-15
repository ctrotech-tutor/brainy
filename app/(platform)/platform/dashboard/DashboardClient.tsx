// app/(platform)/platform/dashboard/DashboardClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import {
  Activity,
  Building2,
  Users,
  GraduationCap,
  ArrowUpRight,
  AlertTriangle,
  Sparkles,
  ShieldCheck,
  Mail,
} from "lucide-react";

import { getErrorMessage } from "@/lib/utils";
import { motion } from "framer-motion";

// UI Imports
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { PlatformStats } from "@/app/(platform)/_types";

// The function that fetches data from our stats API
const getPlatformStats = async (): Promise<PlatformStats> => {
  const { data } = await axios.get("/api/platform/stats");
  return data;
};

// A reusable StatCard component for consistency
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  link,
  variant = "default",
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  link?: string;
  variant?: "default" | "primary" | "warning";
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="group relative h-full"
  >
    <div className="absolute inset-0 bg-accent/20 blur-xl group-hover:bg-primary/5 transition-colors rounded-[2rem]" />
    <Card className="relative h-full rounded-[2rem] border-border bg-card/50 backdrop-blur-xl shadow-2xl transition-all group-hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-primary">
          <Icon className="h-3.5 w-3.5" />
          {title}
        </div>
        {link && (
          <Link href={link} className="opacity-0 group-hover:opacity-100 transition-opacity">
            <ArrowUpRight className="h-4 w-4 text-primary" />
          </Link>
        )}
      </CardHeader>
      <CardContent className="space-y-1">
        <div className="text-4xl font-black tracking-tighter text-foreground leading-none">
          {value}
        </div>
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest leading-relaxed">
          {description}
        </p>
      </CardContent>
    </Card>
  </motion.div>
);

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { y: 20, opacity: 0 },
  show: { y: 0, opacity: 1 }
};

// The main dashboard page component
export default function DashboardClient() {
  const { data: stats, isPending: isLoading, isError, error } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });

  // Handle the loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-8 w-48 rounded-lg bg-muted/20" />
          <Skeleton className="h-4 w-64 rounded-lg bg-muted/20" />
        </div>
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-40 rounded-[2rem] bg-muted/10 border border-border p-6 space-y-4">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3 w-20 bg-muted/20" />
                <Skeleton className="h-4 w-4 rounded-full bg-muted/20" />
              </div>
              <Skeleton className="h-10 w-16 bg-muted/20" />
              <Skeleton className="h-3 w-32 bg-muted/20" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-border bg-card/50 py-24 text-center">
        <div className="h-20 w-20 rounded-3xl bg-destructive/10 flex items-center justify-center mb-6">
          <AlertTriangle className="h-10 w-10 text-destructive" />
        </div>
        <h3 className="text-xl font-black tracking-tighter text-foreground uppercase">Signal Lost</h3>
        <p className="mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest max-w-xs mx-auto">
          {getErrorMessage(error)}
        </p>
      </div>
    );
  }

  // Render the dashboard if data is successfully loaded
  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
            <ShieldCheck className="h-3 w-3" />
            System Intelligence
          </div>
          <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
            Platform <span className="text-primary italic">Nucleus.</span>
          </h1>
          <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-xs">
            Synthesized operational parameters and institutional traffic analytics.
          </p>
        </div>
        <div className="flex items-center gap-3 px-4 py-2 rounded-2xl bg-card border border-border backdrop-blur-md">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
          <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registry Session: Active</span>
        </div>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2 lg:grid-cols-5"
      >
        <motion.div variants={item}>
          <StatCard
            title="Pending Registries"
            value={stats?.pendingInstitutions ?? 0}
            icon={Activity}
            description="Nodes awaiting manual audit."
            link="/platform/institutions/pending"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Institutional Nodes"
            value={stats?.activeInstitutions ?? 0}
            icon={Building2}
            description="Verified academic clusters."
            link="/platform/institutions/active"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Identity Matrix"
            value={stats?.totalUsers ?? 0}
            icon={Users}
            description="Globally synchronized users."
            link="/platform/users"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Verified Records"
            value={stats?.totalStudents ?? 0}
            icon={GraduationCap}
            description="Secured student credentials."
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            title="Unread Leads"
            value={stats?.unreadLeads ?? 0}
            icon={Mail}
            description="New contact inquiries."
            link="/platform/leads"
          />
        </motion.div>
      </motion.div>

      {/* Placeholder for more complex analytics */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6 }}
        className="h-64 flex flex-col items-center justify-center rounded-[3rem] border border-border bg-card/50 backdrop-blur-xl border-dashed"
      >
        <div className="flex flex-col items-center gap-3 text-muted-foreground/20">
          <Activity className="h-12 w-12" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em]">Traffic Telemetry Unavailable</span>
        </div>
      </motion.div>
    </div>
  );
}

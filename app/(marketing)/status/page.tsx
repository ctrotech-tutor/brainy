"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Activity,
  ShieldCheck,
  Database,
  Cpu,
  Lock,
  RefreshCcw,
  Clock,
  ExternalLink
} from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";

const components = [
  { name: "Brainy Core API", status: "operational", uptime: "99.98%", icon: Activity },
  { name: "Database Cluster", status: "operational", uptime: "100%", icon: Database },
  { name: "Authentication Service", status: "operational", uptime: "99.99%", icon: Lock },
  { name: "AI Question Engine", status: "operational", uptime: "99.95%", icon: Cpu },
  { name: "File Storage & Static Assets", status: "operational", uptime: "100%", icon: ShieldCheck },
  { name: "Real-time Notifications", status: "operational", uptime: "99.90%", icon: RefreshCcw },
];

const incidents = [
  {
    date: "Jan 10, 2026",
    title: "AI Engine Latency",
    status: "Resolved",
    description: "Brief increase in response times during peak academic hours. Infrastructure was automatically scaled to compensate.",
    type: "maintenance"
  },
  {
    date: "Jan 5, 2026",
    title: "Scheduled Maintenance",
    status: "Completed",
    description: "Database migration and performance optimizations successfully implemented.",
    type: "update"
  }
];

export default function StatusPage() {
  return (
    <>

      <Wrapper className="py-24 sm:py-32">
        {/* Status Hero */}
        <div className="max-w-4xl mx-auto mb-20 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-4 px-8 py-6 rounded-[3rem] bg-emerald-500/5 border border-emerald-500/20 backdrop-blur-xl mb-12 shadow-2xl shadow-emerald-500/10"
          >
            <div className="relative">
              <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              <div className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-20" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground">
                All Systems <span className="text-emerald-500">Operational.</span>
              </h1>
              <p className="text-sm font-bold text-emerald-500/60 uppercase tracking-widest mt-1">
                Last checked: moments ago
              </p>
            </div>
          </motion.div>

          <h2 className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
            Real-time status of Brainy OS infrastructure and services.
            We maintain high availability for institutions and students globally.
          </h2>
        </div>

        {/* Components Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-24">
          {components.map((comp, idx) => (
            <motion.div
              key={comp.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="p-8 rounded-[2.5rem] bg-card/40 border border-white/5 backdrop-blur-md transition-all hover:bg-card/60 group"
            >
              <div className="flex items-center justify-between mb-8">
                <div className="h-14 w-14 rounded-2xl bg-secondary/50 flex items-center justify-center text-muted-foreground group-hover:text-primary transition-colors">
                  <comp.icon className="h-7 w-7" />
                </div>
                <div className="flex flex-col items-end">
                  <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {comp.status}
                  </div>
                  <span className="text-[10px] font-bold text-muted-foreground/60 mt-2">Uptime: {comp.uptime}</span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-foreground mb-2">{comp.name}</h3>
              <div className="flex gap-1">
                {Array.from({ length: 30 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-6 flex-1 rounded-sm bg-emerald-500/20 group-hover:bg-emerald-500/40 transition-colors"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        {/* Performance Graph Placeholder */}
        <div className="mb-24 rounded-[3rem] bg-card/30 border border-white/5 p-12 overflow-hidden relative">
          <div className="flex items-center justify-between mb-12">
            <div>
              <h3 className="text-2xl font-black text-foreground mb-1">Global Response Latency</h3>
              <p className="text-muted-foreground font-medium">Average across all regions in the last 24h</p>
            </div>
            <div className="text-right">
              <div className="text-4xl font-black text-primary tracking-tighter">128ms</div>
              <p className="text-emerald-500 text-xs font-bold uppercase tracking-widest mt-1">Excellent</p>
            </div>
          </div>

          <div className="h-40 flex items-end gap-2 px-4">
            {Array.from({ length: 40 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${20 + Math.random() * 60}%` }}
                className="flex-1 bg-primary/20 rounded-t-lg relative group"
              >
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-popover border border-white/10 px-2 py-1 rounded text-[10px] opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  {100 + Math.floor(Math.random() * 50)}ms
                </div>
              </motion.div>
            ))}
          </div>
          <div className="flex justify-between mt-6 text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest px-4">
            <span>24h Ago</span>
            <span>12h Ago</span>
            <span>Now</span>
          </div>
        </div>

        {/* Past Incidents */}
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 mb-12">
            <h3 className="text-sm font-black uppercase tracking-widest text-muted-foreground/60">Incident History</h3>
            <div className="h-px bg-white/5 flex-1" />
          </div>

          <div className="space-y-12">
            {incidents.map((incident, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 + idx * 0.1 }}
                className="relative pl-12 border-l border-white/5"
              >
                <div className="absolute left-[-5px] top-0 h-2.5 w-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                  <div>
                    <span className="text-xs font-bold text-muted-foreground/60 uppercase tracking-widest">{incident.date}</span>
                    <h4 className="text-xl font-bold text-foreground mt-1">{incident.title}</h4>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-500 text-[10px] font-black tracking-widest uppercase self-start md:self-center">
                    {incident.status}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed max-w-2xl">
                  {incident.description}
                </p>
              </motion.div>
            ))}
          </div>

          <div className="mt-20 p-8 rounded-[2.5rem] bg-secondary/30 border border-white/5 flex flex-col md:flex-row items-center justify-between gap-8 backdrop-blur-md">
            <div className="flex items-center gap-6">
              <div className="h-16 w-16 rounded-[1.5rem] bg-primary/10 flex items-center justify-center text-primary">
                <AlertCircle className="h-8 w-8" />
              </div>
              <div className="text-left">
                <h3 className="text-lg font-bold text-foreground">Subscribe to Updates</h3>
                <p className="text-sm text-muted-foreground">Get real-time SMS or Email alerts for incidents.</p>
              </div>
            </div>
            <Link
              href="/contact"
              className="px-8 py-4 rounded-2xl bg-primary text-primary-foreground font-bold text-sm shadow-xl shadow-primary/20 hover:scale-105 transition-all flex items-center gap-2"
            >
              Setup Alerts
              <Clock className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </Wrapper>
    </>
  );
}

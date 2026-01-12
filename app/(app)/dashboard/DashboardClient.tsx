"use client";

import { motion } from "framer-motion";
import { 
  Plus, 
  ArrowRight, 
  GraduationCap, 
  Building2, 
  BookOpen, 
  Users, 
  TrendingUp, 
  Zap,
  ShieldCheck,
  ChevronRight
} from "lucide-react";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for the advanced dashboard
const STATS = [
  { label: "Active Courses", value: "12", icon: BookOpen, color: "text-blue-500", bg: "bg-blue-500/10" },
  { label: "Average Score", value: "88%", icon: TrendingUp, color: "text-green-500", bg: "bg-green-500/10" },
  { label: "Pending Tests", value: "3", icon: Zap, color: "text-amber-500", bg: "bg-amber-500/10" },
];

export default function DashboardClient() {
  // Fetch user session for personalization
  const { data: userData } = useQuery({
    queryKey: ["user-session"],
    queryFn: async () => {
      const { data } = await axios.get("/api/auth/session");
      return data.user;
    },
    staleTime: 1000 * 60 * 5,
  });

  const firstName = userData?.name?.split(" ")[0] || "there";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good Morning" : hour < 18 ? "Good Afternoon" : "Good Evening";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-8"
    >
      {/* --- HEADER SECTION --- */}
      <section className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <motion.div variants={itemVariants}>
            <Badge variant="outline" className="mb-2 px-2 py-0 border-primary/20 bg-primary/5 text-primary">
              <Sparkles className="mr-1 h-3 w-3" /> Dashboard Overview
            </Badge>
          </motion.div>
          <motion.h1 
            variants={itemVariants} 
            className="text-4xl font-bold tracking-tight text-foreground"
          >
            {greeting}, <span className="text-primary">{firstName}</span>
          </motion.h1>
          <motion.p variants={itemVariants} className="mt-2 text-lg text-muted-foreground">
            Here&apos;s a quick look at what&apos;s happening across your Brainy account.
          </motion.p>
        </div>

        <motion.div variants={itemVariants} className="flex gap-2">
          <Button variant="outline" className="hidden sm:flex">
            Download Report
          </Button>
          <Button>
            <Plus className="mr-2 h-4 w-4" /> New Quiz
          </Button>
        </motion.div>
      </section>

      {/* --- QUICK STATS --- */}
      <motion.div 
        variants={itemVariants} 
        className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
      >
        {STATS.map((stat) => (
          <Card key={stat.label} className="overflow-hidden border-border/50 bg-card/50 backdrop-blur-sm transition-all hover:border-primary/20 hover:shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
                  <h3 className="mt-2 text-3xl font-bold text-foreground">{stat.value}</h3>
                </div>
                <div className={`rounded-xl p-3 ${stat.bg} ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </motion.div>

      {/* --- ROLE BASED ACTION CARDS --- */}
      <section className="space-y-4">
        <motion.h2 variants={itemVariants} className="text-xl font-semibold text-foreground flex items-center gap-2">
          <Zap className="h-5 w-5 text-primary" /> Your Entry Points
        </motion.h2>
        
        <div className="grid gap-6 md:grid-cols-2">
          {/* Student Profile Card */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/student">
              <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
                <div className="absolute -right-4 -top-4 text-primary/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/10">
                  <GraduationCap className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <Badge className="bg-primary/10 text-primary">Student Account</Badge>
                  <h3 className="mt-4 text-2xl font-bold">Academic Portal</h3>
                  <p className="mt-2 text-muted-foreground">Access your verified courses, attempt quizzes, and track your learning progress.</p>
                  <div className="mt-6 flex items-center font-semibold text-primary">
                    Launch Student Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>

          {/* Institution Admin Card */}
          <motion.div variants={itemVariants}>
            <Link href="/dashboard/institution">
              <div className="group relative overflow-hidden rounded-2xl border bg-card p-6 transition-all hover:border-primary/50 hover:shadow-xl">
                <div className="absolute -right-4 -top-4 text-primary/5 transition-transform duration-500 group-hover:scale-110 group-hover:text-primary/10">
                  <Building2 className="h-32 w-32" />
                </div>
                <div className="relative z-10">
                  <Badge className="bg-secondary/10 text-secondary-foreground">Institution Management</Badge>
                  <h3 className="mt-4 text-2xl font-bold">Institution Command</h3>
                  <p className="mt-2 text-muted-foreground">Manage tutors, verify student enrollments, and oversee institutional assessment data.</p>
                  <div className="mt-6 flex items-center font-semibold text-primary">
                    Launch Admin Dashboard <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* --- RECENT ACTIVITY --- */}
      <motion.section variants={itemVariants} className="rounded-2xl border bg-card/30 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" /> Recent Activity
          </h2>
          <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
            View All <ChevronRight className="ml-1 h-4 w-4" />
          </Button>
        </div>

        <div className="mt-6 space-y-4">
          {[
            { tag: "Quiz", title: "Introduction to Computer Science", time: "2 hours ago", status: "Completed", score: "92/100" },
            { tag: "System", title: "Institutional Email Verified", time: "5 hours ago", status: "Success", score: null },
            { tag: "Admin", title: "New Tutor Invitation Sent", time: "1 day ago", status: "Pending", score: null },
          ].map((activity, i) => (
            <div key={i} className="flex items-center justify-between rounded-lg border border-border/50 bg-background/50 p-4 transition-colors hover:bg-accent/50">
              <div className="flex items-center gap-4">
                <div className={`h-2 w-2 rounded-full ${activity.tag === 'Quiz' ? 'bg-green-500' : activity.tag === 'System' ? 'bg-blue-500' : 'bg-amber-500'}`} />
                <div>
                  <p className="font-medium">{activity.title}</p>
                  <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                    <Badge variant="outline" className="text-[10px] h-4 px-1">{activity.tag}</Badge>
                    <span>{activity.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                {activity.score ? (
                  <p className="text-sm font-bold text-foreground">{activity.score}</p>
                ) : (
                  <p className="text-sm text-muted-foreground">{activity.status}</p>
                )}
              </div>
            </div>
          ))}
        </div>
      </motion.section>
    </motion.div>
  );
}

function Sparkles({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
      <path d="M5 3v4" />
      <path d="M19 17v4" />
      <path d="M3 5h4" />
      <path d="M17 19h4" />
    </svg>
  );
}

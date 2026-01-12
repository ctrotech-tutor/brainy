// app/(app)/dashboard/student/page.tsx
"use client";

import { motion } from "framer-motion";
import { Award, BookCheck, TrendingUp } from "lucide-react";

// A reusable widget component for the dashboard
const DashboardWidget = ({
  icon: Icon,
  title,
  children,
}: {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}) => (
  <div className="rounded-xl border bg-card p-6">
    <div className="flex items-center gap-3">
      <Icon className="h-6 w-6 text-primary" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
    </div>
    <div className="mt-4">{children}</div>
  </div>
);

export default function StudentDashboardPage() {
  // In a real app, user data would be fetched here
  const user = { name: "Jane Doe" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Welcome back, {user.name}!
      </h1>
      <p className="mt-2 text-muted-foreground">
        Here's your progress. Keep up the great work!
      </p>

      {/* Dashboard Widgets Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* Overall Progress Widget */}
        <DashboardWidget icon={TrendingUp} title="Overall Progress">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">82%</span>
            <span className="text-sm font-medium text-green-500">+5% this week</span>
          </div>
          <div className="mt-3 h-2 w-full rounded-full bg-muted">
            <div className="h-2 w-[82%] rounded-full bg-primary" />
          </div>
        </DashboardWidget>

        {/* Recent Activity Widget */}
        <DashboardWidget icon={BookCheck} title="Recent Activity">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>CSC 101 - Final Quiz</span>
              <span className="font-medium text-foreground">100%</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>PHY 203 - Midterm</span>
              <span className="font-medium">75%</span>
            </div>
          </div>
        </DashboardWidget>

        {/* Leaderboard Widget */}
        <DashboardWidget icon={Award} title="Leaderboard">
          <div className="space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold">1.</span>
                <span>You</span>
              </div>
              <span className="font-bold text-primary">1,250 pts</span>
            </div>
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <span>2.</span>
                <span>John Smith</span>
              </div>
              <span>1,180 pts</span>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </motion.div>
  );
}

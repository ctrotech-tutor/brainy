// app/(app)/dashboard/DashboardClient.tsx
"use client";

import { motion } from "framer-motion";

export default function DashboardClient() {
  // In a real app, this page would fetch and display user-specific data,
  // such as recent quiz scores, upcoming deadlines, or admin stats.

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to your Brainy dashboard. Here&apos;s an overview of your activity.
      </p>

      {/* Placeholder for dashboard widgets */}
      <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="flex h-40 items-center justify-center rounded-xl border bg-card">
          <p className="text-muted-foreground">Widget 1</p>
        </div>
        <div className="flex h-40 items-center justify-center rounded-xl border bg-card">
          <p className="text-muted-foreground">Widget 2</p>
        </div>
        <div className="flex h-40 items-center justify-center rounded-xl border bg-card">
          <p className="text-muted-foreground">Widget 3</p>
        </div>
      </div>
    </motion.div>
  );
}

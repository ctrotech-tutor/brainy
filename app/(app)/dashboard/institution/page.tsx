// app/(app)/dashboard/institution/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserPlus,
  BarChart3,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";

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

export default function InstitutionDashboardPage() {
  // In a real app, institution data would be fetched here
  const institution = { name: "University of Example" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        {institution.name}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Welcome to your institution's management dashboard.
      </p>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <Button>
          <UserPlus className="mr-2 h-4 w-4" />
          Invite Tutor
        </Button>
        <Button variant="outline">Manage Faculties</Button>
      </div>

      {/* Dashboard Widgets Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* User Stats Widget */}
        <DashboardWidget icon={Users} title="Active Users">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-4xl font-bold">1,245</p>
              <p className="text-sm text-muted-foreground">Students</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold">87</p>
              <p className="text-sm text-muted-foreground">Tutors</p>
            </div>
          </div>
        </DashboardWidget>

        {/* Performance Widget */}
        <DashboardWidget icon={BarChart3} title="Overall Performance">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Average Score</span>
              <span className="font-medium text-foreground">81%</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Quizzes Completed</span>
              <span className="font-medium">10,500</span>
            </div>
          </div>
        </DashboardWidget>

        {/* Verification Status Widget */}
        <DashboardWidget icon={ShieldCheck} title="Verification Status">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Institution</span>
              <span className="font-medium text-green-500">Verified</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Pending Invites</span>
              <span className="font-medium">3</span>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </motion.div>
  );
}

// app/(app)/dashboard/tutor/page.tsx
"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  PlusCircle,
  FileText,
  BarChartHorizontal,
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

export default function TutorDashboardPage() {
  // In a real app, tutor data would be fetched here
  const tutor = { name: "Dr. Alex Smith" };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <h1 className="text-3xl font-bold tracking-tight text-foreground">
        Tutor Dashboard
      </h1>
      <p className="mt-2 text-muted-foreground">
        Welcome back, {tutor.name}. Manage your quizzes and students here.
      </p>

      {/* Quick Actions */}
      <div className="mt-6 flex gap-4">
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          Create New Quiz
        </Button>
        <Button variant="outline">View My Courses</Button>
      </div>

      {/* Dashboard Widgets Grid */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {/* My Quizzes Widget */}
        <DashboardWidget icon={FileText} title="My Quizzes">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>CSC 101 - Final</span>
              <span className="font-medium text-foreground">30 Questions</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>PHY 203 - Midterm</span>
              <span className="font-medium">50 Questions</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>MTH 310 - Practice Test</span>
              <span className="font-medium">25 Questions</span>
            </div>
          </div>
        </DashboardWidget>

        {/* Student Performance Widget */}
        <DashboardWidget icon={BarChartHorizontal} title="Student Performance">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>CSC 101 Average</span>
              <span className="font-medium text-foreground">85%</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>PHY 203 Average</span>
              <span className="font-medium">72%</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Lowest Score (PHY 203)</span>
              <span className="font-medium text-red-500">45%</span>
            </div>
          </div>
        </DashboardWidget>

        {/* Tutor Info Widget */}
        <DashboardWidget icon={Briefcase} title="My Status">
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Institution</span>
              <span className="font-medium text-foreground">University of Example</span>
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Assigned Courses</span>
              <span className="font-medium">4</span>
            </div>
          </div>
        </DashboardWidget>
      </div>
    </motion.div>
  );
}

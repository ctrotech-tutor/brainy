"use client";

import { motion } from "framer-motion";
import { BookCheck, ChevronRight, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

// Data for recent activities
const recentActivities = [
  {
    icon: BookCheck,
    title: "CSC 101: Final Quiz",
    time: "Completed 2h ago",
    progress: 100,
  },
];

const DashboardPreviewCard = () => {
  return (
    <motion.div
      className="w-full max-w-md transition-transform duration-300 ease-out hover:scale-105"
      style={{ perspective: "1000px" }}
    >
      <Card
        className={cn(
          "w-full overflow-hidden rounded-2xl border shadow-2xl p-0",
          // Consistent Glassmorphism effect
          "border-white/20 bg-card/60 backdrop-blur-xl"
        )}
      >
        {/* --- Card Header --- */}
        <CardHeader className="flex flex-row items-start justify-between p-6">
          <div className="space-y-1">
            <h3 className="text-sm md:text-lg font-bold text-card-foreground">
              Your Dashboard
            </h3>
          </div>
          <Badge
            variant="outline"
            className="border-success/30 bg-success/10 text-success"
          >
            Active
          </Badge>
        </CardHeader>

        <CardContent className="p-6 pt-0">
          {/* --- Key Stat --- */}
          <div className="rounded-lg border bg-background/50 px-4 py-2">
            <p className="text-sm font-medium text-muted-foreground">
              Overall Progress
            </p>
            <div className="mt-2 flex items-end gap-2">
              <p className="text-lg md:text-xl font-bold text-foreground">82%</p>
              <div className="flex items-center text-sm font-medium text-success">
                <TrendingUp className="mr-1 h-4 w-4" />
                <span>+5% this week</span>
              </div>
            </div>
          </div>

          {/* --- Recent Activity List --- */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-card-foreground">
                Recent Activity
              </h4>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>

            <div className="mt-4 space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.title}
                  className="flex items-center gap-4 rounded-lg border bg-background/30 p-3"
                >
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-md bg-secondary">
                    <activity.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div className="flex-grow">
                    <p className="font-medium text-foreground">
                      {activity.title}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.time}
                    </p>
                  </div>
                  <div className="w-1/4 text-right">
                    <p className="text-sm font-semibold text-foreground">
                      {activity.progress}%
                    </p>
                    <Progress value={activity.progress} className="mt-1 h-1.5" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default DashboardPreviewCard;

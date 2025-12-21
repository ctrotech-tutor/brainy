"use client";

import { motion } from "framer-motion";
import { ArrowRight, Users } from "lucide-react";
import { cn } from "@/lib/utils";

// Shadcn UI Components
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

const TutorDashboardPreviewCard = () => {
  return (
    <motion.div
      className="w-full max-w-md transition-transform duration-300 ease-out hover:scale-105 select-none"
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
        <CardHeader className="px-6 pt-4">
          <h3 className="text-sm md:text-lg font-bold text-card-foreground">
            Class Overview
          </h3>
        </CardHeader>

        <CardContent className="space-y-4 pt-0">
          {/* --- Mini Stat --- */}
          <div className="flex items-center gap-4 rounded-lg border bg-background/50 px-4 py-2">
            <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-md bg-secondary">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">42 / 50</p>
              <p className="text-sm text-muted-foreground">Active Students</p>
            </div>
          </div>

          {/* --- Progress Indicators --- */}
          <div className="space-y-4">
            {/* Class Average */}
            <div>
              <div className="flex justify-between text-sm">
                <p className="font-medium text-muted-foreground">Class Average</p>
                <p className="font-semibold text-foreground">78%</p>
              </div>
              <Progress value={78} className="mt-1 h-2" />
            </div>
            {/* Completion Rate */}
            <div>
              <div className="flex justify-between text-sm">
                <p className="font-medium text-muted-foreground">Completion Rate</p>
                <p className="font-semibold text-foreground">92%</p>
              </div>
              <Progress value={92} className="mt-1 h-2" variant="success" />
            </div>
          </div>
        </CardContent>

        {/* --- Card Footer --- */}
        <CardFooter className="border-t bg-background/30 pb-4">
          <a
            href="#"
            className="flex w-full items-center justify-center text-sm font-semibold text-primary transition-colors hover:text-primary/80"
          >
            View Full Report
            <ArrowRight className="ml-2 h-4 w-4" />
          </a>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default TutorDashboardPreviewCard;

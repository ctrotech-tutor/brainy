"use client";

import { motion } from "framer-motion";
import { BookOpen, Clock, BarChart2 } from "lucide-react";
import { cn } from "@/lib/utils"; // Make sure you have this utility

// Shadcn UI Components
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";

const QuizPreviewCard = () => {
  // Animation for the floating analytics box
  const analyticsVariants = {
    hidden: { scale: 0.8, opacity: 0, y: 20 },
    visible: {
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        delay: 0.8, // Slightly faster delay for a snappier feel
        duration: 0.5,
        ease: "easeOut",
      },
    },
  };

  return (
    // Use a container to control the relative positioning and responsiveness
    <div className="relative w-full max-w-md select-none">
      {/* Main Quiz Card with Glassmorphism */}
      <Card
        className={cn(
          "w-full overflow-hidden rounded-2xl border-0 py-0",
          // Glassmorphism effect: semi-transparent background with a backdrop blur
          "border-white/20 bg-card/60 shadow-2xl backdrop-blur-xl"
        )}
      >
        <CardContent className="p-6">
          {/* --- Card Header --- */}
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                <BookOpen className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-sm md:text-lg text-card-foreground">CSC 101 QUIZ</h3>
                <p className="text-xs md:text-sm text-muted-foreground">
                  Introduction to Computing
                </p>
              </div>
            </div>
            {/* Using success color from our theme */}
            <Badge
              variant="outline"
              className="border-success/30 bg-success/10 text-success"
            >
              Active
            </Badge>
          </div>

          {/* --- Question UI --- */}
          <div className="mt-6">
            <p className="text-xs md:text-sm font-medium text-muted-foreground">
              Question 3 of 10
            </p>
            <p className="mt-1.5 text-base font-semibold text-card-foreground">
              What is the primary function of an operating system?
            </p>
            <RadioGroup defaultValue="option-one" className="mt-4 space-y-3">
              {/* Radio Option 1 */}
              <Label
                htmlFor="option-one"
                className="flex items-center space-x-3 rounded-lg border p-4 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 hover:bg-accent/50 cursor-pointer"
              >
                <RadioGroupItem value="option-one" id="option-one" />
                <span className="flex-1">
                  To manage hardware and software resources
                </span>
              </Label>
              {/* Radio Option 2 */}
              <Label
                htmlFor="option-two"
                className="flex items-center space-x-3 rounded-lg border p-4 transition-all has-[:checked]:border-primary has-[:checked]:bg-primary/10 hover:bg-accent/50 cursor-pointer"
              >
                <RadioGroupItem value="option-two" id="option-two" />
                <span className="flex-1">
                  To provide a web browsing interface
                </span>
              </Label>
            </RadioGroup>
          </div>

          {/* --- Card Footer --- */}
          <div className="mt-8 flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>12:45 remaining</span>
            </div>
            <div className="w-1/3">
              <Progress value={30} className="h-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Floating Analytics Box with Glassmorphism */}
      <motion.div
        variants={analyticsVariants}
        initial="hidden"
        animate="visible"
        // Responsive positioning: moves from bottom-right to top-right on small screens
        className="absolute -bottom-6 -right-6 sm:bottom-auto sm:top-0 sm:-right-8"
      >
        <Card
          className={cn(
            "flex items-center gap-3 p-3 rounded-xl border shadow-lg flex-row ",
            // Matching glassmorphism effect
            "border-white/20 bg-card/60 backdrop-blur-xl"
          )}
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-md bg-accent">
            <BarChart2 className="h-5 w-5 text-accent-foreground" />
          </div>
          <div>
            <p className="text-xl font-bold text-card-foreground">87%</p>
            <p className="text-xs text-muted-foreground">Avg. Score</p>
          </div>
        </Card>
      </motion.div>
    </div>
  );
};

export default QuizPreviewCard;

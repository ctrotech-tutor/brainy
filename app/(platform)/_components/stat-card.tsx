"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

export const StatCard = ({
  title,
  value,
  icon,
  description,
  link,
}: {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  description: string;
  link?: string;
}) => (
  <motion.div
    whileHover={{ y: -4 }}
    className="group relative h-full"
  >
    <div className="absolute inset-0 bg-accent/20 blur-xl group-hover:bg-primary/5 transition-colors rounded-[2rem]" />
    <Card className="relative h-full rounded-[2rem] border-border bg-card/50 backdrop-blur-xl shadow-2xl transition-all group-hover:border-primary/20">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/60 transition-colors group-hover:text-primary">
          {icon}
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

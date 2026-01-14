"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
  GraduationCap,
  UserCircle2,
  Building2,
  ArrowRight,
  Sparkles,
  Target,
  Users,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const audienceRoles = [
  {
    icon: GraduationCap,
    role: "For Students",
    title: "Master Your Courses.",
    description: "Take secure assessments, track your institutional performance, and access verified academic transcripts effortlessly.",
    color: "hsl(var(--primary))",
    bg: "primary",
    benefits: ["Secure Quiz Access", "Performance Insights", "Verified Results"],
    link: "/onboarding/student/start"
  },
  {
    icon: UserCircle2,
    role: "For Tutors",
    title: "Elevate Your Teaching.",
    description: "Create AI-assisted quizzes, manage specialized departments, and monitor student progress with deep granular analytics.",
    color: "hsl(var(--primary))",
    bg: "primary",
    benefits: ["AI Quiz Generator", "Department Management", "Success Metrics"],
    link: "/get-started"
  },
  {
    icon: Building2,
    role: "For Institutions",
    title: "Institutional OS.",
    description: "The complete infrastructure for universities to manage faculties, handle role-based oversight, and enforce academic integrity.",
    color: "hsl(var(--primary))",
    bg: "primary",
    benefits: ["Faculty Governance", "System-wide Audits", "Data Security"],
    link: "/onboarding/institution/start"
  }
];

const AudienceSection = () => {
  return (
    <section id="audience" className="relative bg-background py-24 sm:py-32 overflow-hidden" aria-labelledby="audience-heading">
      {/* Background Decor */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/2%)_1px,transparent_1px)] [background-size:48px_48px] opacity-40" />
      <div className="absolute bottom-0 left-1/4 -z-10 h-[600px] w-full bg-primary/5 blur-[120px] rounded-full" />

      <Wrapper>
        <div className="mx-auto max-w-4xl text-center mb-20 px-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-white/5 text-xs font-black tracking-widest uppercase text-muted-foreground mb-8">
              <Users className="h-4 w-4 text-primary" />
              Who Brainy is For
            </div>
            <h2 id="audience-heading" className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8 leading-[0.9]">
              Engineered for Every <span className="text-primary prose-italics">Stakeholder.</span>
            </h2>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Our platform bridges the gap between students, educators, and
              administrators with tailored toolsets for every academic role.
            </p>
          </motion.div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {audienceRoles.map((item, idx) => (
            <motion.div
              key={item.role}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              className="group relative flex flex-col p-10 md:p-12 rounded-[3.5rem] bg-card/40 border border-white/5 backdrop-blur-3xl transition-all duration-500 hover:bg-card/60 hover:border-primary/20 hover:-translate-y-2 overflow-hidden"
            >
              {/* Highlight Background */}
              <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-opacity">
                <item.icon className="h-40 w-40 text-primary" />
              </div>

              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-center gap-3 mb-8">
                  <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-xl shadow-primary/5">
                    <item.icon className="h-7 w-7" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-widest text-primary">{item.role}</span>
                </div>

                <h3 className="text-2xl font-black tracking-tight text-foreground mb-4 group-hover:text-primary transition-colors">
                  {item.title}
                </h3>
                <p className="text-muted-foreground leading-relaxed mb-8 flex-1">
                  {item.description}
                </p>

                <div className="space-y-4 mb-10">
                  {item.benefits.map((benefit) => (
                    <div key={benefit} className="flex items-center gap-3">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span className="text-sm font-bold text-foreground/70">{benefit}</span>
                    </div>
                  ))}
                </div>

                <Link
                  href={item.link}
                  className="inline-flex items-center gap-3 rounded-2xl bg-secondary/50 px-8 py-5 text-sm font-black uppercase tracking-widest text-foreground transition-all hover:bg-primary hover:text-primary-foreground hover:gap-5 shadow-inner"
                >
                  Join as {item.role.split(" ")[1]}
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Global Stats/Trust Overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 flex flex-wrap justify-center gap-8 text-center"
        >
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-white/5">
            <ShieldCheck className="h-5 w-5 text-emerald-500" />
            <span className="text-sm font-bold text-muted-foreground">Certified Security</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-white/5">
            <Target className="h-5 w-5 text-primary" />
            <span className="text-sm font-bold text-muted-foreground">99.9% Result Precision</span>
          </div>
          <div className="flex items-center gap-3 px-6 py-3 rounded-2xl bg-card border border-white/5">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <span className="text-sm font-bold text-muted-foreground">AI Integration Enabled</span>
          </div>
        </motion.div>
      </Wrapper>
    </section>
  );
};

export default AudienceSection;

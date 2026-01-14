"use client";

import { Wrapper } from "@/components/ui/wrapper";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  Target,
  Users,
  Zap,
  Globe,
  Cpu,
  GraduationCap,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

const values = [
  {
    icon: ShieldCheck,
    title: "Uncompromised Integrity",
    text: "We believe academic achievements should be verified and untamperable."
  },
  {
    icon: Target,
    title: "Precision Analytics",
    text: "Data-driven insights that empower tutors to understand student progress deeply."
  },
  {
    icon: Users,
    title: "Institutional Scaling",
    text: "Built to handle thousands of users seamlessly across multiple departments."
  },
  {
    icon: Cpu,
    title: "AI-First Approach",
    text: "Leveraging cutting-edge AI to assist educators, not replace them."
  }
];

export default function AboutPage() {
  return (
    <>

      <Wrapper className="py-24 sm:py-32">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-24 md:mb-32">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-card border border-white/5 text-sm font-bold tracking-widest uppercase text-muted-foreground mb-8">
              <Sparkles className="h-4 w-4 text-primary" />
              Our Mission
            </div>
            <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tighter text-foreground mb-10 leading-[0.9]">
              Redefining the DNA of <span className="text-primary prose-italics">Academic Trust.</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed">
              Brainy was born from a simple realization: the digital transition of education
              failed to protect the most important asset—the value of a grade.
              We are building the infrastructure that makes degrees meaningful again.
            </p>
          </motion.div>
        </div>

        {/* Vision & Story Section */}
        <div className="grid lg:grid-cols-2 gap-20 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="relative aspect-square rounded-[3rem] overflow-hidden group"
          >
            <div className="absolute inset-0 bg-primary/20 mix-blend-overlay z-10" />
            <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-20" />
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&q=80&w=2070"
              alt="Team collaboration"
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-110"
            />
            <div className="absolute bottom-12 left-12 z-30">
              <div className="text-4xl font-black text-white tracking-tighter">EST. 2024</div>
              <div className="text-white/60 font-bold uppercase tracking-widest text-sm">Founded by Ctrotech</div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-widest text-sm">
              <Target className="h-5 w-5" />
              The Vision
            </div>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground">
              A Platform that Empowers, Not Just Assesses.
            </h2>
            <div className="prose prose-lg prose-invert text-muted-foreground">
              <p>
                At Brainy, we don't just provide quiz software. We provide a comprehensive
                OS for educational institutions. Our ecosystem bridges the gap between
                students, tutors, and administrators using verifiable security and AI-driven insights.
              </p>
              <p>
                From the way we handle result encryption to the granular role management of
                entire faculties, every line of code is written with the intent to
                eliminate academic malpractice and streamline educational bureaucracy.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Core Values Grid */}
        <div className="mb-32">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-foreground mb-4">
              Our Core <span className="text-primary">Values.</span>
            </h2>
            <p className="text-muted-foreground text-lg">The principles that guide our architecture and decisions.</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, idx) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="p-8 rounded-[2.5rem] bg-card/40 border border-white/5 backdrop-blur-md transition-all hover:bg-card/60 hover:-translate-y-2 group"
              >
                <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 transition-transform group-hover:rotate-12">
                  <value.icon className="h-8 w-8" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-3">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{value.text}</p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Stats Section / Milestone */}
        <div className="relative overflow-hidden rounded-[4rem] bg-card/30 border border-white/5 p-12 md:p-24 backdrop-blur-xl mb-32">
          <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
            <Globe className="h-64 w-64 text-primary" />
          </div>

          <div className="grid md:grid-cols-3 gap-16 text-center">
            <div>
              <div className="text-6xl font-black text-primary tracking-tighter mb-2">99.9%</div>
              <div className="text-muted-foreground font-bold uppercase tracking-widest text-sm">System Uptime</div>
            </div>
            <div>
              <div className="text-6xl font-black text-primary tracking-tighter mb-2">10ms</div>
              <div className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Response Latency</div>
            </div>
            <div>
              <div className="text-6xl font-black text-primary tracking-tighter mb-2">100%</div>
              <div className="text-muted-foreground font-bold uppercase tracking-widest text-sm">Data Encryption</div>
            </div>
          </div>
        </div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <h2 className="text-4xl md:text-6xl font-black tracking-tighter text-foreground mb-8">
            Ready to experience the <span className="prose-italics">standard?</span>
          </h2>
          <div className="flex flex-wrap justify-center gap-4">
            <Button size="lg" asChild className="h-16 px-10 rounded-2xl text-lg font-bold shadow-xl shadow-primary/20">
              <Link href="/get-started">Get Started Now</Link>
            </Button>
            <Button size="lg" variant="outline" asChild className="h-16 px-10 rounded-2xl text-lg font-bold border-white/10 hover:bg-white/5">
              <Link href="/contact">Contact Sales</Link>
            </Button>
          </div>
        </motion.div>
      </Wrapper>
    </>
  );
}

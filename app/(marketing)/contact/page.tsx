"use client";

import { useState } from "react";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { motion } from "framer-motion";
import {
  Mail,
  MapPin,
  MessageSquare,
  Send,
  Twitter,
  Github,
  Linkedin,
  Clock,
  Globe
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const contactMethods = [
  {
    icon: Mail,
    title: "Email Us",
    description: "Our team is here to help.",
    value: "hello@brainy.os",
    href: "mailto:hello@brainy.os",
  },
  {
    icon: MapPin,
    title: "Office",
    description: "Visit our innovation hub.",
    value: "Ctrotech Insights, Lagos, Nigeria",
    href: "#",
  },
  {
    icon: Clock,
    title: "Support Hours",
    description: "We are active daily.",
    value: "Mon - Fri, 9am - 6pm WAT",
    href: "#",
  },
];

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formStatus, setFormStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setFormStatus("idle");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.ok) {
        setFormStatus("success");
        (e.target as HTMLFormElement).reset();
      } else {
        setFormStatus("error");
      }
    } catch (err) {
      setFormStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>

      <Wrapper className="py-24 sm:py-32">
        <div className="grid lg:grid-cols-2 gap-16 items-start">
          {/* Left Column: Info & Story */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold uppercase tracking-widest mb-6">
              <Globe className="h-3 w-3" />
              Get in Touch
            </div>
            <h1 className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground mb-8">
              Let's build the future of <span className="text-primary prose-italics">A-Integrity.</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed mb-12 max-w-xl">
              Whether you're an institution looking to scale or a student with a question,
              our team is ready to provide the insights you need.
            </p>

            <div className="grid gap-6">
              {contactMethods.map((method, idx) => (
                <Link
                  key={method.title}
                  href={method.href}
                  className="group flex items-start gap-4 p-6 rounded-3xl bg-card/40 border border-white/5 backdrop-blur-md transition-all hover:bg-card/60 hover:border-primary/20"
                >
                  <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary transition-transform duration-300 group-hover:scale-110">
                    <method.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-bold text-foreground mb-1">{method.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">{method.description}</p>
                    <span className="text-foreground font-medium group-hover:text-primary transition-colors">
                      {method.value}
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {/* Socials */}
            <div className="mt-12 flex items-center gap-6">
              <span className="text-sm font-bold uppercase tracking-widest text-muted-foreground/60">Connect</span>
              <div className="flex gap-4">
                {[Twitter, Github, Linkedin].map((Icon, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="h-10 w-10 rounded-xl bg-card border border-white/5 flex items-center justify-center text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary hover:border-primary/20"
                  >
                    <Icon className="h-5 w-5" />
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Contact Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 -z-10 bg-primary/5 blur-3xl opacity-50" />
            <div className="rounded-[2.5rem] bg-card/30 border border-white/10 p-8 md:p-12 backdrop-blur-2xl shadow-2xl">
              <h2 className="text-2xl font-black tracking-tight text-foreground mb-8">
                Send us a Message
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground/80 px-1">Full Name</label>
                    <Input
                      required
                      name="name"
                      placeholder="John Doe"
                      className="h-14 rounded-2xl bg-background/50 border-white/10 px-6 focus-visible:ring-primary/20"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-bold text-muted-foreground/80 px-1">Email Address</label>
                    <Input
                      required
                      name="email"
                      type="email"
                      placeholder="john@example.com"
                      className="h-14 rounded-2xl bg-background/50 border-white/10 px-6 focus-visible:ring-primary/20"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground/80 px-1">Company / Institution</label>
                  <Input
                    name="company"
                    placeholder="University of Excellence"
                    className="h-14 rounded-2xl bg-background/50 border-white/10 px-6 focus-visible:ring-primary/20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-bold text-muted-foreground/80 px-1">How can we help?</label>
                  <Textarea
                    required
                    name="message"
                    placeholder="Tell us about your project or inquiry..."
                    className="min-h-[160px] rounded-3xl bg-background/50 border-white/10 p-6 focus-visible:ring-primary/20 resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full h-16 rounded-2xl text-lg font-bold transition-all shadow-xl shadow-primary/20 group overflow-hidden relative"
                >
                  <span className={cn(
                    "flex items-center gap-2 transition-transform duration-300",
                    isSubmitting ? "-translate-y-20" : "group-hover:translate-x-1"
                  )}>
                    {isSubmitting ? "Sending..." : "Send Message"}
                    {!isSubmitting && <Send className="h-5 w-5" />}
                  </span>

                  {isSubmitting && (
                    <div className="absolute inset-0 flex items-center justify-center animate-in slide-in-from-bottom-2">
                      <div className="h-6 w-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    </div>
                  )}
                </Button>

                {formStatus === "success" && (
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center text-emerald-500 font-bold bg-emerald-500/10 py-3 rounded-xl border border-emerald-500/20"
                  >
                    Thank you! Message sent successfully.
                  </motion.p>
                )}

                {formStatus === "error" && (
                  <p className="text-center text-red-500 font-bold bg-red-500/10 py-3 rounded-xl border border-red-500/20">
                    Oops! Something went wrong. Please try again.
                  </p>
                )}
              </form>
            </div>

            <div className="mt-8 p-6 rounded-3xl bg-secondary/50 border border-white/5 flex items-center gap-4">
              <div className="h-10 w-10 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500">
                <MessageSquare className="h-5 w-5" />
              </div>
              <p className="text-sm text-muted-foreground">
                <strong className="text-foreground">Support Response:</strong> Usually within 2-4 hours.
              </p>
            </div>
          </motion.div>
        </div>
      </Wrapper>
    </>
  );
}

"use client";

import Link from "next/link";
import { Brain, Twitter, Linkedin, Github, Loader2 } from "lucide-react";
import { Wrapper } from "@/components/ui/wrapper";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const subscribeToNewsletter = async (email: string): Promise<{ message: string }> => {
  const { data } = await axios.post("/api/newsletter/subscribe", { email });
  return data;
};

// Updated and reorganized footer links for a cleaner structure
const footerLinks = {
  // platform: [
  //   { title: "Features", href: "/#features" },
  //   { title: "Institution System", href: "/#institution" },
  //   { title: "Security Ecosystem", href: "/#security" },
  //   { title: "Why Brainy", href: "/#why-brainy" },
  // ],
  roles: [
    { title: "For Students", href: "/onboarding/student/start" },
    { title: "For Tutors", href: "/auth/login?role=tutor" },
    { title: "For Admins", href: "/onboarding/institution/start" },
  ],
  resources: [
    { title: "Documentation", href: "/docs" },
    { title: "Help Center", href: "/help" },
    { title: "Development Blog", href: "/blog" },
  ],
  legal: [
    // { title: "Terms of Service", href: "/terms" },
    // { title: "Privacy Policy", href: "/privacy" },
    { title: "Acceptable Use", href: "/acceptable-use" },
    { title: "Academic Integrity", href: "/academic-integrity" },
    { title: "Institution Agreement", href: "/institution-agreement" },
    { title: "Tutor Agreement", href: "/tutor-agreement" },
    { title: "Cookie Policy", href: "/cookies" },
  ],
  company: [
    { title: "About Us", href: "/about" },
    { title: "Contact", href: "/contact" },
  ],
};

const socialLinks = [
  { icon: Twitter, href: "#", label: "Twitter" },
  { icon: Github, href: "#", label: "GitHub" },
  { icon: Linkedin, href: "#", label: "LinkedIn" },
];

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState("");
  const queryClient = useQueryClient(); // Get the query client instance

  // --- 1. SET UP THE MUTATION WITH TANSTACK QUERY v5 ---
  const { mutate, isPending, isSuccess } = useMutation({
    mutationFn: subscribeToNewsletter,
    onSuccess: (data) => {
      // On success, show a success toast and clear the input.
      toast.success(data.message || "Thanks for subscribing!");
      setEmail("");
      // You could optionally invalidate queries here if needed, e.g.,
      // queryClient.invalidateQueries({ queryKey: ['subscribers'] });
    },
    onError: (error: AxiosError<{ error: string }>) => {
      // On error, show an error toast with the message from the API.
      const errorMessage = error.response?.data?.error || "An error occurred. Please try again.";
      toast.error(errorMessage);
    },
  });

  // --- 2. CREATE THE SUBMISSION HANDLER ---
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter an email address.");
      return;
    }
    // Call the `mutate` function with the email address.
    // TanStack Query handles the rest (loading, success, error).
    mutate(email);
  };


  return (
    <footer className="relative bg-background overflow-hidden border-t border-white/5 pt-24 pb-12">
      {/* Premium Background Decoration */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(hsl(var(--primary)/2%)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="absolute top-0 left-1/2 -z-10 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-primary/5 blur-[120px]" />

      <Wrapper>
        {/* Newsletter Section */}
        <div className="relative overflow-hidden rounded-[3rem] bg-card/30 border border-white/5 p-8 md:p-12 mb-20 backdrop-blur-xl">
          <div className="absolute top-0 right-0 p-8 opacity-10">
            <Brain className="h-40 w-40 text-primary rotate-12" />
          </div>

          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
            <div className="max-w-xl text-center lg:text-left">
              <h3 className="text-3xl font-black tracking-tighter text-foreground sm:text-4xl">
                Stay Ahead of the <span className="text-primary prose-italics">Curve.</span>
              </h3>
              <p className="mt-4 text-lg text-muted-foreground">
                Join our newsletter to receive the latest updates on academic
                integrity, AI assessments, and platform features.
              </p>
            </div>

            <div className="w-full max-w-md">
              <form className="flex flex-col sm:flex-row gap-3" onSubmit={handleSubmit}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="h-14 rounded-2xl bg-background/50 border-white/10 px-6 text-lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  // Disable the input while the mutation is pending or after success.
                  disabled={isPending || isSuccess}
                  required
                />
                <Button
                  type="submit"
                  size="lg"
                  className="h-14 rounded-2xl px-8 font-bold shadow-xl shadow-primary/20"
                  // Disable the button while the mutation is pending or after success.
                  disabled={isPending || isSuccess}
                >
                  {isPending && <Loader2 className="mr-2 h-5 w-5 animate-spin" />}
                  {isSuccess ? "Subscribed!" : "Subscribe"}
                </Button>
              </form>
              <p className="mt-4 text-xs text-muted-foreground text-center lg:text-left">
                We value your privacy. Unsubscribe at any time.
              </p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-12 mb-20">
          <div className="col-span-2 lg:col-span-1 flex flex-col gap-6">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/10">
                <Image
                  src="/brainy-logo-monochrome.png"
                  alt="Brainy Logo"
                  fill
                  className="object-contain p-1.5 invert dark:invert-0"
                />
              </div>
              <span className="text-xl font-black tracking-tighter text-foreground">
                BRAINY<span className="text-primary prose-italics">.</span>
              </span>
            </Link>
            <p className="text-muted-foreground leading-relaxed">
              Redefining academic assessment through security, analytics, and uncompromised integrity.
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <Link
                  key={social.label}
                  href={social.href}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-white/5 transition-all hover:bg-primary/10 hover:border-primary/20 hover:scale-110 active:scale-95"
                >
                  <social.icon className="h-5 w-5 text-muted-foreground transition-colors group-hover:text-primary" />
                </Link>
              ))}
            </div>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category} className="flex flex-col gap-5">
              <h4 className="font-bold text-foreground uppercase tracking-widest text-sm">
                {category}
              </h4>
              <ul className="flex flex-col gap-3">
                {links.map((link) => (
                  <li key={link.title}>
                    <Link
                      href={link.href}
                      className="group flex items-center gap-2 text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.title}
                      {/* {link.status && (
                        <span className="flex h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.5)] animate-pulse" />
                      )} */}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 text-sm text-muted-foreground font-medium">
          <p>&copy; {currentYear} Brainy OS. Part of the Ctrotech Insights ecosystem.</p>
          <div className="flex items-center gap-8">
            <Link href="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link href="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link
              href="/status"
              className="group flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/5 border border-emerald-500/20 text-emerald-500 text-xs transition-all hover:bg-emerald-500/10 hover:border-emerald-500/30"
            >
              <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              All Systems Operational
            </Link>
          </div>
        </div>
      </Wrapper>
    </footer>
  );
};

export default Footer;

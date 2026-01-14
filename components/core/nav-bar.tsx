// components/core/Navbar.tsx
"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, Sparkle, ChevronDown, LayoutDashboard } from "lucide-react";
import { cn } from "@/lib/utils";
import { navLinks, type NavItem } from "@/lib/nav";
import { useScrollSpy, smoothScrollTo } from "@/hooks/use-scroll-spy";

// --- 1. IMPORT DRAWER COMPONENTS ---
import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Wrapper } from "../ui/wrapper";
import Image from "next/image";

import { UserNav } from "./user-nav";

interface NavbarProps {
  user?: {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
    onboardingIntent: string | null;
    onboardingComplete: boolean;
  } | null;
}

const Navbar = ({ user }: NavbarProps) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const allIds = navLinks.flatMap(link => [link.href, ...(link.children?.map(c => c.href) || [])]);
  const activeId = useScrollSpy(allIds);

  // Handle scroll state for dynamic styling
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smoothScrollTo(href);
    setIsDrawerOpen(false);
  };

  return (
    <header 
      className={cn(
        "fixed top-0 z-50 w-full transition-all duration-500",
        scrolled 
          ? "h-16 bg-background/80 backdrop-blur-xl shadow-lg shadow-black/5 border-b border-white/5 py-4" 
          : "h-20 bg-transparent py-6"
      )}
    >
      <Wrapper className="flex h-full items-center justify-between">
        {/* === Left Side === */}
        <div className="flex items-center gap-10">
          {/* Logo with Premium Glow */}
          <Link
            href="/"
            className="group relative flex items-center gap-2.5 focus:outline-none"
          >
            <div className="relative h-10 w-10 overflow-hidden rounded-xl bg-primary/10 transition-all duration-500 group-hover:scale-110 group-hover:rotate-3 group-hover:shadow-[0_0_20px_rgba(var(--primary-rgb),0.3)]">
              <Image
                src="/brainy-logo-monochrome.png"
                alt="Brainy Logo"
                fill
                priority
                className="object-contain p-1.5 invert dark:invert-0"
              />
            </div>
            <span className="text-xl font-black tracking-tighter text-foreground">
              BRAINY<span className="text-primary prose-italics">.</span>
            </span>
          </Link>

          {/* Desktop Nav with Spotlight Interaction */}
          <nav className="hidden items-center gap-2 md:flex">
            {navLinks.map((link) => (
              <NavItemComponent
                key={link.label}
                link={link}
                isActive={activeId === link.href || (link.children?.some(c => c.href === activeId) ?? false)}
                onLinkClick={handleLinkClick}
              />
            ))}
          </nav>
        </div>

        {/* === Right Side === */}
        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <UserNav user={user} />
            </div>
          ) : (
            <div className="hidden items-center gap-4 md:flex">
              <Link 
                href="/auth/login" 
                className="text-sm font-semibold text-muted-foreground transition-colors hover:text-foreground"
              >
                Log in
              </Link>
              <Button 
                size="sm" 
                className="rounded-full px-6 font-bold shadow-xl shadow-primary/20 transition-all hover:scale-105 hover:shadow-primary/40 active:scale-95" 
                asChild
              >
                <Link href="/get-started">
                  <Sparkle className="mr-2 h-4 w-4" />
                  Get Started
                </Link>
              </Button>
            </div>
          )}

          {/* Mobile Menu Trigger */}
          <div className="md:hidden flex items-center gap-3">
            {!user && (
              <Button size="sm" variant="outline" className="rounded-full border-primary/20 bg-primary/5 text-primary" asChild>
                <Link href="/get-started">Join</Link>
              </Button>
            )}
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" className="group rounded-full bg-accent/50 p-2">
                  <div className="flex flex-col gap-1.5">
                    <span className={cn("h-0.5 w-6 rounded-full bg-foreground transition-all duration-300", isDrawerOpen && "translate-y-2 rotate-45")} />
                    <span className={cn("h-0.5 w-6 rounded-full bg-foreground transition-all duration-300", isDrawerOpen && "opacity-0")} />
                    <span className={cn("h-0.5 w-6 rounded-full bg-foreground transition-all duration-300", isDrawerOpen && "-translate-y-2 -rotate-45")} />
                  </div>
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-background/95 backdrop-blur-2xl">
                <div className="mx-auto w-full max-w-sm px-6 pb-12 pt-10">
                  <nav className="flex flex-col gap-6 text-center">
                    {navLinks.map((link, idx) => (
                      <motion.div
                        key={link.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.1 }}
                      >
                        <Link 
                          href={link.href} 
                          onClick={(e) => handleLinkClick(e, link.href)} 
                          className="text-2xl font-black tracking-tight text-foreground transition-colors hover:text-primary active:scale-95"
                        >
                          {link.label}
                        </Link>
                      </motion.div>
                    ))}
                  </nav>
                  
                  <div className="mt-12 space-y-4 pt-8 border-t border-white/10">
                    {user ? (
                      <Button className="w-full h-14 rounded-2xl text-lg font-bold" asChild>
                        <Link href={user.onboardingComplete ? "/dashboard" : "/onboarding/choose-path"}>
                          <LayoutDashboard className="mr-2 h-5 w-5" />
                          Open Dashboard
                        </Link>
                      </Button>
                    ) : (
                      <>
                        <Button className="w-full h-14 rounded-2xl text-lg font-bold" asChild>
                          <Link href="/get-started">Get Started for Free</Link>
                        </Button>
                        <Button variant="ghost" className="w-full h-14 text-lg font-semibold" asChild>
                          <Link href="/auth/login">I already have an account</Link>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

// --- Sub-component for Desktop Navigation (No changes here) ---
const NavItemComponent = ({ link, isActive, onLinkClick }: { link: NavItem; isActive: boolean; onLinkClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void; }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      className="relative" 
      onMouseEnter={() => setIsHovered(true)} 
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link 
        href={link.href} 
        onClick={(e) => onLinkClick(e, link.href)} 
        className={cn(
          "relative flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold transition-all duration-300",
          isActive ? "text-primary" : "text-muted-foreground hover:text-foreground"
        )}
      >
        {link.label}
        {link.children && (
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isHovered && "rotate-180")} />
        )}
        
        {/* Animated background pill */}
        {isActive && (
          <motion.div
            layoutId="nav-pill"
            className="absolute inset-0 -z-10 rounded-full bg-primary/10 border border-primary/20"
            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
          />
        )}
      </Link>

      {link.children && (
        <AnimatePresence>
          {isHovered && (
            <motion.div 
              initial={{ opacity: 0, y: 10, scale: 0.95 }} 
              animate={{ opacity: 1, y: 0, scale: 1 }} 
              exit={{ opacity: 0, y: 10, scale: 0.95 }} 
              transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }} 
              className="absolute top-full left-0 mt-3 w-56 overflow-hidden rounded-2xl border border-white/10 bg-card/60 p-2 shadow-2xl backdrop-blur-2xl"
            >
              <div className="absolute inset-0 -z-10 bg-linear-to-b from-white/5 to-transparent" />
              {link.children.map(child => (
                <Link 
                  key={child.label} 
                  href={child.href} 
                  onClick={(e) => onLinkClick(e, child.href)} 
                  className="flex items-center rounded-xl px-4 py-2.5 text-sm font-medium text-muted-foreground transition-all hover:bg-primary/10 hover:text-primary active:scale-95"
                >
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default Navbar;
// components/core/Navbar.tsx
"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Brain, Menu, Sparkle, ChevronDown } from "lucide-react";
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

const Navbar = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false); // Renamed for clarity
  const allIds = navLinks.flatMap(link => [link.href, ...(link.children?.map(c => c.href) || [])]);
  const activeId = useScrollSpy(allIds);

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    smoothScrollTo(href);
    setIsDrawerOpen(false); // Close the drawer on link click
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-transparent backdrop-blur-sm supports-backdrop-filter:bg-background/10">
      <Wrapper className="flex h-16 items-center justify-between">
        {/* === Left Side (No changes) === */}
        <div className="flex items-center gap-6">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-2 group focus:outline-none overflow-hidden"
          >
            <div className="relative h-23 w-23 overflow-hidden rounded-lg">
              <Image
                src="/brainy-logo-monochrome.png"
                alt="Brainy Logo"
                fill
                priority
                className="object-contain transition-transform duration-300 group-hover:scale-110 invert dark:invert-0"
              />
            </div>

            <span className="hidden text-lg font-bold bg-linear-to-r from-primary to-primary/70 bg-clip-text text-transparent">
              Brainy
            </span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
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

        {/* === Right Side (No changes to desktop) === */}
        <div className="flex items-center gap-2">
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild><Link href="/auth/login">Log in</Link></Button>
            <Button asChild><Link href="/get-started"><Sparkle className="mr-2 h-4 w-4" />Get Started</Link></Button>
          </div>

          {/* --- 2. REPLACE SHEET WITH DRAWER FOR MOBILE --- */}
          <div className="md:hidden">
            <Drawer open={isDrawerOpen} onOpenChange={setIsDrawerOpen}>
              <DrawerTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open main menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </DrawerTrigger>
              <DrawerContent>
                {/* The drawer's content is structured a bit differently */}
                <div className="mx-auto w-full max-w-sm">
                  <DrawerHeader>
                    <DrawerTitle asChild>
                      <Link href="/" className="flex items-center justify-center space-x-2" onClick={(e) => handleLinkClick(e, "#")}>
                        <Brain className="h-7 w-7 text-primary" />
                        <span className="text-xl font-bold">Brainy</span>
                      </Link>
                    </DrawerTitle>
                  </DrawerHeader>
                  <div className="p-4 pb-8">
                    <nav className="flex flex-col gap-2">
                      {navLinks.map((link) => (
                        <div key={link.label}>
                          <Link href={link.href} onClick={(e) => handleLinkClick(e, link.href)} className="block rounded-lg px-3 py-3 text-center text-lg font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                            {link.label}
                          </Link>
                          {/* We can keep the nested structure for clarity */}
                          {link.children && (
                            <div className="mt-2 flex flex-col items-center justify-center gap-2">
                              {link.children.map(child => (
                                <Link key={child.label} href={child.href} onClick={(e) => handleLinkClick(e, child.href)} className="block rounded-lg px-3 py-2 text-base font-medium text-muted-foreground hover:bg-accent hover:text-foreground">
                                  {child.label}
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </nav>
                    <div className="mt-8 space-y-3 border-t pt-6">
                      <Button className="w-full" size="lg" asChild><Link href="/get-started"><Sparkle className="mr-2 h-4 w-4" />Get Started</Link></Button>
                      <Button variant="outline" size="lg" className="w-full" asChild><Link href="/auth/login">Log In</Link></Button>
                    </div>
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

  if (link.children) {
    return (
      <div className="relative" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
        <Link href={link.href} onClick={(e) => onLinkClick(e, link.href)} className={cn("flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
          {link.label}
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-200", isHovered && "rotate-180")} />
        </Link>
        <AnimatePresence>
          {isHovered && (
            <motion.div initial={{ opacity: 0, y: 10, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }} transition={{ duration: 0.2, ease: "easeOut" }} className="absolute top-full left-1/2 mt-2 w-48 -translate-x-1/2 overflow-hidden rounded-xl border bg-card/80 p-2 shadow-lg backdrop-blur-md">
              {link.children.map(child => (
                <Link key={child.label} href={child.href} onClick={(e) => onLinkClick(e, child.href)} className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-foreground">
                  {child.label}
                </Link>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    );
  }

  return (
    <Link href={link.href} onClick={(e) => onLinkClick(e, link.href)} className={cn("rounded-md px-3 py-2 text-sm font-medium transition-colors", isActive ? "text-primary" : "text-muted-foreground hover:text-foreground")}>
      {link.label}
    </Link>
  );
};

export default Navbar;
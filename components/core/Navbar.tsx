"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Brain, Menu, Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

// Shadcn UI Components
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useState } from "react";
import { Wrapper } from "../ui/wrapper";

const navLinks = [
  { href: "/#features", label: "Features" },
  // { href: "/#courses", label: "Courses" },
  { href: "/#howitworks", label: "How It Works" },
  { href: "/#for-students", label: "For Students" },
  { href: "/#for-tutors", label: "For Tutors" },
];

const Navbar = () => {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <Wrapper className="flex h-16 items-center justify-between">
        {/* === Left Side: Logo and Desktop Navigation === */}
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center space-x-2">
            <Brain className="h-7 w-7 text-primary" />
            <span className="text-xl font-bold text-foreground">Brainy</span>
          </Link>
          <nav className="hidden items-center gap-1 md:flex">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={cn(
                    "rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* === Right Side: Auth Buttons & Mobile Menu Trigger === */}
        <div className="flex items-center gap-2">
          {/* Desktop Buttons */}
          <div className="hidden items-center gap-2 md:flex">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">
                <Sparkle className="mr-2 h-4 w-4" />
                Get Started
              </Link>
            </Button>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="md:hidden">
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" aria-label="Open main menu">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="flex flex-col p-0">
                <SheetHeader className="border-b p-4">
                  <SheetTitle asChild>
                    <Link
                      href="/"
                      className="flex items-center space-x-2"
                      onClick={() => setIsSheetOpen(false)}
                    >
                      <Brain className="h-7 w-7 text-primary" />
                      <span className="text-xl font-bold">Brainy</span>
                    </Link>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex h-full flex-col justify-between p-4">
                  <nav className="mt-4 flex flex-col gap-2">
                    {navLinks.map((link) => (
                      <Link
                        key={link.href}
                        href={link.href}
                        onClick={() => setIsSheetOpen(false)}
                        className="rounded-lg px-3 py-3 text-lg font-medium text-muted-foreground hover:bg-accent hover:text-foreground"
                      >
                        {link.label}
                      </Link>
                    ))}
                  </nav>
                  <div className="space-y-3 border-t pt-6">
                    <Button className="w-full" asChild>
                      <Link href="/auth/signup">
                        <Sparkle className="mr-2 h-4 w-4" />
                        Get Started
                      </Link>
                    </Button>
                    <Button variant="outline" className="w-full" asChild>
                      <Link href="/auth/login">Log In</Link>
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Wrapper>
    </header>
  );
};

export default Navbar;

// okay so now can i now have a perfcet user flow , workflow from the landing page
// app/(platform)/_components/header.tsx

import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  BookText,
  PanelLeft,
  Sparkles,
} from "lucide-react";

// Import our new components
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";
import { CommandMenu } from "./command-menu";
import { UserNav } from "./user-nav";

// UI Imports
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import Image from "next/image";

// Nav links for the mobile sheet
const navLinks = [
  { href: "/platform/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/platform/institutions", label: "Institutions", icon: Building2 },
  { href: "/platform/users", label: "Users", icon: Users },
  { href: "/platform/audit-logs", label: "Audit Logs", icon: BookText },
  { href: "/platform/settings", label: "Settings", icon: Settings },
];

export function AdminHeader() {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-border bg-transparent px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* --- Mobile Navigation (Sheet) --- */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden border-border bg-card/50 backdrop-blur-md rounded-xl">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs border-r border-border bg-popover/80 backdrop-blur-2xl p-0">
          <nav className="flex flex-col h-full py-8 px-4 gap-2">
            <Link
              href="/platform/dashboard"
              className="group flex h-12 items-center gap-3 rounded-2xl bg-primary px-4 mb-6 shadow-2xl shadow-primary/20 transition-all active:scale-95"
            >
              <Image src={'/brainy-app-icon.png'} width={24} height={24} alt="Brainy logo" className="brightness-0 invert" />
              <span className="text-sm font-black tracking-tighter text-primary-foreground uppercase">Brainy <span className="italic">Platform</span></span>
            </Link>

            <div className="space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="flex items-center gap-4 px-4 py-3 text-sm font-bold tracking-tight text-muted-foreground/60 rounded-xl transition-all hover:bg-accent hover:text-foreground active:bg-accent/50"
                >
                  <link.icon className="h-5 w-5" />
                  {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-auto flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Audit Phase 04 Active</span>
            </div>
          </nav>
        </SheetContent>
      </Sheet>

      {/* --- Dynamic Breadcrumb for Desktop --- */}
      <div className="hidden sm:block">
        <DynamicBreadcrumb />
      </div>

      {/* --- Global Search and User Menu --- */}
      <div className="relative ml-auto flex items-center gap-3 md:grow-0">
        <CommandMenu />
        <UserNav />
      </div>
    </header>
  );
}

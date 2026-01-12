// app/(platform)/_components/header.tsx

import Link from "next/link";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  BookText,
  PanelLeft,
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
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
      {/* --- Mobile Navigation (Sheet) --- */}
      <Sheet>
        <SheetTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="sm:max-w-xs">
          <nav className="grid gap-6 text-lg font-medium">
            <Link
              href="/platform/dashboard"
              className="group flex h-10 w-10 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:text-base"
            >
              <Image src={'/brainy-app-icon.png'} width={20} height={20} alt="Brainy logo"/>
              <span className="sr-only">Brainy Platform</span>
            </Link>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
          </nav>
        </SheetContent>
      </Sheet>

      {/* --- Dynamic Breadcrumb for Desktop --- */}
      <DynamicBreadcrumb />

      {/* --- Global Search and User Menu --- */}
      <div className="relative ml-auto flex items-center gap-4 md:grow-0">
        <CommandMenu />
        <UserNav />
      </div>
    </header>
  );
}
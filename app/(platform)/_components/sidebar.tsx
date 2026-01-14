// app/(platform)/_components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Building2,
  Users,
  Settings,
  BookText,
} from "lucide-react";
import { cn } from "@/lib/utils";

// UI Imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

// Define the navigation links for the sidebar
const navLinks = [
  { href: "/platform/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/platform/institutions", label: "Institutions", icon: Building2, notificationCount: 5 }, // Example notification
  { href: "/platform/users", label: "Users", icon: Users },
  { href: "/platform/audit-logs", label: "Audit Logs", icon: BookText },
];

const settingsLink = { href: "/platform/settings", label: "Settings", icon: Settings };

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r border-white/5 bg-white/5 backdrop-blur-xl sm:flex">
      <TooltipProvider>
        {/* Top section with Logo and main navigation */}
        <nav className="flex flex-col items-center gap-6 px-2 sm:py-6">
          <Link
            href="/platform/dashboard"
            className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-110 active:scale-95"
          >
            <Image src={'/brainy-app-icon.png'} width={24} height={24} alt="Brainy logo" className="brightness-0 invert" />
            <span className="sr-only">Brainy Platform</span>
            <div className="absolute inset-0 rounded-xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="flex flex-col gap-4">
            {navLinks.map((link) => {
              const isActive = pathname.startsWith(link.href);
              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground/60 hover:bg-white/10 hover:text-foreground"
                      )}
                    >
                      <link.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                      <span className="sr-only">{link.label}</span>

                      {/* Active Indicator Pip */}
                      {isActive && (
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                      )}

                      {/* --- Modern Notification Badge --- */}
                      {link.notificationCount && link.notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-black text-destructive-foreground shadow-sm">
                          {link.notificationCount}
                        </div>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-bold border-white/10 bg-black/80 backdrop-blur-md">
                    {link.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </nav>

        {/* Bottom section for settings */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={settingsLink.href}
                className={cn(
                  "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                  pathname.startsWith(settingsLink.href)
                    ? "bg-white/10 text-foreground"
                    : "text-muted-foreground/60 hover:bg-white/10 hover:text-foreground"
                )}
              >
                <settingsLink.icon className="h-5 w-5" />
                <span className="sr-only">{settingsLink.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-bold border-white/10 bg-black/80 backdrop-blur-md">
              {settingsLink.label}
            </TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}

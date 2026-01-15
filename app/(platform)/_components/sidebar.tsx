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
  Scale,
} from "lucide-react";
import { cn } from "@/lib/utils";

// UI Imports
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";

import { getAdminNotificationCounts } from "../_actions/admin-actions";
import { useEffect, useState } from "react";

// Define the navigation links for the sidebar
const BASE_NAV_LINKS = [
  { href: "/platform/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/platform/institutions", label: "Institutions", icon: Building2, key: "pendingInstitutions" },
  { href: "/platform/users", label: "Users", icon: Users },
  { href: "/platform/leads", label: "Leads", icon: Users, key: "unrepliedLeads" },
  { href: "/platform/legal", label: "Legal", icon: Scale },
  { href: "/platform/audit-logs", label: "Audit Logs", icon: BookText },
  { href: "/platform/blog", label: "Blogs", icon: BookText},
];

const settingsLink = { href: "/platform/settings", label: "Settings", icon: Settings };

export function AdminSidebar() {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ pendingInstitutions: 0, unrepliedLeads: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const result = await getAdminNotificationCounts();
      setCounts(result);
    }
    fetchCounts();

    // Refresh every 30 seconds
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r border-border bg-card/50 backdrop-blur-xl sm:flex">
      <TooltipProvider>
        {/* Top section with Logo and main navigation */}
        <nav className="flex flex-col items-center gap-6 px-2 sm:py-6">
          <Link
            href="/platform/dashboard"
            className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-110 active:scale-95"
          >
            <Image src={'/brainy-app-icon.png'} width={24} height={24} alt="Brainy logo" className="brightness-0 invert" />
            <span className="sr-only">Brainy Platform</span>
            <div className="absolute inset-0 rounded-xl bg-primary-foreground/10 opacity-0 group-hover:opacity-100 transition-opacity" />
          </Link>

          <div className="flex flex-col gap-4">
            {BASE_NAV_LINKS.map((link) => {
              const isActive = pathname.startsWith(link.href);
              const notificationCount = link.key ? (counts as any)[link.key] : 0;

              return (
                <Tooltip key={link.href}>
                  <TooltipTrigger asChild>
                    <Link
                      href={link.href}
                      className={cn(
                        "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                        isActive
                          ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                          : "text-muted-foreground/60 hover:bg-accent hover:text-foreground"
                      )}
                    >
                      <link.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[2px]")} />
                      <span className="sr-only">{link.label}</span>

                      {/* Active Indicator Pip */}
                      {isActive && (
                        <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full shadow-[0_0_8px_rgba(var(--primary),0.6)]" />
                      )}

                      {/* --- Modern Notification Badge --- */}
                      {notificationCount > 0 && (
                        <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] font-black text-destructive-foreground shadow-sm animate-in zoom-in-50 duration-300">
                          {notificationCount}
                        </div>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" className="font-bold border-border bg-popover/80 backdrop-blur-md">
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
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground/60 hover:bg-accent hover:text-foreground"
                )}
              >
                <settingsLink.icon className="h-5 w-5" />
                <span className="sr-only">{settingsLink.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" className="font-bold border-border bg-popover/80 backdrop-blur-md">
              {settingsLink.label}
            </TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}

// app/(platform)/_components/sidebar.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import Image from "next/image";
import { getAdminNotificationCounts } from "../_actions/admin-actions";
import { useEffect, useState } from "react";

// IMPORT: Use the shared navigation links
import { PLATFORM_NAV_LINKS, SETTINGS_NAV_LINK } from "../_constants/nav-links";

export function AdminSidebar() {
  const pathname = usePathname();
  const [counts, setCounts] = useState({ pendingInstitutions: 0, unrepliedLeads: 0 });

  useEffect(() => {
    async function fetchCounts() {
      const result = await getAdminNotificationCounts();
      setCounts(result);
    }
    fetchCounts();
    const interval = setInterval(fetchCounts, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <aside className="fixed inset-y-0 left-0 z-50 hidden w-14 flex-col border-r border-border bg-card/50 backdrop-blur-xl sm:flex">
      <TooltipProvider>
        <nav className="flex flex-col items-center gap-6 px-2 sm:py-6">
          <Link
            href="/platform/dashboard"
            className="group relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 transition-all hover:scale-110 active:scale-95"
          >
            <Image src={'/brainy-app-icon.png'} width={24} height={24} alt="Brainy logo" className="brightness-0 invert" />
            <span className="sr-only">Brainy Platform</span>
          </Link>

          {/* REFACTORED: Map over the imported links */}
          <div className="flex flex-col gap-4">
            {PLATFORM_NAV_LINKS.map((link) => {
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
                      {isActive && <div className="absolute -left-2 top-1/2 -translate-y-1/2 w-1.5 h-6 bg-primary rounded-r-full" />}
                      {notificationCount > 0 && (
                        <span className="absolute -top-1.5 -right-1.5 inline-flex min-w-[1.2rem] h-[1.2rem] items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-primary-foreground shadow-sm ring-2 ring-background">
                          {notificationCount > 99 ? "99+" : notificationCount}
                        </span>
                      )}
                    </Link>
                  </TooltipTrigger>
                  <TooltipContent side="right" sideOffset={8} className="text-xs font-bold border-border backdrop-blur-md">
                    {link.label}
                  </TooltipContent>
                </Tooltip>
              );
            })}
          </div>
        </nav>

        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-6">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={SETTINGS_NAV_LINK.href}
                className={cn(
                  "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-300",
                  pathname.startsWith(SETTINGS_NAV_LINK.href)
                    ? "bg-accent text-foreground"
                    : "text-muted-foreground/60 hover:bg-accent hover:text-foreground"
                )}
              >
                <SETTINGS_NAV_LINK.icon className="h-5 w-5" />
                <span className="sr-only">{SETTINGS_NAV_LINK.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right" sideOffset={8} className="text-xs font-bold border-border backdrop-blur-md">
              {SETTINGS_NAV_LINK.label}
            </TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}

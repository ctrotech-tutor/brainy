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
    <aside className="fixed inset-y-0 left-0 z-10 hidden w-14 flex-col border-r bg-background sm:flex">
      <TooltipProvider>
        {/* Top section with Logo and main navigation */}
        <nav className="flex flex-col items-center gap-4 px-2 sm:py-5">
          <Link
            href="/platform/dashboard"
            className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base"
          >
            <Image src={'/brainy-app-icon.png'} width={20} height={20} alt="Brainy logo"/>
            <span className="sr-only">Brainy Platform</span>
          </Link>

          {navLinks.map((link) => (
            <Tooltip key={link.href}>
              <TooltipTrigger asChild>
                <Link
                  href={link.href}
                  className={cn(
                    "relative flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                    { "bg-accent text-accent-foreground": pathname.startsWith(link.href) }
                  )}
                >
                  <link.icon className="h-5 w-5" />
                  <span className="sr-only">{link.label}</span>
                  
                  {/* --- Modern Notification Badge --- */}
                  {link.notificationCount && link.notificationCount > 0 && (
                    <div className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                      {link.notificationCount}
                    </div>
                  )}
                </Link>
              </TooltipTrigger>
              <TooltipContent side="right">{link.label}</TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Bottom section for settings */}
        <nav className="mt-auto flex flex-col items-center gap-4 px-2 sm:py-5">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href={settingsLink.href}
                className={cn(
                  "flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground md:h-8 md:w-8",
                  { "bg-accent text-accent-foreground": pathname.startsWith(settingsLink.href) }
                )}
              >
                <settingsLink.icon className="h-5 w-5" />
                <span className="sr-only">{settingsLink.label}</span>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="right">{settingsLink.label}</TooltipContent>
          </Tooltip>
        </nav>
      </TooltipProvider>
    </aside>
  );
}

// app/(platform)/_components/header.tsx

import Link from "next/link";
import { PanelLeft, Sparkles } from "lucide-react";
import Image from "next/image";

// Import our components
import { DynamicBreadcrumb } from "./dynamic-breadcrumb";
import { CommandMenu } from "./command-menu";
import { UserNav } from "./user-nav";
import { NotificationBell } from "./notifications/notification-bell";


import { Button } from "@/components/ui/button";
import {
  Drawer,
  DrawerContent,
  DrawerTrigger,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

// IMPORT: Use the shared navigation links
import { PLATFORM_NAV_LINKS, SETTINGS_NAV_LINK } from "../_constants/nav-links";

export function AdminHeader() {
  return (
    <header className="flex h-16 items-center gap-4 border-b border-border bg-card/50 backdrop-blur-md px-4 sm:border-0 sm:bg-transparent sm:px-0 rounded-2xl sm:rounded-none">

      {/* --- Mobile Navigation (Drawer) --- */}
      <Drawer>
        <DrawerTrigger asChild>
          <Button size="icon" variant="outline" className="sm:hidden border-border bg-card/50 backdrop-blur-md rounded-xl">
            <PanelLeft className="h-5 w-5" />
            <span className="sr-only">Toggle Menu</span>
          </Button>
        </DrawerTrigger>
        <DrawerContent className="sm:hidden bg-popover/80 backdrop-blur-2xl border-border">
          <DrawerHeader className="text-left">
            <DrawerTitle className="flex items-center gap-3">
              <Image src={'/brainy-app-icon.png'} width={24} height={24} alt="Brainy logo" className="brightness-0 invert" />
              <span className="text-sm font-black tracking-tighter text-primary-foreground uppercase">Brainy <span className="italic">Platform</span></span>
            </DrawerTitle>
          </DrawerHeader>

          <nav className="grid items-start p-4 gap-2">
            {/* REFACTORED: Map over the imported links */}
            {PLATFORM_NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="flex items-center gap-4 px-4 py-3 text-sm font-bold tracking-tight text-muted-foreground/60 rounded-xl transition-all hover:bg-accent hover:text-foreground active:bg-accent/50"
              >
                <link.icon className="h-5 w-5" />
                {link.label}
              </Link>
            ))}
            {/* Add settings link separately */}
            <Link
              href={SETTINGS_NAV_LINK.href}
              className="flex items-center gap-4 px-4 py-3 text-sm font-bold tracking-tight text-muted-foreground/60 rounded-xl transition-all hover:bg-accent hover:text-foreground active:bg-accent/50"
            >
              <SETTINGS_NAV_LINK.icon className="h-5 w-5" />
              {SETTINGS_NAV_LINK.label}
            </Link>
          </nav>

          <div className="mt-auto p-4">
            <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-card border border-border">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40">Audit Phase 04 Active</span>
            </div>
          </div>
        </DrawerContent>
      </Drawer>

      {/* --- Dynamic Breadcrumb for Desktop --- */}
      <div className="hidden sm:block">
        <DynamicBreadcrumb />
      </div>

      {/* --- Global Search and User Menu --- */}
      <div className="relative ml-auto flex items-center gap-3 md:grow-0">
        <NotificationBell />
        <CommandMenu />
        <UserNav />
      </div>
    </header>
  );
}

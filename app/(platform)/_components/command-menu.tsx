// app/(platform)/_components/command-menu.tsx
"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Building2,
  LayoutDashboard,
  Settings,
  Users,
  Search,
} from "lucide-react";

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import { cn } from "@/lib/utils";

export function CommandMenu() {
  const router = useRouter();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = (command: () => unknown) => {
    setOpen(false);
    command();
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="group flex h-10 items-center gap-3 rounded-xl border border-white/5 bg-white/5 px-4 text-xs font-bold uppercase tracking-widest text-muted-foreground/60 transition-all hover:bg-white/10 hover:text-foreground md:w-64 lg:w-80"
      >
        <Search className="h-4 w-4 opacity-50 transition-opacity group-hover:opacity-100" />
        <span className="flex-1 text-left">Internal Search...</span>
        <kbd className="pointer-events-none hidden h-5 select-none items-center gap-1 rounded-[4px] border border-white/10 bg-white/5 px-1.5 font-mono text-[10px] font-black text-muted-foreground/40 opacity-100 sm:flex">
          <span className="text-[12px]">⌘</span>K
        </kbd>
      </button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            <CommandItem onSelect={() => runCommand(() => router.push("/platform/dashboard"))}>
              <LayoutDashboard className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/platform/institutions/pending"))}>
              <Building2 className="mr-2 h-4 w-4" />
              <span>Pending Institutions</span>
            </CommandItem>
            <CommandItem onSelect={() => runCommand(() => router.push("/users"))}>
              <Users className="mr-2 h-4 w-4" />
              <span>Users</span>
            </CommandItem>
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup heading="Settings">
            <CommandItem onSelect={() => runCommand(() => router.push("/platform/settings"))}>
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  );
}

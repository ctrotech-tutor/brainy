"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Loader2,
  LayoutDashboard,
  Settings,
  UserCircle,
} from "lucide-react";

// UI Imports
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuGroup,
  DropdownMenuShortcut,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// This is the type of the user object passed from the server component
import { UserNavClientProps } from "@/app/(platform)/_types";
import { getInitials } from "@/lib/utils";

import { signOut } from "next-auth/react";

export function UserNavClient({ user }: UserNavClientProps) {
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut({ callbackUrl: "/auth/login" });
    } catch (error) {
      toast.error("Logout failed");
      setIsLoggingOut(false);
    }
  };

  const isPlatformAdmin = user.roles.includes("PLATFORM_ADMIN");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 transition-all p-0">
          <Avatar className="h-8 w-8 rounded-lg">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} className="rounded-lg" />
            <AvatarFallback className="rounded-lg bg-primary/10 text-primary text-[10px] font-black uppercase">
              {getInitials(user.name)}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 border-white/10 bg-black/60 backdrop-blur-2xl shadow-2xl rounded-2xl p-2" align="end" forceMount>
        <DropdownMenuLabel className="font-normal p-4">
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10 rounded-xl border border-white/10">
              <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
              <AvatarFallback className="rounded-xl bg-primary/10 text-primary font-black uppercase text-xs">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col space-y-0.5">
              <p className="text-sm font-black tracking-tight text-foreground uppercase">{user.name}</p>
              <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest leading-none">
                {user.email}
              </p>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator className="bg-white/5 mx-2" />

        <DropdownMenuGroup className="p-1 space-y-1">
          <DropdownMenuItem
            onSelect={() => router.push('/dashboard')}
            className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/80 focus:bg-white/5 focus:text-foreground transition-all"
          >
            <LayoutDashboard className="mr-3 h-4 w-4 opacity-50" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => router.push('/settings/profile')}
            className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/80 focus:bg-white/5 focus:text-foreground transition-all"
          >
            <UserIcon className="mr-3 h-4 w-4 opacity-50" />
            <span>Profile Identity</span>
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => router.push('/settings/account')}
            className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-muted-foreground/80 focus:bg-white/5 focus:text-foreground transition-all"
          >
            <Settings className="mr-3 h-4 w-4 opacity-50" />
            <span>Configuration</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {isPlatformAdmin && (
          <>
            <DropdownMenuSeparator className="bg-white/5 mx-2" />
            <DropdownMenuGroup className="p-1">
              <DropdownMenuItem
                onSelect={() => router.push('/platform/dashboard')}
                className="rounded-xl px-3 py-2 text-xs font-black uppercase tracking-tighter text-primary focus:bg-primary/10 transition-all"
              >
                <ShieldCheck className="mr-3 h-4 w-4" />
                <span>Platform Nucleus</span>
                <DropdownMenuShortcut className="text-[10px] opacity-40">⌘P</DropdownMenuShortcut>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        <DropdownMenuSeparator className="bg-white/5 mx-2" />

        <div className="p-1">
          <DropdownMenuItem
            onSelect={() => handleLogout()}
            disabled={isLoggingOut}
            className="rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-widest text-destructive focus:bg-destructive/10 focus:text-destructive transition-all"
          >
            {isLoggingOut ? (
              <Loader2 className="mr-3 h-4 w-4 animate-spin" />
            ) : (
              <LogOut className="mr-3 h-4 w-4 opacity-50" />
            )}
            <span>{isLoggingOut ? "Terminating..." : "Terminate Session"}</span>
          </DropdownMenuItem>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

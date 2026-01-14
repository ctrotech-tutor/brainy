"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  LogOut,
  User,
  LayoutDashboard,
  Settings,
  CreditCard
} from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

interface UserNavProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    onboardingComplete?: boolean;
    onboardingIntent?: string | null;
  };
}

import { signOut } from "next-auth/react";
import { useState } from "react";

export function UserNav({ user }: UserNavProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const handleLogout = async () => {
    setIsPending(true);
    try {
      await signOut({ callbackUrl: "/" });
    } catch (error) {
      toast.error("Logout failed. Please try again.");
      setIsPending(false);
    }
  };

  const getDashboardHref = () => {
    if (!user.onboardingComplete) {
      if (user.onboardingIntent) return `/onboarding/${user.onboardingIntent}/start`;
      return "/onboarding/choose-path";
    }
    return "/dashboard";
  };

  const initials = user.name
    ? user.name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
    : user.email?.charAt(0).toUpperCase() || "U";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10 border border-border shadow-sm">
            <AvatarImage src={user.image || ""} alt={user.name || "User"} />
            <AvatarFallback className="bg-primary/10 text-primary">{initials}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name || "User"}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push(getDashboardHref())}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/settings")}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => router.push("/billing")}>
            <CreditCard className="mr-2 h-4 w-4" />
            <span>Billing</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleLogout}
          disabled={isPending}
          className="text-destructive focus:bg-destructive/10 focus:text-destructive"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{isPending ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

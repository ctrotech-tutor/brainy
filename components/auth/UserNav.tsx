// components/core/UserNav.tsx (or wherever you store it)
"use client";

import { useQuery, useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "sonner";
import {
  LogOut,
  Settings,
  User as UserIcon,
  ShieldCheck,
  Loader2,
  LayoutDashboard,
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
import { Skeleton } from "@/components/ui/skeleton";

import { UserSession } from "@/app/(platform)/_types";

// API fetching function for the current user session
const fetchUserSession = async (): Promise<UserSession | null> => {
  try {
    const { data } = await axios.get("/api/auth/session");
    return data.user;
  } catch (error) {
    // If the API returns 401 or another error, it means no session
    console.log("no session", error);
    return null;
  }
};

// Logout action (no changes)
// Logout action (no changes)
const logoutAction = async () => {
  const { data } = await axios.post("/api/auth/logout");
  return data;
};

import { getInitials } from "@/lib/utils";

// Helper to get initials (no changes)
// (Removed inline implementation)

export function UserNav() {
  const router = useRouter();

  // 1. Fetch the user data within the component
  const { data: user, isPending: isLoading, isError } = useQuery({
    queryKey: ["user-session"],
    queryFn: fetchUserSession,
    staleTime: 1000 * 60 * 5, // Cache user session for 5 minutes
  });

  // 2. Logout mutation
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      router.push("/auth/login");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  // --- Render States ---

  // 3. Loading state
  if (isLoading) {
    return <Skeleton className="h-8 w-8 rounded-full" />;
  }

  // 4. No user / Error state
  if (!user || isError) {
    return (
      <Button asChild>
        <a href="/auth/login">Log In</a>
      </Button>
    );
  }

  const isPlatformAdmin = user.roles.includes("PLATFORM_ADMIN");

  // 5. Main component render
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user.image ?? undefined} alt={user.name ?? "User"} />
            <AvatarFallback>{getInitials(user.name)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onSelect={() => router.push('/dashboard')}>
            <LayoutDashboard className="mr-2 h-4 w-4" />
            <span>Dashboard</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push('/settings/profile')}>
            <UserIcon className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onSelect={() => router.push('/settings/account')}>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        
        {/* --- Role-Aware Section --- */}
        {isPlatformAdmin && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onSelect={() => router.push('/dashboard')} className="text-primary focus:bg-primary/10 focus:text-primary">
              <ShieldCheck className="mr-2 h-4 w-4" />
              <span>Platform Admin</span>
              <DropdownMenuShortcut>⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
          </>
        )}

        <DropdownMenuSeparator />
        <DropdownMenuItem onSelect={() => logout()} disabled={isLoggingOut}>
          {isLoggingOut ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <LogOut className="mr-2 h-4 w-4" />
          )}
          <span>{isLoggingOut ? "Logging out..." : "Log out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

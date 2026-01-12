// app/(platform)/_components/usernav.client.tsx
"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import {
  LogOut,
  User as UserIcon,
  ShieldCheck,
  Loader2,
  LayoutDashboard,
  Settings,
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
import axios from "axios";

// This is the type of the user object passed from the server component
import { UserNavClientProps } from "@/app/(platform)/_types";

// This is the type of the user object passed from the server component
// (Imported from _types)

const logoutAction = async () => {
  const { data } = await axios.post("/api/auth/logout");
  return data;
};

import { getInitials } from "@/lib/utils";

// Helper to get initials (no changes)
// (Removed inline implementation)

export function UserNavClient({ user }: UserNavClientProps) {
  const router = useRouter();

  // The logout mutation remains on the client
  const { mutate: logout, isPending: isLoggingOut } = useMutation({
    mutationFn: logoutAction,
    onSuccess: () => {
      router.push("/auth/login");
      router.refresh();
    },
    onError: (error) => toast.error(error.message),
  });

  const isPlatformAdmin = user.roles.includes("PLATFORM_ADMIN");

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

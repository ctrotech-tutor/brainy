"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";

// UI Imports
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft, UserCheck, ShieldCheck } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

// Import Child Components
import { UserProfileCard } from "./_components/user-profile-card";
import { UserRolesCard } from "./_components/user-roles-card";
import { StudentProfileCard } from "./_components/student-profile-card";
import { UserActionsCard } from "./_components/user-actions-card";

import { UserProfileData } from "@/app/(platform)/_types";

// The function that fetches data from our API
const getUserDetails = async (id: string): Promise<UserProfileData> => {
  const { data } = await axios.get(`/api/platform/users/${id}`);
  return data;
};

export default function UserProfilePage() {
  const params = useParams();
  const id = params.id as string;

  const { data: user, isPending: isLoading, isError, error } = useQuery({
    queryKey: ["user-profile", id],
    queryFn: () => getUserDetails(id),
    retry: false,
  });

  // Handle Loading State
  if (isLoading) {
    return (
      <div className="space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-4 w-32 bg-white/5" />
          <Skeleton className="h-10 w-96 bg-white/5" />
          <Skeleton className="h-4 w-64 bg-white/5" />
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-8">
            <Skeleton className="h-[400px] w-full rounded-[2.5rem] bg-white/5" />
          </div>
          <div className="space-y-8">
            <Skeleton className="h-[200px] w-full rounded-[2.5rem] bg-white/5" />
            <Skeleton className="h-[200px] w-full rounded-[2.5rem] bg-white/5" />
          </div>
        </div>
      </div>
    );
  }

  // Handle Error State
  if (isError) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      notFound();
    }
    return (
      <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-white/5 py-24 text-center">
        <h3 className="text-xl font-black tracking-tighter text-foreground uppercase text-rose-500">Identity Context Lost</h3>
        <p className="mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest max-w-xs mx-auto">
          {getErrorMessage(error) || "Protocol handshake failed."}
        </p>
      </div>
    );
  }

  if (!user) {
    return <div className="text-center py-10 uppercase text-[10px] font-black tracking-[0.2em] text-muted-foreground/20">Empty Identity Node</div>;
  }

  return (
    <div className="space-y-10">
      {/* Page Header */}
      <div className="flex flex-col gap-6">
        <Button asChild variant="ghost" size="sm" className="w-fit hover:bg-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-muted-foreground/60 group">
          <Link href="/platform/users" className="flex items-center">
            <ArrowLeft className="mr-2 h-3.5 w-3.5 transition-transform group-hover:-translate-x-1" />
            Registry Directory
          </Link>
        </Button>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
              <UserCheck className="h-3.5 w-3.5" />
              Identity Manifest
            </div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
              {user.name?.split(' ')[0] || 'User'} <span className="text-primary italic">{user.name?.split(' ').slice(1).join(' ') || 'Node'}.</span>
            </h1>
            <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
              Reviewing identity parameters and institutional access for <span className="text-white">{user.email}</span>.
            </p>
          </div>
          <div className="hidden sm:flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-md">
            <ShieldCheck className="h-4 w-4 text-emerald-500" />
            <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/60">Registry Synchronized</span>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-2 space-y-8">
          <UserProfileCard user={user} />
          {user.studentProfile && (
            <StudentProfileCard profile={user.studentProfile} />
          )}
        </div>

        {/* Right Column (Roles & Actions) */}
        <div className="space-y-8">
          <UserRolesCard roles={user.roles.map(r => r.role)} />
          <UserActionsCard userId={user.id} isVerified={!!user.emailVerified} />
        </div>
      </div>
    </div>
  );
}

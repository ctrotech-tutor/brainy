"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { notFound, useParams } from "next/navigation";
import Link from "next/link";

// UI Imports
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { getErrorMessage } from "@/lib/utils";

// Import Child Components (we will create these next)
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
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="lg:col-span-2 space-y-6">
            <Skeleton className="h-64 w-full" />
          </div>
          <div className="space-y-6">
            <Skeleton className="h-48 w-full" />
            <Skeleton className="h-48 w-full" />
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
      <div className="text-center py-10">
        <p className="mt-2 text-sm text-muted-foreground">
          {getErrorMessage(error)}
        </p>
      </div>
    );
  }

  // Handle case where data is successfully fetched but is null/undefined
  if (!user) {
    return <div className="text-center py-10">No user data found.</div>;
  }

  // Render the full UI
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <Button asChild variant="outline" size="sm" className="mb-4">
          <Link href="/platform/users">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to All Users
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">User Profile</h1>
        <p className="text-muted-foreground">
          Viewing details for {user.email}
        </p>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column (Main Details) */}
        <div className="lg:col-span-2 space-y-6">
          <UserProfileCard user={user} />
          {user.studentProfile && (
            <StudentProfileCard profile={user.studentProfile} />
          )}
        </div>

        {/* Right Column (Roles & Actions) */}
        <div className="space-y-6">
          <UserRolesCard roles={user.roles.map(r => r.role)} />
          <UserActionsCard userId={user.id} isVerified={!!user.emailVerified} />
        </div>
      </div>
    </div>
  );
}

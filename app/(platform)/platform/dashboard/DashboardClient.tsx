// app/(platform)/platform/dashboard/DashboardClient.tsx
"use client";

import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import Link from "next/link";
import {
  Activity,
  Building2,
  Users,
  GraduationCap,
  ArrowUpRight,
  AlertTriangle,
} from "lucide-react";

import { getErrorMessage } from "@/lib/utils";

// UI Imports
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

import { PlatformStats } from "@/app/(platform)/_types";

// The function that fetches data from our stats API
const getPlatformStats = async (): Promise<PlatformStats> => {
  const { data } = await axios.get("/api/platform/stats");
  return data;
};

// A reusable StatCard component for consistency
const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  link,
  isActionable,
}: {
  title: string;
  value: string | number;
  icon: React.ElementType;
  description: string;
  link?: string;
  isActionable?: boolean;
}) => (
  <Card className={isActionable ? "border-primary/50 hover:border-primary transition-colors" : ""}>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      <Icon className="h-4 w-4 text-muted-foreground" />
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
      <p className="text-xs text-muted-foreground">{description}</p>
      {link && (
        <Button asChild variant="link" className="p-0 h-auto mt-2 text-xs">
          <Link href={link}>
            View All <ArrowUpRight className="ml-1 h-3 w-3" />
          </Link>
        </Button>
      )}
    </CardContent>
  </Card>
);

// The main dashboard page component
export default function DashboardClient() {
  const { data: stats, isPending: isLoading, isError, error } = useQuery({
    queryKey: ["platform-stats"],
    queryFn: getPlatformStats,
  });

  // Handle the loading state with skeletons
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">
            An overview of your platform&apos;s activity.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-4" />
              </CardHeader>
              <CardContent>
                <Skeleton className="h-8 w-16 mb-2" />
                <Skeleton className="h-3 w-32" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Handle error state
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center">
        <AlertTriangle className="h-10 w-10 text-destructive" />
        <p className="mt-2 text-sm text-muted-foreground">
          {getErrorMessage(error)}
        </p>
      </div>
    );
  }

  // Render the dashboard if data is successfully loaded
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          An overview of your platform&apos;s activity.
        </p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Pending Institutions"
          value={stats?.pendingInstitutions ?? 0}
          icon={Activity}
          description="New applications awaiting review."
          link="/platform/institutions/pending"
          isActionable={true} // Highlight this card
        />
        <StatCard
          title="Active Institutions"
          value={stats?.activeInstitutions ?? 0}
          icon={Building2}
          description="Currently active on the platform."
          link="/platform/institutions"
        />
        <StatCard
          title="Total Users"
          value={stats?.totalUsers ?? 0}
          icon={Users}
          description="All registered user accounts."
          link="/platform/users"
        />
        <StatCard
          title="Verified Students"
          value={stats?.totalStudents ?? 0}
          icon={GraduationCap}
          description="Students with a verified profile."
        />
      </div>
      {/* You can add more components here, like charts or recent activity logs */}
    </div>
  );
}

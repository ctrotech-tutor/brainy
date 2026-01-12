"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";

import { UserProfileData } from "@/app/(platform)/_types";

import { getInitials, formatDate } from "@/lib/utils";

// Helper to get initials from a name
// (Removed inline implementation)

// A simple component to render a key-value pair
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex justify-between border-b py-3 last:border-b-0">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium text-foreground">{value}</dd>
  </div>
);

export function UserProfileCard({ user }: { user: UserProfileData }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center space-x-4 space-y-0">
        <Avatar className="h-16 w-16">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback className="text-xl">{getInitials(user.name)}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col">
          <CardTitle className="text-2xl">{user.name || "Unnamed User"}</CardTitle>
          <p className="text-muted-foreground">{user.email}</p>
        </div>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          <InfoRow
            label="Email Verified"
            value={
              user.emailVerified ? (
                <Badge variant="outline" className="border-green-200 bg-green-50 text-green-700 dark:border-green-700 dark:bg-green-900/50 dark:text-green-300">
                  <CheckCircle2 className="mr-1 h-3 w-3" />
                  Verified on {formatDate(user.emailVerified)}
                </Badge>
              ) : (
                <Badge variant="outline" className="border-red-200 bg-red-50 text-red-700 dark:border-red-700 dark:bg-red-900/50 dark:text-red-300">
                  <XCircle className="mr-1 h-3 w-3" />
                  Not Verified
                </Badge>
              )
            }
          />
          <InfoRow
            label="Onboarding Complete"
            value={
              user.onboardingComplete ? (
                <span className="flex items-center text-green-600">
                  <CheckCircle2 className="mr-1 h-4 w-4" /> Yes
                </span>
              ) : (
                <span className="flex items-center text-amber-600">
                  <XCircle className="mr-1 h-4 w-4" /> No
                </span>
              )
            }
          />
          <InfoRow
            label="Date Joined"
            value={formatDate(user.createdAt)}
          />
        </dl>
      </CardContent>
    </Card>
  );
}

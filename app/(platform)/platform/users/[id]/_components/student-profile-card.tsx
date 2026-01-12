"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap } from "lucide-react";

// Define the shape of the profile prop
// This should come from a shared types file
type StudentProfileData = {
  id: string;
  matricNumber: string | null;
  institutionalEmail: string | null;
  institution: { id: string; name: string };
  faculty: { id:string; name: string } | null;
  department: { id: string; name: string } | null;
};

// A simple component to render a key-value pair, consistent with our other cards
const InfoRow = ({ label, value }: { label: string; value: React.ReactNode }) => (
  <div className="flex flex-col space-y-1 border-b py-3 last:border-b-0 sm:flex-row sm:justify-between sm:space-y-0">
    <dt className="text-sm text-muted-foreground">{label}</dt>
    <dd className="text-sm font-medium text-foreground text-left sm:text-right">{value}</dd>
  </div>
);

export function StudentProfileCard({ profile }: { profile: StudentProfileData }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5" />
          Student Profile
        </CardTitle>
        <CardDescription>
          The user&apos;s verified academic information.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <dl className="divide-y divide-border">
          <InfoRow
            label="Institution"
            value={
              <Link href={`/platform/institutions/review/${profile.institution.id}`} className="hover:underline">
                {profile.institution.name}
              </Link>
            }
          />
          {profile.faculty && (
            <InfoRow
              label="Faculty"
              value={profile.faculty.name}
            />
          )}
          {profile.department && (
            <InfoRow
              label="Department"
              value={profile.department.name}
            />
          )}
          {profile.matricNumber && (
            <InfoRow
              label="Matriculation No."
              value={profile.matricNumber}
            />
          )}
          {profile.institutionalEmail && (
            <InfoRow
              label="Institutional Email"
              value={profile.institutionalEmail}
            />
          )}
        </dl>
      </CardContent>
    </Card>
  );
}

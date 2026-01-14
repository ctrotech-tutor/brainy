"use client";

import Link from "next/link";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { GraduationCap, Landmark, Shapes, Fingerprint, Mail, ExternalLink } from "lucide-react";

type StudentProfileData = {
  id: string;
  matricNumber: string | null;
  institutionalEmail: string | null;
  institution: { id: string; name: string };
  faculty: { id: string; name: string } | null;
  department: { id: string; name: string } | null;
};

const InfoRow = ({ label, value, icon: Icon }: { label: string; value: React.ReactNode; icon?: React.ElementType }) => (
  <div className="group flex flex-col gap-1.5 p-4 rounded-2xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.05]">
    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-primary transition-colors">
      {Icon && <Icon className="h-3 w-3" />}
      {label}
    </div>
    <div className="text-sm font-bold text-foreground pl-5">
      {value}
    </div>
  </div>
);

export function StudentProfileCard({ profile }: { profile: StudentProfileData }) {
  return (
    <Card className="relative overflow-hidden rounded-[2.5rem] border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <CardHeader className="pb-8 space-y-1">
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
          <GraduationCap className="h-3.5 w-3.5" />
          Academic Manifest
        </div>
        <CardTitle className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
          Academic <span className="text-primary italic">Record.</span>
        </CardTitle>
        <CardDescription className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
          Verified institutional enrollment parameters.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow
            label="Primary Institution"
            icon={Landmark}
            value={
              <Link href={`/platform/institutions/review/${profile.institution.id}`} className="inline-flex items-center gap-1.5 text-primary hover:text-primary/80 transition-color underline underline-offset-4 decoration-primary/20">
                {profile.institution.name}
                <ExternalLink className="h-2.5 w-2.5" />
              </Link>
            }
          />
          {profile.faculty && (
            <InfoRow
              label="Faculty Hub"
              icon={Shapes}
              value={profile.faculty.name}
            />
          )}
          {profile.department && (
            <InfoRow
              label="Departmental Node"
              icon={Shapes}
              value={profile.department.name}
            />
          )}
          {profile.matricNumber && (
            <InfoRow
              label="Registry Identifier"
              icon={Fingerprint}
              value={profile.matricNumber}
            />
          )}
          {profile.institutionalEmail && (
            <InfoRow
              label="Institutional Link"
              icon={Mail}
              value={profile.institutionalEmail}
            />
          )}
        </div>

        <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 space-y-2 mt-4">
          <p className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Verified Registry Entry</p>
          <p className="text-xs font-bold text-muted-foreground/40 leading-relaxed">
            Academic credentials have been validated against institutional databases and cryptographically signed.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, UserCircle, Fingerprint, Calendar, Sparkles, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { UserProfileData } from "@/app/(platform)/_types";
import { getInitials, formatDate } from "@/lib/utils";

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

export function UserProfileCard({ user }: { user: UserProfileData }) {
  return (
    <Card className="relative overflow-hidden rounded-[2.5rem] border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <CardHeader className="pb-8 space-y-4">
        <div className="flex items-center gap-5">
          <div className="relative group">
            <Avatar className="h-20 w-20 rounded-[1.5rem] border border-white/10 shadow-2xl">
              <AvatarImage src={user.image ?? undefined} className="object-cover" />
              <AvatarFallback className="text-2xl font-black bg-primary/5 text-primary">
                {getInitials(user.name)}
              </AvatarFallback>
            </Avatar>
            <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-emerald-500 flex items-center justify-center border-2 border-black shadow-lg">
              <CheckCircle2 className="h-3.5 w-3.5 text-white" />
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
              <UserCircle className="h-3 w-3" />
              Resident Identity
            </div>
            <CardTitle className="text-3xl font-black tracking-tighter text-white uppercase leading-none">
              {user.name || "UNREGISTERED ENTITY"}
            </CardTitle>
            <p className="text-xs font-bold text-muted-foreground/60 tracking-tight">{user.email}</p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InfoRow
            label="Registry Verification"
            icon={Fingerprint}
            value={
              user.emailVerified ? (
                <div className="flex items-center gap-2 text-emerald-500">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-widest text-[10px]">Synchronized {formatDate(user.emailVerified)}</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 text-rose-500">
                  <Sparkles className="h-3.5 w-3.5" />
                  <span className="uppercase tracking-widest text-[10px]">Pending Orchestration</span>
                </div>
              )
            }
          />
          <InfoRow
            label="Onboarding Manifest"
            icon={ShieldCheck}
            value={
              user.onboardingComplete ? (
                <span className="text-emerald-500 uppercase tracking-widest text-[10px]">Validated</span>
              ) : (
                <span className="text-amber-500 uppercase tracking-widest text-[10px]">Incomplete</span>
              )
            }
          />
          <InfoRow
            label="Registry Entry"
            icon={Calendar}
            value={
              <span className="text-foreground uppercase tracking-widest text-[10px]">{formatDate(user.createdAt)}</span>
            }
          />
        </div>
      </CardContent>
    </Card>
  );
}

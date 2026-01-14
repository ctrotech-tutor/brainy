"use client";

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shield, ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

const roleStyles: Record<string, string> = {
  PLATFORM_ADMIN: "bg-rose-500/10 text-rose-500 border-rose-500/20",
  INSTITUTION_ADMIN: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
  STUDENT: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  TUTOR: "bg-violet-500/10 text-violet-500 border-violet-500/20",
  USER: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  FACULTY_ADMIN: "bg-indigo-500/10 text-indigo-500 border-indigo-500/20",
  DEPARTMENT_ADMIN: "bg-sky-500/10 text-sky-500 border-sky-500/20",
};

export function UserRolesCard({ roles }: { roles: string[] }) {
  return (
    <Card className="relative overflow-hidden rounded-[2.5rem] border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <CardHeader className="pb-6">
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
          <Shield className="h-3.5 w-3.5" />
          Authorization Manifest
        </div>
        <CardTitle className="text-xl font-black tracking-tighter text-white uppercase leading-none">
          Identity <span className="text-primary italic">Roles.</span>
        </CardTitle>
        <CardDescription className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-2 leading-relaxed">
          Active clearance levels synced with the global registry.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex flex-wrap gap-2">
          {roles.length > 0 ? (
            roles.map((role) => (
              <Badge
                key={role}
                variant="outline"
                className={cn("px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-full border shadow-sm", roleStyles[role] || roleStyles.USER)}
              >
                {role.replace(/_/g, " ")}
              </Badge>
            ))
          ) : (
            <div className="w-full p-4 rounded-xl border border-dashed border-white/10 text-center">
              <p className="text-[10px] font-bold text-muted-foreground/30 uppercase tracking-widest italic">No roles assigned.</p>
            </div>
          )}
        </div>

        <div className="pt-4 border-t border-white/5">
          <div className="flex items-center gap-2 mb-4 text-[9px] font-black uppercase tracking-widest text-muted-foreground/20">
            <Sparkles className="h-3 w-3" />
            Live permissions sync
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full rounded-xl border-white/10 bg-white/5 hover:bg-white/10 text-[10px] font-black uppercase tracking-widest h-10 gap-2 transition-all active:scale-95"
            onClick={() => {
              alert("Edit Permissions flow is managed via the directory manifest table.");
            }}
          >
            <ShieldCheck className="h-3.5 w-3.5" />
            Audit Permissions
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { userRoleEnum } from "@/db/schema";

// UI Imports
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { EditRolesModalProps } from "@/app/(platform)/_types";

const updateUserRoles = async ({
  userId,
  roles,
}: {
  userId: string;
  roles: string[];
}) => {
  const { data } = await axios.put(`/api/platform/users/${userId}/roles`, {
    roles,
  });
  return data;
};

export function EditRolesModal({
  open,
  onOpenChange,
  data: user,
  selectedRoles,
  onRolesChange,
}: EditRolesModalProps) {
  const queryClient = useQueryClient();

  const allRoles = (userRoleEnum?.enumValues as string[]) ?? [
    "USER",
    "STUDENT",
    "TUTOR",
    "INSTITUTION_ADMIN",
    "FACULTY_ADMIN",
    "DEPARTMENT_ADMIN",
    "PLATFORM_ADMIN",
  ];

  const { mutate: submitRoles, isPending } = useMutation({
    mutationFn: updateUserRoles,
    onSuccess: (data, variables) => {
      toast.success("Identity permissions synchronized.");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", variables.userId],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? "Protocol synchronization failed.");
    },
  });

  const handleRoleToggle = (role: string) => {
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    onRolesChange(newRoles);
  };

  const handleSubmit = () => {
    if (!user?.id) {
      toast.error("Identity context required.");
      return;
    }
    const rolesToSubmit = selectedRoles.length > 0 ? selectedRoles : ["USER"];
    submitRoles({ userId: user.id, roles: rolesToSubmit });
  };

  if (!open || !user) {
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-white/10 bg-black/60 backdrop-blur-2xl rounded-[2.5rem] shadow-2xl p-8 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
        <DialogHeader className="mb-8 p-0">
          <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px] mb-2">
            <ShieldCheck className="h-3 w-3" />
            Authorization Protocol
          </div>
          <DialogTitle className="text-2xl font-black tracking-tighter text-white uppercase leading-none">
            Edit <span className="text-primary italic">Permissions.</span>
          </DialogTitle>
          <DialogDescription className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest mt-2 leading-relaxed">
            Configure access levels for <span className="text-white italic">&quot;{user.name || user.email}&quot;</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-3 py-2">
          {allRoles.map((role) => (
            <div key={role} className="group flex items-center space-x-3 p-3 rounded-xl border border-white/5 bg-white/[0.02] transition-colors hover:bg-white/[0.05]">
              <Checkbox
                id={role}
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => handleRoleToggle(role)}
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <Label htmlFor={role} className="text-[10px] font-black uppercase tracking-widest cursor-pointer text-muted-foreground/60 group-hover:text-white transition-colors">
                {role.replace(/_/g, " ")}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter className="mt-8 pt-6 border-t border-white/5 gap-3 sm:justify-end">
          <div className="hidden sm:flex items-center gap-2 mr-auto text-[9px] font-black uppercase tracking-widest text-muted-foreground/20">
            <Sparkles className="h-3 w-3" />
            Live registry sync
          </div>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="rounded-xl hover:bg-white/5 text-[10px] font-black uppercase tracking-widest px-6"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isPending}
            className="rounded-xl bg-primary text-primary-foreground shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-[10px] font-black uppercase tracking-widest px-8"
          >
            {isPending ? (
              <Loader2 className="mr-2 h-3.5 w-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="mr-2 h-3.5 w-3.5" />
            )}
            Authorize
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

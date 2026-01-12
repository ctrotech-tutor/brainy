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
import { Loader2 } from "lucide-react";
import { EditRolesModalProps } from "@/app/(platform)/_types";

// --- 1. REVISED PROPS ---
// The modal is now a "controlled component".
// (Props interface is now imported)

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
  selectedRoles, // Receive the state
  onRolesChange, // Receive the state setter
}: EditRolesModalProps) {
  const queryClient = useQueryClient();

  // NO MORE useState or useEffect for roles! The component is now "dumb".

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
      toast.success("User roles updated successfully.");
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      queryClient.invalidateQueries({
        queryKey: ["user-profile", variables.userId],
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast.error(error?.response?.data?.error ?? "Failed to update roles.");
    },
  });

  const handleRoleToggle = (role: string) => {
    // Instead of setting local state, call the function from props.
    const newRoles = selectedRoles.includes(role)
      ? selectedRoles.filter((r) => r !== role)
      : [...selectedRoles, role];
    onRolesChange(newRoles);
  };

  const handleSubmit = () => {
    if (!user?.id) {
      toast.error("No user selected.");
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Roles for {user.name || user.email}</DialogTitle>
          <DialogDescription>
            Select roles to assign to this user.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-4 py-4">
          {allRoles.map((role) => (
            <div key={role} className="flex items-center space-x-2">
              <Checkbox
                id={role}
                // The `checked` state is now directly from props.
                checked={selectedRoles.includes(role)}
                onCheckedChange={() => handleRoleToggle(role)}
              />
              <Label htmlFor={role} className="text-sm font-medium capitalize">
                {role.replace(/_/g, " ").toLowerCase()}
              </Label>
            </div>
          ))}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending}>
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Save Changes
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
import { Shield } from "lucide-react";

// A map for styling role badges, consistent with our data table
const roleStyles: Record<string, string> = {
  PLATFORM_ADMIN: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
  INSTITUTION_ADMIN: "bg-primary text-primary-foreground hover:bg-primary/90",
  STUDENT: "bg-blue-500 text-white hover:bg-blue-500/90",
  TUTOR: "bg-green-500 text-white hover:bg-green-500/90",
  USER: "bg-gray-500 text-white hover:bg-gray-500/90",
  // Add other roles as needed
  FACULTY_ADMIN: "bg-purple-500 text-white hover:bg-purple-500/90",
  DEPARTMENT_ADMIN: "bg-indigo-500 text-white hover:bg-indigo-500/90",
};

export function UserRolesCard({ roles }: { roles: string[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="h-5 w-5" />
          User Roles
        </CardTitle>
        <CardDescription>
          The user&apos;s permissions are determined by these roles.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2 mb-4">
          {roles.length > 0 ? (
            roles.map((role) => (
              <Badge key={role} variant="secondary" className={roleStyles[role] || roleStyles.USER}>
                {role.replace(/_/g, " ").toLowerCase()}
              </Badge>
            ))
          ) : (
            <p className="text-sm text-muted-foreground italic">No roles assigned.</p>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full"
          onClick={() => {
            // TODO: Implement the "Edit Roles" modal
            alert("Edit Roles functionality to be implemented.");
          }}
        >
          Edit Roles
        </Button>
      </CardContent>
    </Card>
  );
}

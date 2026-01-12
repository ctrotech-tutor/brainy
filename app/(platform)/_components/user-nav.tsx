export const runtime = "nodejs";

import { validateRequest } from "@/lib/auth";
import { getUserRoles } from "@/lib/utils/roles";
import { UserNavClient } from "./usernav.client";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export async function UserNav() {
  // 1. Get the user on the server.
  const { user } = await validateRequest();

  // 2. If no user, render a simple Login button.
  if (!user) {
    return (
      <Button asChild variant="ghost">
        <Link href="/auth/login">Log In</Link>
      </Button>
    );
  }

  // 3. If there is a user, get their roles.
  const roles = await getUserRoles(user.id);
  const userWithRoles = { ...user, roles };

  // 4. Render the client component and pass the complete data.
  return <UserNavClient user={userWithRoles} />;
}

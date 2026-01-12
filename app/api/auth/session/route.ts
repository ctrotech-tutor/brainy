// app/api/auth/session/route.ts
import { NextResponse } from "next/server";
import { validateRequest } from "@/lib/auth";
import { getUserRoles } from "@/lib/utils/roles";
import { ApiResponses } from "@/lib/api-response";

export async function GET() {
  try {
    // 1. Use our existing server-side utility to validate the session.
    // This is fast and secure.
    const { user } = await validateRequest();

    // 2. If no user is found, return a 401 Unauthorized response.
    if (!user) {
      return ApiResponses.unauthorized();
    }

    // 3. If a user is found, fetch their roles using our roles utility.
    const roles = await getUserRoles(user.id);

    // 4. Return the user object combined with their roles.
    return ApiResponses.success({
      user: {
        ...user, // Spread all attributes from the Lucia user object
        roles,   // Add the roles array
      },
    });

  } catch (error) {
    return ApiResponses.handleError(error);
  }
}

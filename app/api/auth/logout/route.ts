// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { lucia, validateRequest } from "@/lib/auth";
import { setCookie } from "@/lib/cookie";
import { ApiResponses } from "@/lib/api-response";

export async function POST(): Promise<NextResponse> {
  try {
    // 1. Validate the current session
    const { session } = await validateRequest();

    if (!session) {
      // If there's no session, the user is already effectively logged out.
      // Return a success response.
      return ApiResponses.success({ success: true });
    }

    // 2. Invalidate the session in the database
    await lucia.invalidateSession(session.id);

    // 3. Create a blank session cookie to overwrite and clear the existing one
    const sessionCookie = lucia.createBlankSessionCookie();
    await setCookie(sessionCookie);

    // 4. Return success response
    return ApiResponses.success({ success: true });

  } catch (e) {
    // Handle any unexpected errors
    return ApiResponses.handleError(e);
  }
}

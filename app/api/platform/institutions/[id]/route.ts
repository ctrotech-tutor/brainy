// app/api/platform/institutions/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { institutions } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq } from "drizzle-orm";


export async function GET(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // --- 1. Authorization ---
    // Use our existing server-side utilities to ensure the user is an admin.
    // This is the most critical security check.
    const { user } = await validateRequest();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    // --- 2. Get ID from Context ---
    // The dynamic route parameter `[id]` is passed in the `context.params` object.
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Institution ID is required." }, { status: 400 });
    }

    // --- 3. Database Fetch ---
    // Perform the detailed database query directly using the validated ID.
    const institution = await db.query.institutions.findFirst({
      where: eq(institutions.id, id),
      with: {
        createdBy: {
          columns: {
            id: true,
            name: true,
            email: true,
            image: true,
          },
        },
        documents: {
          columns: {
            id: true,
            documentType: true,
            documentUrl: true,
            fileName: true,
          },
        },
      },
    });

    // --- 4. Handle Not Found ---
    // If the database query returns nothing, it's a 404.
    if (!institution) {
      return NextResponse.json({ error: "Institution not found." }, { status: 404 });
    }

    // --- 5. Success Response ---
    // If everything succeeds, return the data.
    return NextResponse.json(institution);

  } catch (error: unknown) {
    // Catch any unexpected errors, including authorization failures from the RoleGuard.
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    console.error("Failed to fetch institution details:", error);
    return NextResponse.json({ error: "An internal server error occurred." }, { status: 500 });
  }
}

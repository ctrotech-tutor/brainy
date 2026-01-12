// app/api/platform/users/[id]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest, 
    {params} : { params: Promise<{ id: string }> }
) {
  try {
    // --- 1. Authorization ---
    const { user: adminUser } = await requireAuth();
    await RoleGuard.requireRole(adminUser.id, "PLATFORM_ADMIN");

    // --- 2. Get ID from Context ---
    const { id } = await params;
    if (!id) {
      return NextResponse.json(
        { error: "User ID is required." },
        { status: 400 }
      );
    }

    // --- 3. Database Fetch ---
    // Fetch the user and all their related data in a single query
    const user = await db.query.users.findFirst({
      where: eq(users.id, id),
      columns: {
        id: true,
        name: true,
        email: true,
        image: true,
        emailVerified: true,
        onboardingComplete: true,
        createdAt: true,
      },
      with: {
        roles: {
          columns: {
            role: true,
          },
        },
        studentProfile: {
          with: {
            institution: {
              columns: {
                id: true,
                name: true,
              },
            },
            faculty: {
              columns: {
                id: true,
                name: true,
              },
            },
            department: {
              columns: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });

    // --- 4. Handle Not Found ---
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // --- 5. Success Response ---
    return NextResponse.json(user);
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch user details:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

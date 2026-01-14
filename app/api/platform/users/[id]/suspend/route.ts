// app/api/platform/users/[id]/suspend/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { users, auditLogs, sessions } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // --- 1. Authorization ---
    const { user: adminUser } = await requireAuth();
    if (!adminUser?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    
    await RoleGuard.requireRole(adminUser.id, "PLATFORM_ADMIN");

    // --- 2. Get Target User ID ---
    const { id: targetUserId } = await params;
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target User ID is required." },
        { status: 400 }
      );
    }

    // Prevent admin from suspending themselves
    if (targetUserId === adminUser.id) {
      return NextResponse.json(
        { error: "You cannot suspend your own account." },
        { status: 400 }
      );
    }

    // --- 3. Find the User ---
    const [targetUser] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.id, targetUserId))
      .limit(1);

    if (!targetUser) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // --- 4. Perform the Action ---
    // Invalidate all sessions for this user in the database
    await db.delete(sessions).where(eq(sessions.userId, targetUserId));

    // --- 5. Create Audit Log ---
    await db.insert(auditLogs).values({
      actorId: adminUser.id,
      action: "USER_SUSPENDED",
      resourceTable: "users",
      resourceId: targetUserId,
      payload: { targetUserId },
    });

    // --- 6. Success Response ---
    return NextResponse.json({
      success: true,
      message: "User has been suspended and all their sessions invalidated.",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to suspend user:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

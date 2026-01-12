// app/api/platform/users/[id]/roles/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { userRoles, userRoleEnum, auditLogs } from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq } from "drizzle-orm";
import { z } from "zod";

// Zod schema for validating the incoming request body
const updateRolesSchema = z.object({
  roles: z.array(z.enum(userRoleEnum.enumValues)).min(1, {
    message: "User must have at least one role (e.g., 'USER').",
  }),
});

export async function PUT(req: NextRequest, 
  { params }: { params: Promise<{ id: string }> }

) {
  try {
    // --- 1. Authorization & Validation ---
    const { user: adminUser } = await requireAuth();
    await RoleGuard.requireRole(adminUser.id, "PLATFORM_ADMIN");

    const { id: targetUserId } = await params;
    if (!targetUserId) {
      return NextResponse.json(
        { error: "Target User ID is required." },
        { status: 400 }
      );
    }

    const body = await req.json();
    console.log("--- API ROUTE RECEIVED ---");
    console.log("Request Body:", JSON.stringify(body, null, 2));
    console.log("Context Params:", await params);

    const validation = updateRolesSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input.", details: validation.error.issues },
        { status: 400 }
      );
    }
    const { roles: newRoles } = validation.data;

    // --- 2. Safety Checks ---
    // Prevent admin from removing their own PLATFORM_ADMIN role
    if (targetUserId === adminUser.id && !newRoles.includes("PLATFORM_ADMIN")) {
      return NextResponse.json(
        { error: "You cannot remove your own Platform Admin role." },
        { status: 400 }
      );
    }

    // --- 3. Transactional Database Update ---
    await db.transaction(async (tx) => {
      // Get the user's current roles for the audit log
      const currentRoles = await tx.query.userRoles.findMany({
        where: eq(userRoles.userId, targetUserId),
        columns: { role: true },
      });
      const currentRoleNames = currentRoles.map((r) => r.role);

      // Delete all existing roles for the user
      await tx.delete(userRoles).where(eq(userRoles.userId, targetUserId));

      // Insert the new set of roles
      if (newRoles.length > 0) {
        await tx.insert(userRoles).values(
          newRoles.map((role) => ({
            userId: targetUserId,
            role: role,
          }))
        );
      }

      // Create a detailed audit log
      await tx.insert(auditLogs).values({
        actorId: adminUser.id,
        action: "USER_ROLES_UPDATED",
        resourceTable: "users",
        resourceId: targetUserId,
        payload: {
          targetUserId,
          previousRoles: currentRoleNames,
          newRoles: newRoles,
        },
      });
    });

    // --- 4. Success Response ---
    return NextResponse.json({
      success: true,
      message: "User roles updated successfully.",
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to update user roles:", error);
    return NextResponse.json(
      { error: "An internal server error occurred." },
      { status: 500 }
    );
  }
}

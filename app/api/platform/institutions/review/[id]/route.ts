// app/api/platform/institutions/review/[id]/route.ts
export const runtime = "nodejs";

import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import {
  institutions,
  users,
  userRoles,
  institutionVerificationLogs,
  auditLogs,
} from "@/db/schema";
import { requireAuth } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq } from "drizzle-orm";
import { z } from "zod";


// --- Zod schema for validating the request body ---
const actionSchema = z.discriminatedUnion("action", [
  z.object({ action: z.literal("APPROVE") }),
  z.object({
    action: z.literal("REJECT"),
    reason: z
      .string()
      .min(10, "Rejection reason must be at least 10 characters."),
  }),
]);

export async function POST(req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  
  try {
    // 1. --- Authorization ---
    const { user: adminUser } = await requireAuth();
    await RoleGuard.requireRole(adminUser.id, "PLATFORM_ADMIN");

    const { id: institutionId } = await params;
    
    if (!institutionId) {
      return NextResponse.json(
        { error: "Institution ID is required." },
        { status: 400 }
      );
    }

    // 2. --- Input Validation ---
    const body = await req.json();
    const validation = actionSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid request body.", details: validation.error.issues },
        { status: 400 }
      );
    }
    const { action } = validation.data;

    // 3. --- Transactional Database Update ---
    // Using a transaction ensures all or nothing. If one step fails, all previous steps are rolled back.
    const result = await db.transaction(async (tx) => {
      // Find the institution and its creator
      const institution = await tx.query.institutions.findFirst({
        where: eq(institutions.id, institutionId),
        with: { createdBy: true },
      });

      if (!institution) {
        return { error: "Institution not found.", status: 404 };
      }

      if (!institution.createdBy) {
        return { error: "Institution submitter not found.", status: 404 };
      }

      const previousStatus = institution.status;
      let newStatus: typeof previousStatus;

      if (action === "APPROVE") {
        newStatus = "APPROVED";
        // Update institution status and set the approver
        await tx
          .update(institutions)
          .set({
            status: newStatus,
            approvedById: adminUser.id,
            approvedAt: new Date(),
          })
          .where(eq(institutions.id, institutionId));

        // Assign INSTITUTION_ADMIN role to the user who created it
        await tx
          .insert(userRoles)
          .values({
            userId: institution.createdBy.id,
            role: "INSTITUTION_ADMIN",
          })
          .onConflictDoNothing(); // Prevents error if role already exists

        // Mark the user's onboarding as complete
        await tx
          .update(users)
          .set({ onboardingComplete: true })
          .where(eq(users.id, institution.createdBy.id));
      } else {
        // action === "REJECT"
        newStatus = "REJECTED";
        const { reason } = validation.data; // Zod ensures reason exists here
        // Update institution status with rejection details
        await tx
          .update(institutions)
          .set({
            status: newStatus,
            rejectionReason: reason,
            approvedById: adminUser.id, // Log who rejected it
            approvedAt: new Date(), // Log when it was rejected
          })
          .where(eq(institutions.id, institutionId));
      }

      // 4. --- Auditing ---
      // Create a log entry for this action in institution-specific logs
      await tx.insert(institutionVerificationLogs).values({
        institutionId,
        action: action,
        performedById: adminUser.id,
        previousStatus,
        newStatus,
        notes:
          action === "REJECT"
            ? validation.data.reason
            : "Institution approved.",
      });

      // Also log to global audit logs
      await tx.insert(auditLogs).values({
        actorId: adminUser.id,
        action: `INSTITUTION_${action}ED`,
        resourceId: institutionId,
        resourceTable: "institutions",
        payload: {
          institutionId,
          institutionName: institution.name,
          previousStatus,
          newStatus,
          reason: action === "REJECT" ? validation.data.reason : undefined,
        },
      });

      // TODO: Send notification email to the user who submitted the application

      return {
        success: true,
        message: `Institution successfully ${action.toLowerCase()}ed.`,
      };
    }, { isolationLevel: "serializable" });

    // Handle transaction errors
    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: result.status }
      );
    }

    return NextResponse.json({
      success: result.success,
      message: result.message,
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Forbidden")) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }
    if (error instanceof Error && error.message.includes("Unauthorized")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    console.error("Failed to fetch institutions:", error);
    return NextResponse.json(
      { error: "An error occurred while fetching institutions." },
      { status: 500 }
    );
  }
}

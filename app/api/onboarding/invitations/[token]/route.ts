import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { tutorInvitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { hasAnyRole } from "@/lib/utils/roles";

// ============================================
// GET /api/invitations/[token] - Get invitation details
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const invitationDetails = await db.query.tutorInvitations.findFirst({
      where: eq(tutorInvitations.token, token),
      with: {
        institution: {
          columns: { name: true },
        },
        inviter: {
          columns: { name: true, email: true },
        },
      },
    });

    if (!invitationDetails) {
      return NextResponse.json(
        { error: "Invitation not found" },
        { status: 404 }
      );
    }

    if (invitationDetails.status !== "PENDING") {
      return NextResponse.json(
        {
          error: "This invitation has already been processed.",
          status: invitationDetails.status,
        },
        { status: 410 }
      );
    }

    if (new Date(invitationDetails.expiresAt) < new Date()) {
      return NextResponse.json(
        { error: "This invitation has expired.", status: "EXPIRED" },
        { status: 410 }
      );
    }

    return NextResponse.json({
      email: invitationDetails.email,
      institutionName:
        invitationDetails.institution?.name ?? "Unknown Institution",
      inviterName:
        invitationDetails.inviter?.name ??
        invitationDetails.inviter?.email ??
        "Brainy Admin",
      expiresAt: invitationDetails.expiresAt,
      status: invitationDetails.status,
    });
  } catch (error) {
    console.error("[GET_INVITATION_ERROR]", error);
    return NextResponse.json(
      { error: "Failed to fetch invitation details." },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/invitations/[token] - Revoke invitation (admin only)
// ============================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const { user } = await requireAuth();

    const isAdmin = await hasAnyRole(user.id, [
      "INSTITUTION_ADMIN",
      "FACULTY_ADMIN",
      "PLATFORM_ADMIN",
    ]);

    if (!isAdmin) {
      return NextResponse.json(
        {
          error:
            "Forbidden: You do not have permission to revoke invitations.",
        },
        { status: 403 }
      );
    }

    const [invitation] = await db
      .select({ id: tutorInvitations.id })
      .from(tutorInvitations)
      .where(eq(tutorInvitations.token, token))
      .limit(1);

    if (!invitation) {
      return NextResponse.json(
        { error: "Invitation not found." },
        { status: 404 }
      );
    }

    await db
      .update(tutorInvitations)
      .set({ status: "REVOKED" })
      .where(eq(tutorInvitations.id, invitation.id));

    return NextResponse.json({
      success: true,
      message: "Invitation has been successfully revoked.",
    });
  } catch (error) {
    console.error("[REVOKE_INVITATION_ERROR]", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: "Failed to revoke invitation." },
      { status: 500 }
    );
  }
}

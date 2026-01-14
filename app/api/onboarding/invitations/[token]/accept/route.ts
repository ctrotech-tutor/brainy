import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { db } from "@/db";
import { tutorInvitations, users, userRoles } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";

// ============================================
// POST /api/onboarding/invitations/[token]/accept
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  const { token } = await params;

  try {
    const { user } = await requireAuth();

    const [invitation] = await db
      .select()
      .from(tutorInvitations)
      .where(
        and(
          eq(tutorInvitations.token, token),
          eq(tutorInvitations.status, "PENDING"),
          gt(tutorInvitations.expires, new Date())
        )
      )
      .limit(1);

    if (!invitation) {
      return NextResponse.json(
        {
          error:
            "This invitation is invalid, has expired, or has already been used.",
        },
        { status: 400 }
      );
    }

    if (user.email.toLowerCase() !== invitation.email.toLowerCase()) {
      return NextResponse.json(
        {
          error: "This invitation is for a different email address.",
          details: `This invitation was sent to ${invitation.email}, but you are logged in as ${user.email}.`,
        },
        { status: 403 }
      );
    }

    await db.transaction(async (tx) => {
      await tx
        .insert(userRoles)
        .values({
          userId: user.id,
          role: "TUTOR",
        })
        .onConflictDoNothing();

      await tx
        .update(tutorInvitations)
        .set({ status: "ACCEPTED" })
        .where(eq(tutorInvitations.id, invitation.id));

      if (!user.onboardingComplete) {
        await tx
          .update(users)
          .set({
            onboardingComplete: true,
            updatedAt: new Date(),
          })
          .where(eq(users.id, user.id));
      }
    });

    return NextResponse.json({
      success: true,
      message:
        "Invitation accepted! You have been granted tutor privileges.",
      redirectTo: "/dashboard",
    });
  } catch (error) {
    console.error("[ACCEPT_INVITATION_ERROR]", error);

    if (error instanceof Error && error.message === "Unauthorized") {
      return NextResponse.json(
        {
          error: "You must be logged in to accept an invitation.",
          requiresAuth: true,
        },
        { status: 401 }
      );
    }

    return NextResponse.json(
      {
        error:
          "An unexpected error occurred while accepting the invitation.",
      },
      { status: 500 }
    );
  }
}

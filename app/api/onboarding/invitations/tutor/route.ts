import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasAnyRole } from "@/lib/utils/roles";
import { db } from "@/db";
import { tutorInvitations } from "@/db/schema";
import { eq, and } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { user } = await requireAuth();

    // Only admins
    const isAdmin = await hasAnyRole(user.id, [
      "INSTITUTION_ADMIN",
      "FACULTY_ADMIN",
      "PLATFORM_ADMIN",
    ]);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Only admins can view invitations" },
        { status: 403 }
      );
    }

    const url = new URL(req.url);
    const institutionId = url.searchParams.get("institutionId");
    const status = url.searchParams.get("status");

    // Collect filters
    const filters: any[] = [];
    if (institutionId) filters.push(eq(tutorInvitations.institutionId, institutionId));
    if (status) filters.push(eq(tutorInvitations.status, status as any));

    // Query with relations
    const invitations = await db.query.tutorInvitations.findMany({
      where: filters.length > 0 ? and(...filters) : undefined,
      with: {
        institution: {
          columns: { name: true },
        },
        inviter: {
          columns: { name: true, email: true },
        },
      },
    });

    return NextResponse.json({
      invitations,
      total: invitations.length,
    });
  } catch (error) {
    console.error("List invitations error:", error);
    return NextResponse.json(
      { error: "Failed to fetch invitations" },
      { status: 500 }
    );
  }
}

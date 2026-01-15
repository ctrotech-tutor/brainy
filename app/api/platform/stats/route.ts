import { NextResponse } from "next/server";
import { db } from "@/db";
import { institutions, users, studentProfiles, marketingLeads } from "@/db/schema";
import { validateRequest } from "@/lib/auth";
import { RoleGuard } from "@/lib/utils/roles";
import { eq, count, isNotNull, and, isNull } from "drizzle-orm";
import { ApiResponses } from "@/lib/api-response";

export async function GET() {
  try {
    const { user } = await validateRequest();
    if (!user) {
      return ApiResponses.unauthorized();
    }

    await RoleGuard.requireRole(user.id, "PLATFORM_ADMIN");

    const [pendingInstitutions, activeInstitutions, totalUsers, totalStudents, unreadLeads] =
      await Promise.all([
        db
          .select({ value: count() })
          .from(institutions)
          .where(eq(institutions.status, "PENDING")),

        db
          .select({ value: count() })
          .from(institutions)
          .where(eq(institutions.status, "ACTIVE")),

        db.select({ value: count() }).from(users),

        db
          .select({ value: count() })
          .from(studentProfiles)
          .where(isNotNull(studentProfiles.verifiedAt)),

        db
          .select({ value: count() })
          .from(marketingLeads)
          .where(and(isNull(marketingLeads.repliedAt), isNull(marketingLeads.seenAt))),
      ]);

    return ApiResponses.success({
      pendingInstitutions: pendingInstitutions[0].value,
      activeInstitutions: activeInstitutions[0].value,
      totalUsers: totalUsers[0].value,
      totalStudents: totalStudents[0].value,
      unreadLeads: unreadLeads[0].value,
    });
  } catch (error) {
    return ApiResponses.handleError(error);
  }
}

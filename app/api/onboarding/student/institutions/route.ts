// src/app/api/onboarding/student/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { institutions } from "@/db/schema";
import { inArray } from "drizzle-orm";

// ============================================
// GET /api/onboarding/student/institutions - List verified institutions
// ============================================
// This GET handler is already excellent. No changes needed.
export async function GET(req: NextRequest) {
  try {
    const verifiedInstitutions = await db
      .select({
        id: institutions.id,
        name: institutions.name,
      })
      .from(institutions)
      .where(inArray(institutions.status, ["APPROVED", "ACTIVE"]));

    // Format for the Combobox component
    const formattedInstitutions = verifiedInstitutions.map(inst => ({
      value: inst.id,
      label: inst.name,
    }));

    return NextResponse.json({
      institutions: formattedInstitutions,
    });
  } catch (error) {
    console.error("Failed to fetch institutions:", error);
    return NextResponse.json({ error: "Failed to fetch institutions" }, { status: 500 });
  }
}
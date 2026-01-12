// src/app/api/institutions/[id]/faculties/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasAnyRole } from "@/lib/utils/roles";
import { db } from "@/db";
import { faculties, institutions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
// ============================================

// ============================================
// VALIDATION SCHEMA
// ============================================

const createFacultySchema = z.object({
  name: z.string().min(3, "Faculty name must be at least 3 characters"),
  description: z.string().optional(),   // optional
  code: z.string().min(1, "Faculty code is required"), // code is required in DB
  adminId: z.string().optional(),
  coverImage: z.string().optional(),
  logo: z.string().optional(),
});


// ============================================
// GET /api/institutions/[id]/faculties - List faculties
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const { user } = await requireAuth();
    const { id: institutionId } = await params;
    // Verify institution exists and is active
    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!institution) {
      return NextResponse.json(
        { error: "Institution not found" },
        { status: 404 }
      );
    }

    // Get all faculties for this institution
    const facultyList = await db
      .select()
      .from(faculties)
      .where(eq(faculties.institutionId, institutionId));

    return NextResponse.json({
      faculties: facultyList,
      total: facultyList.length,
    });
  } catch (error) {
    console.error("List faculties error:", error);
    return NextResponse.json(
      { error: "Failed to fetch faculties" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/institutions/[id]/faculties - Create faculty
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id: institutionId } = await params;
    const body = await req.json();

    // Check permissions
    const isAdmin = await hasAnyRole(user.id, [
      "INSTITUTION_ADMIN",
      "PLATFORM_ADMIN",
    ]);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Only admins can create faculties" },
        { status: 403 }
      );
    }

    // Validate input
    const validation = createFacultySchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, description, code, adminId, coverImage, logo } = validation.data;

    // Verify institution exists
    const [institution] = await db
      .select()
      .from(institutions)
      .where(eq(institutions.id, institutionId))
      .limit(1);

    if (!institution) {
      return NextResponse.json(
        { error: "Institution not found" },
        { status: 404 }
      );
    }

    // Check if institution is active
    if (institution.status !== "ACTIVE" && institution.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Institution must be active to create faculties" },
        { status: 400 }
      );
    }

    // Create faculty
    const [newFaculty] = await db
  .insert(faculties)
  .values({
    name,
    code,
    institutionId,
    description: description ?? null,
    adminId: adminId ?? null,
    coverImage: coverImage ?? null,
    logo: logo ?? null,
  })
  .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "FACULTY_CREATED",
      resourceTable: "faculty",
      resourceId: newFaculty.id,
      metadata: {
        facultyName: name,
        institutionId,
        institutionName: institution.name,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Faculty created successfully",
        faculty: newFaculty,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create faculty error:", error);
    return NextResponse.json(
      { error: "Failed to create faculty" },
      { status: 500 }
    );
  }
}

// src/app/api/faculties/[id]/departments/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasAnyRole } from "@/lib/utils/roles";
import { db } from "@/db";
import { departments, faculties, institutions, auditLogs } from "@/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
// ============================================

const createDepartmentSchema = z.object({
  name: z.string().min(3, "Department name must be at least 3 characters"),
  description: z.string().optional(),
  code: z.string().optional(),
  adminId: z.string().optional(),
});

// ============================================
// GET /api/faculties/[id]/departments - List departments
// ============================================

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // const { user } = await requireAuth();
    const { id: facultyId } = await params;
    // Verify faculty exists
    const [faculty] = await db
      .select()
      .from(faculties)
      .where(eq(faculties.id, facultyId))
      .limit(1);

    if (!faculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    // Get all departments for this faculty
    const departmentList = await db
      .select()
      .from(departments)
      .where(eq(departments.facultyId, facultyId));

    return NextResponse.json({
      departments: departmentList,
      total: departmentList.length,
    });
  } catch (error) {
    console.error("List departments error:", error);
    return NextResponse.json(
      { error: "Failed to fetch departments" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/faculties/[id]/departments - Create department
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id: facultyId } = await params;
    const body = await req.json();

    // Check permissions
    const isAdmin = await hasAnyRole(user.id, [
      "INSTITUTION_ADMIN",
      "FACULTY_ADMIN",
      "PLATFORM_ADMIN",
    ]);

    if (!isAdmin) {
      return NextResponse.json(
        { error: "Forbidden: Only admins can create departments" },
        { status: 403 }
      );
    }

    // Validate input
    const validation = createDepartmentSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { name, description, code, adminId } = validation.data;

    // Verify faculty exists and get institution details
    const [faculty] = await db
      .select({
        faculty: faculties,
        institution: institutions,
      })
      .from(faculties)
      .leftJoin(institutions, eq(faculties.institutionId, institutions.id))
      .where(eq(faculties.id, facultyId))
      .limit(1);

    if (!faculty) {
      return NextResponse.json(
        { error: "Faculty not found" },
        { status: 404 }
      );
    }

    // Create department
    const [newDepartment] = await db
      .insert(departments)
      .values({
        name,
        description: description || null,
        code: code || null,
        facultyId,
        adminId: adminId || null,
      })
      .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "DEPARTMENT_CREATED",
      resourceTable: "department",
      resourceId: newDepartment.id,
      // metadata: {
      //   departmentName: name,
      //   facultyId,
      //   facultyName: faculty.faculty.name,
      //   institutionId: faculty.faculty.institutionId,
      // },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Department created successfully",
        department: newDepartment,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create department error:", error);
    return NextResponse.json(
      { error: "Failed to create department" },
      { status: 500 }
    );
  }
}
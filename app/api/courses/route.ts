// src/app/api/courses/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasAnyRole } from "@/lib/utils/roles";
import { db } from "@/db";
import { courses, departments, faculties, institutions, auditLogs } from "@/db/schema";
import { eq, and, desc, like, or } from "drizzle-orm";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
// ============================================

const createCourseSchema = z.object({
  code: z.string().min(2, "Course code must be at least 2 characters"),
  title: z.string().min(3, "Course title must be at least 3 characters"),
  description: z.string().optional(),
  institutionId: z.string().min(1, "Institution is required"),
  departmentId: z.string().optional(),
});

// ============================================
// GET /api/courses - List courses
// ============================================

export async function GET(req: NextRequest) {
  try {
    // const { user } = await requireAuth();
    const url = new URL(req.url);
    
    const institutionId = url.searchParams.get("institutionId");
    const departmentId = url.searchParams.get("departmentId");
    const search = url.searchParams.get("search");
    const page = parseInt(url.searchParams.get("page") || "1");
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const offset = (page - 1) * limit;

    // Build query
    let query = db
      .select({
        course: courses,
        department: {
          id: departments.id,
          name: departments.name,
        },
        faculty: {
          id: faculties.id,
          name: faculties.name,
        },
        institution: {
          id: institutions.id,
          name: institutions.name,
        },
      })
      .from(courses)
      .leftJoin(departments, eq(courses.departmentId, departments.id))
      .leftJoin(faculties, eq(departments.facultyId, faculties.id))
      .leftJoin(institutions, eq(courses.institutionId, institutions.id))
      .$dynamic();

    // Apply filters
    const conditions = [];
    
    if (institutionId) {
      conditions.push(eq(courses.institutionId, institutionId));
    }
    
    if (departmentId) {
      conditions.push(eq(courses.departmentId, departmentId));
    }
    
    if (search) {
      conditions.push(
        or(
          like(courses.title, `%${search}%`),
          like(courses.code, `%${search}%`)
        )
      );
    }

    // Only show active courses
    conditions.push(eq(courses.isActive, true));

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    // Get paginated results
    const results = await query
      .orderBy(desc(courses.createdAt))
      .limit(limit)
      .offset(offset);

    // Get total count (simplified)
    const totalResults = await query;

    return NextResponse.json({
      courses: results.map(r => ({
        ...r.course,
        department: r.department,
        faculty: r.faculty,
        institution: r.institution,
      })),
      pagination: {
        page,
        limit,
        total: totalResults.length,
        totalPages: Math.ceil(totalResults.length / limit),
      },
    });
  } catch (error) {
    console.error("List courses error:", error);
    return NextResponse.json(
      { error: "Failed to fetch courses" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/courses - Create course
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    // Check permissions
    const canCreate = await hasAnyRole(user.id, [
      "TUTOR",
      "DEPARTMENT_ADMIN",
      "FACULTY_ADMIN",
      "INSTITUTION_ADMIN",
      "PLATFORM_ADMIN",
    ]);

    if (!canCreate) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to create courses" },
        { status: 403 }
      );
    }

    // Validate input
    const validation = createCourseSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const { code, title, description, institutionId, departmentId } = validation.data;

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

    if (institution.status !== "ACTIVE" && institution.status !== "APPROVED") {
      return NextResponse.json(
        { error: "Institution must be active to create courses" },
        { status: 400 }
      );
    }

    // If departmentId provided, verify it exists
    if (departmentId) {
      const [department] = await db
        .select()
        .from(departments)
        .where(eq(departments.id, departmentId))
        .limit(1);

      if (!department) {
        return NextResponse.json(
          { error: "Department not found" },
          { status: 404 }
        );
      }
    }

    // Check for duplicate course code in the same institution
    const [existingCourse] = await db
      .select()
      .from(courses)
      .where(
        and(
          eq(courses.code, code.toUpperCase()),
          eq(courses.institutionId, institutionId),
          departmentId ? eq(courses.departmentId, departmentId) : undefined
        )
      )
      .limit(1);

    if (existingCourse) {
      return NextResponse.json(
        { error: "A course with this code already exists in this institution/department" },
        { status: 409 }
      );
    }

    // Create course
    const [newCourse] = await db
      .insert(courses)
      .values({
        code: code.toUpperCase(),
        title,
        description: description || null,
        institutionId,
        departmentId: departmentId || null,
        createdById: user.id,
        isActive: true,
      })
      .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "COURSE_CREATED",
      resourceTable: "course",
      resourceId: newCourse.id,
      metadata: {
        courseCode: code,
        courseTitle: title,
        institutionId,
        departmentId,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Course created successfully",
        course: newCourse,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create course error:", error);
    return NextResponse.json(
      { error: "Failed to create course" },
      { status: 500 }
    );
  }
}
// src/app/api/courses/[id]/enroll/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasRole } from "@/lib/utils/roles";
import { db } from "@/db";
import { courses, courseEnrollments, auditLogs } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// ============================================
// POST /api/courses/[id]/enroll - Enroll in course
// ============================================

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id: courseId } = await params;
    // Check if user is a student
    const isStudent = await hasRole(user.id, "STUDENT");
    if (!isStudent) {
      return NextResponse.json(
        { error: "Only students can enroll in courses" },
        { status: 403 }
      );
    }

    // Verify course exists and is active
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, courseId))
      .limit(1);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    if (!course.isActive) {
      return NextResponse.json(
        { error: "This course is not currently available for enrollment" },
        { status: 400 }
      );
    }

    // Check if already enrolled
    const [existingEnrollment] = await db
      .select()
      .from(courseEnrollments)
      .where(
        and(
          eq(courseEnrollments.courseId, courseId),
          eq(courseEnrollments.studentProfileId, user.id)
        )
      )
      .limit(1);

    if (existingEnrollment) {
      return NextResponse.json(
        { error: "You are already enrolled in this course" },
        { status: 409 }
      );
    }

    // Create enrollment
    await db.insert(courseEnrollments).values({
      courseId,
      studentProfileId: user.id,
    });

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "COURSE_ENROLLED",
      resourceTable: "course",
      resourceId: courseId,
      // metadata: {
      //   courseCode: course.code,
      //   courseTitle: course.title,
      // },
    });

    return NextResponse.json({
      success: true,
      message: "Successfully enrolled in course",
    });
  } catch (error) {
    console.error("Course enrollment error:", error);
    return NextResponse.json(
      { error: "Failed to enroll in course" },
      { status: 500 }
    );
  }
}

// ============================================
// DELETE /api/courses/[id]/enroll - Unenroll from course
// ============================================

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { user } = await requireAuth();
    const { id: courseId } = await params;
    // Delete enrollment
    const deleted = await db
      .delete(courseEnrollments)
      .where(
        and(
          eq(courseEnrollments.courseId, courseId),
          eq(courseEnrollments.studentProfileId, user.id)
        )
      )
      .returning();

    if (deleted.length === 0) {
      return NextResponse.json(
        { error: "You are not enrolled in this course" },
        { status: 404 }
      );
    }

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "COURSE_UNENROLLED",
      resourceTable: "course",
      resourceId: courseId,
    });

    return NextResponse.json({
      success: true,
      message: "Successfully unenrolled from course",
    });
  } catch (error) {
    console.error("Course unenrollment error:", error);
    return NextResponse.json(
      { error: "Failed to unenroll from course" },
      { status: 500 }
    );
  }
}
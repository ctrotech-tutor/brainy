// src/app/api/quizzes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { requireAuth } from "@/lib/auth";
import { hasAnyRole } from "@/lib/utils/roles";
import { db } from "@/db";
import { quizzes, courses, auditLogs } from "@/db/schema";
import { eq, desc, and, or, like } from "drizzle-orm";
import { z } from "zod";

// ============================================
// VALIDATION SCHEMA
// ============================================

const createQuizSchema = z.object({
  title: z.string().min(3, "Quiz title must be at least 3 characters"),
  description: z.string().optional(),
  courseId: z.string().min(1, "Course is required"),
  duration: z.number().int().positive().optional(),
  attemptsAllowed: z.number().int().positive().default(1),
  passingScore: z.number().int().min(0).max(100).optional(),
  shuffleQuestions: z.boolean().default(false),
  showResults: z.boolean().default(true),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

// ============================================
// GET /api/quizzes - List quizzes
// ============================================

export async function GET(req: NextRequest) {
  try {
    // const { user } = await requireAuth();
    const url = new URL(req.url);

    const courseId = url.searchParams.get("courseId");
    const status = url.searchParams.get("status");
    const search = url.searchParams.get("search");

    // Build query
    let query = db
      .select({
        quiz: quizzes,
        course: {
          id: courses.id,
          code: courses.code,
          title: courses.title,
        },
      })
      .from(quizzes)
      .leftJoin(courses, eq(quizzes.courseId, courses.id))
      .$dynamic();

    const conditions = [];

    if (courseId) {
      conditions.push(eq(quizzes.courseId, courseId));
    }

    if (status) {
      conditions.push(eq(quizzes.status, status as any));
    }

    if (search) {
      conditions.push(
        or(
          like(quizzes.title, `%${search}%`),
          like(quizzes.description, `%${search}%`)
        )
      );
    }

    if (conditions.length > 0) {
      query = query.where(and(...conditions));
    }

    const results = await query.orderBy(desc(quizzes.createdAt));

    return NextResponse.json({
      quizzes: results.map((r) => ({
        ...r.quiz,
        course: r.course,
      })),
      total: results.length,
    });
  } catch (error) {
    console.error("List quizzes error:", error);
    return NextResponse.json(
      { error: "Failed to fetch quizzes" },
      { status: 500 }
    );
  }
}

// ============================================
// POST /api/quizzes - Create quiz
// ============================================

export async function POST(req: NextRequest) {
  try {
    const { user } = await requireAuth();
    const body = await req.json();

    // Check permissions (tutors and above can create quizzes)
    const canCreate = await hasAnyRole(user.id, [
      "TUTOR",
      "DEPARTMENT_ADMIN",
      "FACULTY_ADMIN",
      "INSTITUTION_ADMIN",
      "PLATFORM_ADMIN",
    ]);

    if (!canCreate) {
      return NextResponse.json(
        { error: "Forbidden: You don't have permission to create quizzes" },
        { status: 403 }
      );
    }

    // Validate input
    const validation = createQuizSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json(
        { error: "Invalid input", details: validation.error.issues },
        { status: 400 }
      );
    }

    const data = validation.data;

    // Verify course exists
    const [course] = await db
      .select()
      .from(courses)
      .where(eq(courses.id, data.courseId))
      .limit(1);

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Validate dates if provided
    if (data.startDate && data.endDate) {
      if (new Date(data.startDate) >= new Date(data.endDate)) {
        return NextResponse.json(
          { error: "End date must be after start date" },
          { status: 400 }
        );
      }
    }

    // Create quiz
    const [newQuiz] = await db
      .insert(quizzes)
      .values({
        title: data.title,
        description: data.description || null,
        courseId: data.courseId,
        authorId: user.id,
        duration: data.duration || null,
        attemptsAllowed: data.attemptsAllowed,
        passingScore: data.passingScore || null,
        shuffleQuestions: data.shuffleQuestions,
        showResults: data.showResults,
        startDate: data.startDate ? new Date(data.startDate) : null,
        endDate: data.endDate ? new Date(data.endDate) : null,
        status: "DRAFT",
      })
      .returning();

    // Create audit log
    await db.insert(auditLogs).values({
      actorId: user.id,
      action: "QUIZ_CREATED",
      resourceTable: "quiz",
      resourceId: newQuiz.id,
      metadata: {
        quizTitle: data.title,
        courseId: data.courseId,
        courseCode: course.code,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Quiz created successfully",
        quiz: newQuiz,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create quiz error:", error);
    return NextResponse.json(
      { error: "Failed to create quiz" },
      { status: 500 }
    );
  }
}
// app/api/onboarding/student/academic-units/route.ts
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { faculties, departments } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const institutionId = searchParams.get("institutionId");
    const facultyId = searchParams.get("facultyId");

    // Fetch faculties for a given institution
    if (institutionId) {
      const facultyList = await db
        .select({ id: faculties.id, name: faculties.name })
        .from(faculties)
        .where(eq(faculties.institutionId, institutionId));
      
      const formatted = facultyList.map(f => ({ value: f.id, label: f.name }));
      return NextResponse.json(formatted);
    }

    // Fetch departments for a given faculty
    if (facultyId) {
      const departmentList = await db
        .select({ id: departments.id, name: departments.name })
        .from(departments)
        .where(eq(departments.facultyId, facultyId));
        
      const formatted = departmentList.map(d => ({ value: d.id, label: d.name }));
      return NextResponse.json(formatted);
    }

    return NextResponse.json({ error: "Missing required query parameter" }, { status: 400 });

  } catch (error) {
    console.error("Failed to fetch academic units:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

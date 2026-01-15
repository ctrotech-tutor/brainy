// app/(platform)/platform/legal/_actions/legal-actions.ts
"use server";

import { db } from "@/db";
import { legalDocuments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { redirect } from "next/navigation";

export async function upsertLegalDocument(data: {
  id?: string;
  slug: string;
  title: string;
  content: string;
  version: string;
  isPublished: boolean;
}) {
  const session = await auth();
  if (!session?.user || !(session.user as any).roles.includes("PLATFORM_ADMIN")) {
    throw new Error("Unauthorized");
  }

  const userId = session.user.id;
  if (!userId) throw new Error("User ID not found");

  const docData = {
    slug: data.slug.toLowerCase().trim().replace(/\s+/g, "-"),
    title: data.title,
    content: data.content,
    version: data.version,
    isPublished: data.isPublished,
    updatedById: userId,
    lastUpdated: new Date(),
  };

  if (data.id && data.id !== "new") {
    // Update
    await db.update(legalDocuments)
      .set(docData)
      .where(eq(legalDocuments.id, data.id));
  } else {
    // Insert
    await db.insert(legalDocuments).values({
      ...docData,
    });
  }

  revalidatePath("/platform/legal");
  revalidatePath("/(legal)/[slug]", "layout");
  redirect("/platform/legal");
}

export async function deleteLegalDocument(id: string) {
    const session = await auth();
    if (!session?.user || !(session.user as any).roles.includes("PLATFORM_ADMIN")) {
      throw new Error("Unauthorized");
    }

    await db.delete(legalDocuments).where(eq(legalDocuments.id, id));

    revalidatePath("/platform/legal");
    revalidatePath("/(legal)/[slug]", "layout");
}

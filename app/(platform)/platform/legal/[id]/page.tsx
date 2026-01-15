// app/(platform)/platform/legal/[id]/page.tsx
import { db } from "@/db";
import { legalDocuments } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { LegalEditor } from "../_components/LegalEditor";

interface EditLegalDocumentPageProps {
    params: Promise<{ id: string }>;
}

export default async function EditLegalDocumentPage({ params }: EditLegalDocumentPageProps) {
    const { id } = await params;

    const doc = await db.query.legalDocuments.findFirst({
        where: eq(legalDocuments.id, id),
    });

    if (!doc) {
        notFound();
    }

    return (
        <LegalEditor
            initialData={{
                id: doc.id,
                slug: doc.slug,
                title: doc.title,
                content: doc.content,
                version: doc.version,
                isPublished: doc.isPublished,
            }}
        />
    );
}

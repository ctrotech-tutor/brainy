// app/(platform)/institutions/review/[id]/_components/documents-card.tsx
import Link from "next/link";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Download } from "lucide-react";

// This type should match the 'documents' array from our API response
type Document = {
  id: string;
  documentType: string;
  documentUrl: string;
};

interface DocumentsCardProps {
  documents: Document[];
}

export function DocumentsCard({ documents }: DocumentsCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Supporting Documents</CardTitle>
        <CardDescription>
          Documents uploaded by the applicant for verification.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {documents && documents.length > 0 ? (
          <ul className="grid gap-3">
            {documents.map((doc) => (
              <li key={doc.id} className="flex items-center justify-between rounded-lg border p-3">
                <div className="flex items-center gap-3">
                  <FileText className="h-6 w-6 text-muted-foreground" />
                  <div className="grid gap-0.5">
                    <span className="font-medium">
                      {doc.documentType.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      Click to view/download
                    </span>
                  </div>
                </div>
                <Link href={doc.documentUrl} target="_blank" rel="noopener noreferrer" aria-label={`Download ${doc.documentType}`}>
                  <Download className="h-5 w-5 text-primary hover:text-primary/80" />
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          // --- Empty State ---
          <div className="flex h-24 items-center justify-center rounded-lg border-2 border-dashed">
            <p className="text-sm text-muted-foreground">No documents were uploaded.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

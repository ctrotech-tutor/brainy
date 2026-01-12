// app/(platform)/platform/institutions/review/[id]/page.tsx
import { Metadata } from "next";
import InstitutionReviewClient from "./InstitutionReviewClient";

export const metadata: Metadata = {
  title: "Review Institution",
  description: "Review institution application details",
};

export default function InstitutionReviewPage() {
  return <InstitutionReviewClient />;
}

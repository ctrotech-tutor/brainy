// app/(platform)/platform/institutions/page.tsx
import { Metadata } from "next";
import AllInstitutionsClient from "./AllInstitutionsClient";

export const metadata: Metadata = {
  title: "All Institutions",
  description: "View and filter all registered institutions",
};

export default function AllInstitutionsPage() {
  return <AllInstitutionsClient />;
}

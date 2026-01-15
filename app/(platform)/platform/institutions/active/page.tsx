// app/(platform)/platform/institutions/active/page.tsx
import { Metadata } from "next";
import ActiveInstitutionsClient from "./ActiveInstitutionsClient";

export const metadata: Metadata = {
    title: "Active Institutions",
    description: "View all approved and active institutions",
};

export default function ActiveInstitutionsPage() {
    return <ActiveInstitutionsClient />;
}

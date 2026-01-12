// app/(onboarding)/onboarding/student/details/page.tsx
import { Metadata } from "next";
import StudentDetailsClient from "./StudentDetailsClient";

export const metadata: Metadata = {
  title: "Student Details",
  description: "Create your student profile",
};

export default function StudentDetailsPage() {
  return <StudentDetailsClient />;
}

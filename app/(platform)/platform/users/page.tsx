// app/(platform)/platform/users/page.tsx
import { Metadata } from "next";
import UsersClient from "./UsersClient";

export const metadata: Metadata = {
  title: "All Users",
  description: "Manage platform users",
};

export default function AllUsersPage() {
  return <UsersClient />;
}

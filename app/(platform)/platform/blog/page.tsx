// app/(platform)/platform/blog/page.tsx
import { Metadata } from "next";
import BlogManagementClient from "./BlogManagementClient";

export const metadata: Metadata = {
    title: "Blog Management",
    description: "Manage blog posts, categories, and content",
};

export default function BlogManagementPage() {
    return <BlogManagementClient />;
}

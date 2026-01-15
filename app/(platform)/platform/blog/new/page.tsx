// app/(platform)/platform/blog/new/page.tsx
import { Metadata } from "next";
import BlogEditorClient from "../_components/BlogEditorClient";

export const metadata: Metadata = {
    title: "Create New Blog Post",
    description: "Create a new blog post for Brainy OS",
};

export default function NewBlogPostPage() {
    return <BlogEditorClient mode="create" />;
}

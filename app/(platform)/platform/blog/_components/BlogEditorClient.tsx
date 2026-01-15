// app/(platform)/platform/blog/_components/BlogEditorClient.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";
import { ArrowLeft, Save, Eye, Loader2, FileText } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ImageUpload } from "./ImageUpload";

interface BlogEditorClientProps {
    mode: "create" | "edit";
    post?: any;
}

export default function BlogEditorClient({ mode, post }: BlogEditorClientProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        title: post?.title || "",
        slug: post?.slug || "",
        excerpt: post?.excerpt || "",
        content: post?.content || "",
        coverImage: post?.coverImage || "",
        metaTitle: post?.metaTitle || "",
        metaDescription: post?.metaDescription || "",
        status: post?.status || "DRAFT",
    });

    const createMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const response = await axios.post("/api/platform/blog", data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Blog post created successfully!");
            router.push("/platform/blog");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to create blog post");
        },
    });

    const updateMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            const response = await axios.patch(`/api/platform/blog/${post.id}`, data);
            return response.data;
        },
        onSuccess: () => {
            toast.success("Blog post updated successfully!");
            router.push("/platform/blog");
        },
        onError: (error: any) => {
            toast.error(error.response?.data?.error || "Failed to update blog post");
        },
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (mode === "create") {
            createMutation.mutate(formData);
        } else {
            updateMutation.mutate(formData);
        }
    };

    const handleChange = (field: string, value: string) => {
        setFormData((prev) => ({ ...prev, [field]: value }));

        // Auto-generate slug from title
        if (field === "title" && mode === "create") {
            const slug = value
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, "-")
                .replace(/^-|-$/g, "");
            setFormData((prev) => ({ ...prev, slug }));
        }
    };

    const isLoading = createMutation.isPending || updateMutation.isPending;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="space-y-3">
                    <Link
                        href="/platform/blog"
                        className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors text-sm font-bold"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Back to Blog Management
                    </Link>
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <FileText className="h-3 w-3" />
                        {mode === "create" ? "New Post" : "Edit Post"}
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        {mode === "create" ? "Create" : "Edit"}{" "}
                        <span className="text-primary italic">Post.</span>
                    </h1>
                </div>
            </div>

            {/* Editor Form */}
            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="grid gap-8 lg:grid-cols-3">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Title */}
                        <div className="space-y-2">
                            <Label htmlFor="title" className="text-xs font-black uppercase tracking-widest">
                                Title *
                            </Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => handleChange("title", e.target.value)}
                                placeholder="Enter post title..."
                                className="text-lg font-bold"
                                required
                            />
                        </div>

                        {/* Slug */}
                        <div className="space-y-2">
                            <Label htmlFor="slug" className="text-xs font-black uppercase tracking-widest">
                                Slug *
                            </Label>
                            <Input
                                id="slug"
                                value={formData.slug}
                                onChange={(e) => handleChange("slug", e.target.value)}
                                placeholder="post-url-slug"
                                className="font-mono text-sm"
                                required
                            />
                            <p className="text-xs text-muted-foreground">
                                URL: /blog/{formData.slug || "your-slug"}
                            </p>
                        </div>

                        {/* Excerpt */}
                        <div className="space-y-2">
                            <Label htmlFor="excerpt" className="text-xs font-black uppercase tracking-widest">
                                Excerpt *
                            </Label>
                            <Textarea
                                id="excerpt"
                                value={formData.excerpt}
                                onChange={(e) => handleChange("excerpt", e.target.value)}
                                placeholder="Brief description of the post..."
                                rows={3}
                                required
                            />
                        </div>

                        {/* Content with Preview */}
                        <div className="space-y-2">
                            <Label className="text-xs font-black uppercase tracking-widest">
                                Content * (Markdown)
                            </Label>
                            <Tabs defaultValue="write" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="write">Write</TabsTrigger>
                                    <TabsTrigger value="preview">Preview</TabsTrigger>
                                </TabsList>
                                <TabsContent value="write" className="mt-4">
                                    <Textarea
                                        value={formData.content}
                                        onChange={(e) => handleChange("content", e.target.value)}
                                        placeholder="Write your post content in markdown..."
                                        rows={20}
                                        className="font-mono text-sm"
                                        required
                                    />
                                </TabsContent>
                                <TabsContent value="preview" className="mt-4">
                                    <div className="min-h-[500px] rounded-2xl border border-border bg-card p-8">
                                        <article className="prose prose-lg dark:prose-invert max-w-none">
                                            <ReactMarkdown remarkPlugins={[remarkGfm]}>
                                                {formData.content || "*No content yet...*"}
                                            </ReactMarkdown>
                                        </article>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Status */}
                        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest">Publishing</h3>
                            <div className="space-y-2">
                                <Label htmlFor="status" className="text-xs">Status</Label>
                                <Select
                                    value={formData.status}
                                    onValueChange={(value) => handleChange("status", value)}
                                >
                                    <SelectTrigger id="status">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="DRAFT">Draft</SelectItem>
                                        <SelectItem value="PUBLISHED">Published</SelectItem>
                                        <SelectItem value="ARCHIVED">Archived</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        {/* Cover Image */}
                        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest">Featured Image</h3>
                            <Tabs defaultValue="upload" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="upload">Upload</TabsTrigger>
                                    <TabsTrigger value="url">URL</TabsTrigger>
                                </TabsList>
                                <TabsContent value="upload" className="mt-4">
                                    <ImageUpload
                                        value={formData.coverImage}
                                        onChange={(url) => handleChange("coverImage", url)}
                                        onRemove={() => handleChange("coverImage", "")}
                                    />
                                </TabsContent>
                                <TabsContent value="url" className="mt-4 space-y-2">
                                    <Label htmlFor="coverImageUrl" className="text-xs">Image URL</Label>
                                    <Input
                                        id="coverImageUrl"
                                        value={formData.coverImage}
                                        onChange={(e) => handleChange("coverImage", e.target.value)}
                                        placeholder="https://example.com/image.jpg"
                                        type="url"
                                    />
                                    {formData.coverImage && (
                                        <div className="relative aspect-video rounded-xl overflow-hidden border border-border mt-4">
                                            <img
                                                src={formData.coverImage}
                                                alt="Cover preview"
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                </TabsContent>
                            </Tabs>
                        </div>

                        {/* SEO */}
                        <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
                            <h3 className="text-xs font-black uppercase tracking-widest">SEO Metadata</h3>
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="metaTitle" className="text-xs">Meta Title</Label>
                                    <Input
                                        id="metaTitle"
                                        value={formData.metaTitle}
                                        onChange={(e) => handleChange("metaTitle", e.target.value)}
                                        placeholder="Leave empty to use post title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="metaDescription" className="text-xs">Meta Description</Label>
                                    <Textarea
                                        id="metaDescription"
                                        value={formData.metaDescription}
                                        onChange={(e) => handleChange("metaDescription", e.target.value)}
                                        placeholder="Leave empty to use excerpt"
                                        rows={3}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="space-y-3">
                            <Button
                                type="submit"
                                disabled={isLoading}
                                className="w-full rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 transition-all active:scale-95 text-[10px] font-black uppercase tracking-widest h-12 gap-2"
                            >
                                {isLoading ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <Save className="h-4 w-4" />
                                )}
                                {mode === "create" ? "Create Post" : "Update Post"}
                            </Button>
                            {mode === "edit" && formData.status === "PUBLISHED" && (
                                <Button
                                    type="button"
                                    variant="outline"
                                    asChild
                                    className="w-full rounded-xl"
                                >
                                    <Link href={`/blog/${post.slug}`} target="_blank">
                                        <Eye className="h-4 w-4 mr-2" />
                                        View Live Post
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
}

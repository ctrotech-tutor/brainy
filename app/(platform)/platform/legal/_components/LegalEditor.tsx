// app/(platform)/platform/legal/_components/LegalEditor.tsx
"use client";

import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import {
    Save,
    Eye,
    Code,
    Type,
    Link as LinkIcon,
    History,
    CheckCircle2,
    ArrowLeft,
    Settings2
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { upsertLegalDocument } from "../_actions/legal-actions";
import { toast } from "sonner";

// UI Components
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface LegalEditorProps {
    initialData?: {
        id: string;
        slug: string;
        title: string;
        content: string;
        version: string;
        isPublished: boolean;
    };
}

export function LegalEditor({ initialData }: LegalEditorProps) {
    const router = useRouter();
    const [isSaving, setIsSaving] = useState(false);
    const [activeTab, setActiveTab] = useState("editor");

    const [formData, setFormData] = useState({
        id: initialData?.id || "new",
        title: initialData?.title || "",
        slug: initialData?.slug || "",
        content: initialData?.content || "",
        version: initialData?.version || "1.0",
        isPublished: initialData?.isPublished || false,
    });

    // Auto-generate slug from title if not manually edited
    useEffect(() => {
        if (!initialData?.slug && formData.title) {
            const generatedSlug = formData.title
                .toLowerCase()
                .trim()
                .replace(/[^\w\s-]/g, "")
                .replace(/\s+/g, "-");
            setFormData(prev => ({ ...prev, slug: generatedSlug }));
        }
    }, [formData.title, initialData?.slug]);

    const handleSave = async () => {
        if (!formData.title || !formData.slug || !formData.content) {
            toast.error("Please fill in all required fields");
            return;
        }

        setIsSaving(true);
        try {
            await upsertLegalDocument(formData);
            toast.success(formData.id === "new" ? "Document created" : "Document updated");
            router.push("/platform/legal");
        } catch (error) {
            toast.error("Failed to save document");
            console.error(error);
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="flex flex-col gap-6">
            {/* Top Bar */}
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" asChild className="rounded-full hover:bg-accent transition-colors">
                        <Link href="/platform/legal">
                            <ArrowLeft className="h-5 w-5" />
                        </Link>
                    </Button>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight text-foreground">
                            {formData.id === "new" ? "Create New Policy" : `Edit: ${formData.title}`}
                        </h1>
                        <p className="text-sm text-muted-foreground italic">
                            {formData.id === "new" ? "Drafting new platform legal content" : `Last edited version v${formData.version}`}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 mr-4 border-r border-border pr-4">
                        <Label htmlFor="published-toggle" className="text-sm font-medium cursor-pointer">
                            Published
                        </Label>
                        <Switch
                            id="published-toggle"
                            checked={formData.isPublished}
                            onCheckedChange={(checked) => setFormData(prev => ({ ...prev, isPublished: checked }))}
                        />
                    </div>
                    <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all"
                    >
                        <Save className="h-4 w-4" />
                        {isSaving ? "Saving..." : "Save Document"}
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Sidebar Settings */}
                <div className="lg:col-span-1 space-y-6">
                    <Card className="border-border bg-card/50 backdrop-blur-xl shadow-xl">
                        <CardContent className="pt-6 space-y-4">
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <Type className="h-3 w-3" /> Document Title
                                </Label>
                                <Input
                                    value={formData.title}
                                    onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                    placeholder="Terms of Service"
                                    className="border-border bg-card"
                                />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <LinkIcon className="h-3 w-3" /> URL Slug
                                </Label>
                                <div className="relative">
                                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground/50 text-xs">/legal/</span>
                                    <Input
                                        value={formData.slug}
                                        onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                                        className="pl-14 border-border bg-card text-xs font-mono"
                                        placeholder="privacy-policy"
                                    />
                                </div>
                            </div>
                            <div className="space-y-3">
                                <Label className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                                    <History className="h-3 w-3" /> Version Control
                                </Label>
                                <Input
                                    value={formData.version}
                                    onChange={(e) => setFormData(prev => ({ ...prev, version: e.target.value }))}
                                    className="border-border bg-card font-mono text-center"
                                    placeholder="1.0.0"
                                />
                            </div>
                            <div className="pt-4 border-t border-border">
                                <div className="p-3 rounded-lg bg-accent text-primary border border-border">
                                    <div className="flex items-center gap-2 text-primary font-bold text-xs mb-1">
                                        <CheckCircle2 className="h-3 w-3" /> Status Insight
                                    </div>
                                    <p className="text-[10px] text-muted-foreground leading-relaxed">
                                        {formData.isPublished
                                            ? "This document will be live and accessible to all users at /legal/" + (formData.slug || "...")
                                            : "This is a private draft. Only administrators can see this in the preview mode."
                                        }
                                    </p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Editor / Preview Area */}
                <div className="lg:col-span-3">
                    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                        <div className="flex items-center justify-between mb-2">
                            <TabsList className="bg-card border border-border">
                                <TabsTrigger value="editor" className="gap-2 data-[state=active]:bg-primary transition-all">
                                    <Code className="h-3.5 w-3.5" />
                                    Editor
                                </TabsTrigger>
                                <TabsTrigger value="preview" className="gap-2 data-[state=active]:bg-primary transition-all">
                                    <Eye className="h-3.5 w-3.5" />
                                    Live Preview
                                </TabsTrigger>
                            </TabsList>
                            <div className="text-[10px] text-muted-foreground flex items-center gap-2">
                                <Settings2 className="h-3 w-3" /> Markdown Supported
                            </div>
                        </div>

                        <Card className="border-border bg-card/50 backdrop-blur-xl shadow-2xl min-h-[600px] overflow-hidden">
                            <TabsContent value="editor" className="mt-0 p-0 h-full border-none outline-none ring-0">
                                <Textarea
                                    value={formData.content}
                                    onChange={(e) => setFormData(prev => ({ ...prev, content: e.target.value }))}
                                    placeholder="# Start typing your policy content here...&#10;&#10;Use markdown to style your text. Header, lists, and bold text are all supported."
                                    className="min-h-[600px] w-full resize-none border-none bg-transparent p-8 font-mono text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0 scrollbar-thin scrollbar-thumb-accent"
                                />
                            </TabsContent>
                            <TabsContent value="preview" className="mt-0 p-8 h-full min-h-[600px] prose prose-invert prose-slate max-w-none">
                                {formData.content ? (
                                    <ReactMarkdown
                                        remarkPlugins={[remarkGfm]}
                                        components={{
                                            h1: ({ node, ...props }) => <h1 className="text-3xl font-bold mb-6 text-foreground border-b border-border pb-4" {...props} />,
                                            h2: ({ node, ...props }) => <h2 className="text-xl font-bold mt-8 mb-4 text-primary" {...props} />,
                                            p: ({ node, ...props }) => <p className="text-muted-foreground leading-relaxed mb-4" {...props} />,
                                            ul: ({ node, ...props }) => <ul className="list-disc pl-6 mb-4 space-y-2 text-muted-foreground" {...props} />,
                                            strong: ({ node, ...props }) => <strong className="text-foreground font-semibold" {...props} />,
                                        }}
                                    >
                                        {formData.content}
                                    </ReactMarkdown>
                                ) : (
                                    <div className="flex flex-col items-center justify-center h-full py-20 text-muted-foreground pointer-events-none opacity-50">
                                        <Eye className="h-12 w-12 mb-4" />
                                        <p>Nothing to preview yet. Start writing in the editor tab.</p>
                                    </div>
                                )}
                            </TabsContent>
                        </Card>
                    </Tabs>
                </div>
            </div>
        </div>
    );
}

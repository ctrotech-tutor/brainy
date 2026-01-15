// app/(platform)/platform/blog/_components/ImageUpload.tsx
"use client";

import { useState, useRef } from "react";
import { Upload, X, Loader2, Image as ImageIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import axios from "axios";

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    onRemove?: () => void;
}

export function ImageUpload({ value, onChange, onRemove }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith("image/")) {
            toast.error("Please select an image file");
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            toast.error("Image size must be less than 5MB");
            return;
        }

        setIsUploading(true);

        try {
            const formData = new FormData();
            formData.append("file", file);

            const response = await axios.post("/api/upload", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.data.success) {
                onChange(response.data.url);
                toast.success("Image uploaded successfully!");
            } else {
                throw new Error("Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("Failed to upload image");
        } finally {
            setIsUploading(false);
            if (fileInputRef.current) {
                fileInputRef.current.value = "";
            }
        }
    };

    return (
        <div className="space-y-4">
            <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                disabled={isUploading}
            />

            {value ? (
                <div className="relative group">
                    <div className="relative aspect-video rounded-xl overflow-hidden border border-border">
                        <img
                            src={value}
                            alt="Cover preview"
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                            <Button
                                type="button"
                                size="sm"
                                variant="secondary"
                                onClick={() => fileInputRef.current?.click()}
                                disabled={isUploading}
                            >
                                <Upload className="h-4 w-4 mr-2" />
                                Change
                            </Button>
                            {onRemove && (
                                <Button
                                    type="button"
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => {
                                        onRemove();
                                        onChange("");
                                    }}
                                    disabled={isUploading}
                                >
                                    <X className="h-4 w-4 mr-2" />
                                    Remove
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            ) : (
                <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="relative w-full aspect-video rounded-xl border-2 border-dashed border-border hover:border-primary transition-colors flex flex-col items-center justify-center gap-3 bg-card hover:bg-accent/50 group"
                >
                    {isUploading ? (
                        <>
                            <Loader2 className="h-12 w-12 text-primary animate-spin" />
                            <p className="text-sm font-medium text-muted-foreground">
                                Uploading...
                            </p>
                        </>
                    ) : (
                        <>
                            <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                <ImageIcon className="h-8 w-8 text-primary" />
                            </div>
                            <div className="text-center">
                                <p className="text-sm font-bold text-foreground">
                                    Click to upload cover image
                                </p>
                                <p className="text-xs text-muted-foreground mt-1">
                                    PNG, JPG, WEBP up to 5MB
                                </p>
                            </div>
                        </>
                    )}
                </button>
            )}
        </div>
    );
}

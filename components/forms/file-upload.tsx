"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, Trash, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface FileUploadProps {
    onChange: (value: string) => void;
    value: string;
    onRemove: (value: string) => void;
    label?: string;
}

export function FileUpload({ onChange, value, onRemove, label = "Upload Image" }: FileUploadProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const onUpload = useCallback((result: any) => {
        // secure_url is the standard return from Cloudinary
        onChange(result.info.secure_url);

        // --- FIX: SCROLL LOCK ISSUE ---
        // Sometimes the Cloudinary widget doesn't clean up the body style
        // especially if the component unmounts quickly.
        document.body.style.overflow = "auto";
    }, [onChange]);

    if (!mounted) {
        return (
            <div className="h-32 w-full flex items-center justify-center border-2 border-dashed border-white/10 rounded-xl bg-white/5">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
        );
    }

    if (value) {
        return (
            <div className="relative mb-4 flex items-center gap-4">
                <div className="relative h-[200px] w-[200px] overflow-hidden rounded-xl border border-white/10">
                    <div className="absolute right-2 top-2 z-10">
                        <Button
                            type="button"
                            onClick={() => onRemove(value)}
                            variant="destructive"
                            size="icon"
                            className="h-8 w-8 rounded-full"
                        >
                            <Trash className="h-4 w-4" />
                        </Button>
                    </div>
                    <Image
                        fill
                        className="object-cover"
                        alt="Uploaded Image"
                        src={value}
                        unoptimized // Bypass Next.js optimization for Cloudinary images
                    />
                </div>
            </div>
        );
    }

    return (
        <CldUploadWidget
            onSuccess={onUpload}
            uploadPreset={process.env.CLOUDINARY_UPLOAD_PRESET || "brainy"}
            options={{
                maxFiles: 1,
                resourceType: "image",
                clientAllowedFormats: ["png", "jpeg", "jpg", "webp"],
                maxFileSize: 5000000, // 5MB
                sources: ['local', 'url', 'camera'],
                styles: {
                    palette: {
                        window: "#000000",
                        sourceBg: "#000000",
                        windowBorder: "#333333",
                        tabIcon: "#FFFFFF",
                        inactiveTabIcon: "#888888",
                        menuIcons: "#FFFFFF",
                        link: "#FFFFFF",
                        action: "#3399CC", // Primary Color
                        inProgress: "#0078FF",
                        complete: "#20B832",
                        error: "#FF4444",
                        textDark: "#000000",
                        textLight: "#FFFFFF"
                    },
                }
            }}
        >
            {({ open }) => {
                const onClick = () => {
                    open();
                };

                return (
                    <Button
                        type="button"
                        variant="outline"
                        className="w-full border-dashed p-8 h-32 flex flex-col items-center justify-center gap-2 text-muted-foreground hover:bg-white/5 hover:text-foreground transition-all border-white/10"
                        onClick={onClick}
                    >
                        <ImagePlus className="h-8 w-8 text-primary/60" />
                        <div className="flex flex-col items-center gap-1">
                            <span className="font-black text-[10px] uppercase tracking-widest">{label}</span>
                            <span className="text-[9px] text-muted-foreground/50 font-medium">Supports JPG, PNG, WEBP (Max 5MB)</span>
                        </div>
                    </Button>
                );
            }}
        </CldUploadWidget>
    );
}

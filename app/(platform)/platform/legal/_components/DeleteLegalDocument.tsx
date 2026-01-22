"use client";

import { useState } from "react";
import { deleteLegalDocument } from "../_actions/legal-actions";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteLegalDocumentProps {
    documentId: string;
    documentTitle: string;
}

export function DeleteLegalDocument({ documentId, documentTitle }: DeleteLegalDocumentProps) {
    const [isDeleting, setIsDeleting] = useState(false);
    const [showDialog, setShowDialog] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteLegalDocument(documentId);
            toast.success("Legal document deleted successfully");
            setShowDialog(false);
        } catch (error) {
            toast.error("Failed to delete document");
            console.error(error);
        } finally {
            setIsDeleting(false);
        }
    };

    return (
        <>
            <div
                onClick={() => setShowDialog(true)}
                className="w-full flex items-center gap-2 px-2 py-1.5"
            >
                <Trash2 className="h-3.5 w-3.5" />
                Archive
            </div>

            <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
                <AlertDialogContent className="bg-card border-border">
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <span className="font-bold text-foreground">{documentTitle}</span>.
                            This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isDeleting ? "Deleting..." : "Delete Document"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}

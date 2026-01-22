"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import { verifySubscriber } from "@/app/_actions/newsletter-actions";
import { Loader2, CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Wrapper } from "@/components/ui/wrapper";

function VerifyContent() {
    const searchParams = useSearchParams();
    const token = searchParams.get("token");
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your subscription...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link.");
            return;
        }

        verifySubscriber(token)
            .then((result) => {
                if (result.success) {
                    setStatus("success");
                    setMessage(result.message || "Subscription confirmed!");
                } else {
                    setStatus("error");
                    setMessage(result.error || "Verification failed.");
                }
            })
            .catch(() => {
                setStatus("error");
                setMessage("An unexpected error occurred.");
            });
    }, [token]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] text-center space-y-6">
            {status === "loading" && (
                <>
                    <Loader2 className="h-16 w-16 text-primary animate-spin" />
                    <h1 className="text-2xl font-bold">Verifying...</h1>
                    <p className="text-muted-foreground">{message}</p>
                </>
            )}

            {status === "success" && (
                <>
                    <div className="h-20 w-20 rounded-full bg-emerald-500/10 flex items-center justify-center text-emerald-500 mb-2">
                        <CheckCircle2 className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black">All set!</h1>
                    <p className="text-muted-foreground max-w-md mx-auto text-lg">{message}</p>
                    <Button asChild className="mt-4" size="lg">
                        <Link href="/">Back to Home</Link>
                    </Button>
                </>
            )}

            {status === "error" && (
                <>
                    <div className="h-20 w-20 rounded-full bg-destructive/10 flex items-center justify-center text-destructive mb-2">
                        <XCircle className="h-10 w-10" />
                    </div>
                    <h1 className="text-3xl font-black">Verification Failed</h1>
                    <p className="text-muted-foreground max-w-md mx-auto text-lg">{message}</p>
                    <Button asChild variant="secondary" className="mt-4" size="lg">
                        <Link href="/">Return Home</Link>
                    </Button>
                </>
            )}
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="pt-32 pb-20">
            <Wrapper>
                <Suspense fallback={<div className="flex justify-center p-20"><Loader2 className="animate-spin" /></div>}>
                    <VerifyContent />
                </Suspense>
            </Wrapper>
        </div>
    );
}

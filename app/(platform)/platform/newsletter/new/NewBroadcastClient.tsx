"use client";

import { useTransition, useState } from "react";
import { useRouter } from "next/navigation";
import { sendTestBroadcast, sendBroadcast } from "@/app/_actions/newsletter-actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Send, LayoutTemplate, ArrowLeft, Megaphone, Info, Mail } from "lucide-react";
import Link from "next/link";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";

export default function NewBroadcastClient() {
    const router = useRouter();
    const [isPending, startTransition] = useTransition();
    const [subject, setSubject] = useState("");
    const [content, setContent] = useState("");

    const handleSendTest = async () => {
        if (!subject || !content) {
            toast.error("Please fill in both subject and content.");
            return;
        }

        startTransition(async () => {
            const result = await sendTestBroadcast(subject, content);
            if (result.success) {
                toast.success("Test email sent to your inbox.");
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleBroadcast = async () => {
        if (!subject || !content) {
            toast.error("Please fill in both subject and content.");
            return;
        }

        if (!confirm("Are you sure you want to send this to ALL active subscribers? This action cannot be undone.")) {
            return;
        }

        startTransition(async () => {
            const result = await sendBroadcast(subject, content);
            if (result.success) {
                toast.success("Broadcast initiated successfully!");
                router.push("/platform/newsletter");
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="space-y-10">
            {/* Standard "Advanced" Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-3">
                    <Button variant="ghost" size="sm" asChild className="pl-0 -ml-3 mb-2 text-muted-foreground hover:text-foreground">
                        <Link href="/platform/newsletter">
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Back to History
                        </Link>
                    </Button>
                    <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
                        <Megaphone className="h-3 w-3" />
                        Broadcast Channel
                    </div>
                    <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-foreground leading-none">
                        New <span className="text-primary italic">Broadcast.</span>
                    </h1>
                    <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
                        Compose and transmit global announcements to the subscriber base.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Editor Column */}
                <div className="lg:col-span-2 space-y-6">
                    <Card className="rounded-[2.5rem] bg-card/40 border-white/5 overflow-hidden shadow-xl shadow-primary/5 py-0">
                        <CardHeader className="bg-white/5 border-b border-white/5 px-8 py-4">
                            <CardTitle className="flex items-center gap-2 text-lg font-black tracking-tight">
                                <LayoutTemplate className="h-5 w-5 text-primary" />
                                Composer
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="p-8 space-y-8">
                            <div className="space-y-3">
                                <Label htmlFor="subject" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Subject Line</Label>
                                <Input
                                    id="subject"
                                    placeholder="e.g., Monthly Product Update: Brainy v2.0"
                                    className="h-14 rounded-xl bg-card border-white/10 text-lg px-4 focus-visible:ring-primary/20"
                                    value={subject}
                                    onChange={(e) => setSubject(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>

                            <Separator className="bg-white/5" />

                            <div className="space-y-3">
                                <Label htmlFor="content" className="text-xs font-black uppercase tracking-widest text-muted-foreground">Message Content (HTML)</Label>
                                <Textarea
                                    id="content"
                                    placeholder="<p>Hello Subscribers,</p>..."
                                    className="min-h-[200px] rounded-xl bg-card border-white/10 font-mono text-sm leading-relaxed p-6 resize-none focus-visible:ring-primary/20"
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                    disabled={isPending}
                                />
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Sidebar Column */}
                <div className="space-y-6">
                    {/* Actions Card */}
                    <Card className="rounded-[2rem] border-white/5 bg-gradient-to-br from-card/50 to-card/10 backdrop-blur-sm sticky top-6">
                        <CardHeader>
                            <CardTitle className="text-sm font-black uppercase tracking-widest">Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <Button
                                variant="outline"
                                className="h-12 w-full rounded-xl gap-2 font-bold bg-transparent border-white/10 hover:bg-white/5"
                                onClick={handleSendTest}
                                disabled={isPending}
                            >
                                <Mail className="h-4 w-4" />
                                Send Test Email
                            </Button>
                            <Button
                                className="h-12 w-full rounded-xl gap-2 font-black shadow-xl shadow-primary/20 text-xs uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all"
                                onClick={handleBroadcast}
                                disabled={isPending}
                            >
                                {isPending ? "Transmitting..." : "Broadcast Now"}
                                <Send className="h-3.5 w-3.5" />
                            </Button>
                            <p className="text-[10px] text-center text-muted-foreground/60 px-4">
                                By clicking broadcast, this message will be queued for immediate delivery to all active subscribers.
                            </p>
                        </CardContent>
                    </Card>

                    {/* Guidelines Card */}
                    <Card className="rounded-[2rem] border-white/5 bg-card/20">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2 text-sm font-black uppercase tracking-widest text-muted-foreground">
                                <Info className="h-4 w-4" />
                                Guidelines
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
                            <p>
                                <strong className="text-foreground">HTML Support:</strong> Use standard tags like <code className="bg-white/10 px-1 py-0.5 rounded text-primary">h1</code>, <code className="bg-white/10 px-1 py-0.5 rounded text-primary">p</code>, and <code className="bg-white/10 px-1 py-0.5 rounded text-primary">a</code>.
                            </p>
                            <p>
                                <strong className="text-foreground">Variables:</strong> Currently, no personalization variables (e.g., name) are supported in this version.
                            </p>
                            <p>
                                <strong className="text-foreground">Images:</strong> Host images externally and use the <code className="bg-white/10 px-1 py-0.5 rounded text-primary">img src</code> tag.
                            </p>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

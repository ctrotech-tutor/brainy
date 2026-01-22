// app/(platform)/platform/leads/[id]/LeadDetailClient.tsx
"use client";

import { useState, useTransition } from "react";
import {
    Building2,
    Mail,
    MessageSquare,
    Clock,
    ChevronLeft,
    CheckCircle2,
    AlertCircle,
    Archive,
    Send,
    User,
    ExternalLink,
    ShieldCheck,
    Zap,
    Tag
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { updateLeadStatus, submitLeadReply } from "@/app/(platform)/_actions/lead-actions";
import { cn } from "@/lib/utils";

export interface ReplyEntry {
    content: string;
    sentAt: string;
    sentBy: string;
}

export interface Lead {
    id: string;
    name: string;
    email: string;
    subject: string | null;
    message: string;
    type: string;
    status: string;
    metadata: any;
    repliedAt: Date | null;
    replyThread: ReplyEntry[] | null;
    createdAt: Date;
}

interface LeadDetailClientProps {
    lead: Lead;
}

export function LeadDetailClient({ lead: initialLead }: LeadDetailClientProps) {
    const [lead, setLead] = useState(initialLead);
    const [replyContent, setReplyContent] = useState("");
    const [isPending, startTransition] = useTransition();

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "READ": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "REPLIED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "ARCHIVED": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
            default: return "";
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        startTransition(async () => {
            const result = await updateLeadStatus(lead.id, newStatus);
            if (result.success) {
                setLead(prev => ({ ...prev, status: newStatus }));
                toast.success(`Lead status updated to ${newStatus}`);
            } else {
                toast.error(result.error);
            }
        });
    };

    const handleReplySubmit = async () => {
        if (!replyContent.trim() || replyContent.length < 5) {
            toast.error("Reply content is too short.");
            return;
        }

        startTransition(async () => {
            const result = await submitLeadReply(lead.id, replyContent);
            if (result.success) {
                toast.success("Reply sent and logged.");
                setReplyContent("");
                setLead(prev => ({
                    ...prev,
                    status: "REPLIED",
                    replyThread: [...(prev.replyThread || []), {
                        content: replyContent,
                        sentAt: new Date().toISOString(),
                        sentBy: "You (Platform Admin)"
                    }]
                }));
            } else {
                toast.error(result.error);
            }
        });
    };

    return (
        <div className="flex flex-col gap-8 max-w-[1400px] mx-auto pb-20">
            {/* Immersive Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-accent" asChild>
                        <Link href="/platform/leads">
                            <ChevronLeft className="h-6 w-6 text-muted-foreground" />
                        </Link>
                    </Button>
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <h1 className="text-4xl font-black tracking-tighter text-foreground">Process Discovery</h1>
                            <Badge className={cn("rounded-xl font-black uppercase text-[10px] tracking-[0.2em] px-3", getStatusColor(lead.status))}>
                                {lead.status}
                            </Badge>
                        </div>
                        <p className="text-muted-foreground font-medium flex items-center gap-2">
                            Lead ID: <span className="font-mono text-xs opacity-50 bg-muted px-2 py-0.5 rounded">{lead.id}</span>
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Button
                        variant="outline"
                        className="h-12 rounded-xl bg-card border-border gap-2 font-bold px-5"
                        onClick={() => handleStatusUpdate("READ")}
                        disabled={isPending || lead.status === "READ"}
                    >
                        <AlertCircle className="h-4 w-4 text-blue-500" />
                        Mark as Read
                    </Button>
                    <Button
                        variant="outline"
                        className="h-12 rounded-xl bg-card border-border gap-2 font-bold px-5"
                        onClick={() => handleStatusUpdate("ARCHIVED")}
                        disabled={isPending || lead.status === "ARCHIVED"}
                    >
                        <Archive className="h-4 w-4 text-slate-500" />
                        Archive
                    </Button>
                    <Separator orientation="vertical" className="h-8 bg-border mx-2" />
                    <Button className="h-12 rounded-xl font-black gap-2 shadow-xl shadow-primary/20 px-8" asChild>
                        <a href={`mailto:${lead.email}`}>
                            <ExternalLink className="h-4 w-4" />
                            Open in Mail.app
                        </a>
                    </Button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                {/* Left Column: Lead Info & Original Inquiry */}
                <div className="lg:col-span-4 space-y-8">
                    <Card className="rounded-[2.5rem] bg-card/40 border-border backdrop-blur-3xl overflow-hidden">
                        <CardHeader className="p-10 pb-0">
                            <div className="h-20 w-20 rounded-[1.75rem] bg-primary/10 flex items-center justify-center text-primary mb-6">
                                <User className="h-10 w-10" />
                            </div>
                            <CardTitle className="text-3xl font-black tracking-tighter text-foreground">{lead.name}</CardTitle>
                            <CardDescription className="text-base font-medium text-muted-foreground">{lead.email}</CardDescription>
                        </CardHeader>
                        <CardContent className="p-10 space-y-8">
                            <div className="space-y-4">
                                <h4 className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-30">Context & Identity</h4>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                                        <Tag className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-bold text-foreground/80">Intent: {lead.type}</span>
                                    </div>
                                    {lead.metadata?.company && (
                                        <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                                            <Building2 className="h-4 w-4 text-primary" />
                                            <span className="text-sm font-bold text-foreground/80">{lead.metadata.company}</span>
                                        </div>
                                    )}
                                    <div className="flex items-center gap-3 p-4 rounded-2xl bg-muted/30 border border-border">
                                        <Clock className="h-4 w-4 text-primary" />
                                        <span className="text-sm font-bold text-foreground/80">Submitted {format(new Date(lead.createdAt), "MMMM d, h:mm a")}</span>
                                    </div>
                                </div>
                            </div>

                            <Separator className="bg-border" />

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <h4 className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-30">Subject</h4>
                                    <Badge variant="outline" className="text-[8px] border-emerald-500/20 text-emerald-500 font-black uppercase tracking-widest">Validated</Badge>
                                </div>
                                <p className="text-xl font-bold text-foreground leading-tight">
                                    {lead.subject || "Direct Platform Inquiry"}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="rounded-[2.5rem] bg-gradient-to-br from-primary/10 to-transparent border-border p-10 space-y-6">
                        <div className="flex items-center gap-2 text-primary font-black uppercase tracking-tighter text-xs">
                            <ShieldCheck className="h-4 w-4" />
                            Security Assessment
                        </div>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                            This lead was captured through the verified marketing portal. The email address has been sanitized and the origin IP is logged for audit trails.
                        </p>
                        <div className="flex items-center gap-2 text-foreground font-bold text-xs">
                            <Zap className="h-3 w-3 text-yellow-500" />
                            Verified Institutional Source
                        </div>
                    </Card>
                </div>

                {/* Right Column: Original Message, Thread & Reply */}
                <div className="lg:col-span-8 space-y-10">
                    {/* Original Message Card */}
                    <Card className="rounded-[3rem] bg-card border-border shadow-2xl overflow-hidden group">
                        <CardHeader className="p-10 pb-6 border-b border-border bg-muted/10">
                            <div className="flex items-center gap-3 text-primary">
                                <MessageSquare className="h-5 w-5" />
                                <CardTitle className="text-xl font-black tracking-tight uppercase tracking-widest text-[11px] opacity-70">Client Discovery Brief</CardTitle>
                            </div>
                        </CardHeader>
                        <CardContent className="p-12 relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-8 opacity-5">
                                <MessageSquare className="h-32 w-32" />
                            </div>
                            <p className="text-2xl font-medium text-foreground leading-[1.6] italic z-10 relative">
                                "{lead.message}"
                            </p>
                        </CardContent>
                    </Card>

                    {/* Communication Thread Section */}
                    <div className="space-y-8">
                        <div className="flex items-center justify-between px-4">
                            <h4 className="text-[10px] text-muted-foreground uppercase tracking-[0.3em] font-black opacity-50">Response History</h4>
                            <Badge variant="outline" className="border-border text-[10px] opacity-50">{lead.replyThread?.length || 0} Entries</Badge>
                        </div>

                        <div className="space-y-6">
                            {lead.replyThread && lead.replyThread.length > 0 ? (
                                lead.replyThread.map((reply, i) => (
                                    <div key={i} className="flex gap-6 items-start group">
                                        <div className="h-12 w-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center text-emerald-500 shrink-0 shadow-lg shadow-emerald-500/5">
                                            <Send className="h-5 w-5" />
                                        </div>
                                        <div className="flex-1 space-y-4">
                                            <div className="p-8 rounded-[2rem] bg-muted/20 border border-border group-hover:bg-muted/30 transition-colors relative">
                                                <p className="text-base font-semibold text-foreground/90 leading-relaxed whitespace-pre-wrap">{reply.content}</p>
                                            </div>
                                            <div className="flex items-center justify-between px-4 text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] opacity-40">
                                                <div className="flex items-center gap-2">
                                                    <User className="h-3 w-3" />
                                                    <span>PROCESSED BY {reply.sentBy}</span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Clock className="h-3 w-3" />
                                                    <span>{format(new Date(reply.sentAt), "MMMM d, h:mm a")}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="p-12 text-center rounded-[2.5rem] border border-dashed border-border bg-muted/10">
                                    <p className="text-sm text-muted-foreground font-black uppercase tracking-widest opacity-40">No internal responses logged</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Final Reply Interface */}
                    <Card className="rounded-[3rem] bg-card border-border shadow-[0_0_50px_-12px_rgba(var(--primary),0.3)] overflow-hidden">
                        <CardHeader className="p-10 border-b border-border bg-primary/5">
                            <div className="flex items-center gap-4 text-primary">
                                <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
                                    <Send className="h-5 w-5" />
                                </div>
                                <div>
                                    <CardTitle className="text-xl font-black tracking-tighter">Compose Official Response</CardTitle>
                                    <CardDescription className="text-xs font-bold uppercase tracking-widest opacity-60">Correspondence will be logged and dispatched via secure mail</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-0">
                            <Textarea
                                placeholder="Provide a comprehensive institutional response..."
                                className="min-h-[280px] w-full border-none bg-transparent p-10 text-lg font-medium focus-visible:ring-0 resize-none placeholder:opacity-30"
                                value={replyContent}
                                onChange={(e) => setReplyContent(e.target.value)}
                            />
                            <div className="p-10 pt-0 flex flex-col md:flex-row md:items-center justify-between gap-6">
                                <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-30 max-w-sm">
                                    Confirming compliance with institutional messaging standards. This action is irreversible.
                                </p>
                                <Button
                                    className="h-16 rounded-[1.25rem] px-12 font-black gap-3 shadow-2xl shadow-primary/30 transition-all hover:scale-[1.02] active:scale-95"
                                    disabled={isPending || replyContent.length < 5}
                                    onClick={handleReplySubmit}
                                >
                                    {isPending ? "Dispatching..." : "Send Official Reply"}
                                    <Send className="h-5 w-5" />
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}

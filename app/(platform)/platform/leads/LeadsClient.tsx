// app/(platform)/platform/leads/LeadsClient.tsx
"use client";

import { useState, useTransition } from "react";
import {
    Building2,
    Mail,
    MessageSquare,
    Clock,
    ChevronRight,
    MoreVertical,
    CheckCircle2,
    AlertCircle,
    Archive,
    Search,
    Filter,
    User
} from "lucide-react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { updateLeadStatus } from "@/app/(platform)/_actions/lead-actions";
import { cn } from "@/lib/utils";
import Link from "next/link";

interface ReplyEntry {
    content: string;
    sentAt: string;
    sentBy: string;
}

interface Lead {
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

interface LeadsClientProps {
    initialLeads: Lead[];
}

export function LeadsClient({ initialLeads }: LeadsClientProps) {
    const [leads, setLeads] = useState(initialLeads);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);

    const [isPending, startTransition] = useTransition();

    const filteredLeads = leads.filter(lead => {
        const matchesSearch =
            lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (lead.subject?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false);

        const matchesStatus = statusFilter ? lead.status === statusFilter : true;

        return matchesSearch && matchesStatus;
    });

    const getStatusColor = (status: string) => {
        switch (status) {
            case "NEW": return "bg-blue-500/10 text-blue-500 border-blue-500/20";
            case "READ": return "bg-yellow-500/10 text-yellow-500 border-yellow-500/20";
            case "REPLIED": return "bg-emerald-500/10 text-emerald-500 border-emerald-500/20";
            case "ARCHIVED": return "bg-slate-500/10 text-slate-500 border-slate-500/20";
            default: return "";
        }
    };

    const handleStatusUpdate = async (leadId: string, newStatus: string) => {
        startTransition(async () => {
            const result = await updateLeadStatus(leadId, newStatus);
            if (result.success) {
                setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: newStatus } : l));
                toast.success(`Status updated to ${newStatus}`);
            } else {
                toast.error(result.error);
            }
        });
    };


    return (
        <div className="p-8 space-y-8 max-w-7xl mx-auto">
            {/* Header & Filters */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="space-y-1">
                    <h1 className="text-4xl font-black tracking-tighter text-foreground">Marketing Management</h1>
                    <p className="text-muted-foreground font-medium">Capture, convert, and respond to potential partners.</p>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative w-full md:w-64">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search leads..."
                            className="pl-10 h-11 rounded-xl bg-card border-border"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="h-11 rounded-xl bg-card border-border gap-2 px-4">
                                <Filter className="h-4 w-4" />
                                {statusFilter || "All Status"}
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="rounded-xl bg-card border-border w-48 p-2">
                            {["All", "NEW", "READ", "REPLIED", "ARCHIVED"].map(s => (
                                <DropdownMenuItem
                                    key={s}
                                    className="rounded-lg font-bold cursor-pointer"
                                    onClick={() => setStatusFilter(s === "All" ? null : s)}
                                >
                                    {s}
                                </DropdownMenuItem>
                            ))}
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Leads List */}
            <div className="grid gap-4">
                {filteredLeads.length === 0 ? (
                    <div className="py-32 text-center rounded-[3rem] border border-dashed border-border bg-card/20 backdrop-blur-md">
                        <MessageSquare className="h-16 w-16 text-muted-foreground mx-auto mb-6 opacity-20" />
                        <h3 className="text-2xl font-black text-foreground">No leads found</h3>
                        <p className="text-muted-foreground max-w-sm mx-auto">Adjust your search or wait for new inquiries from the marketing pages.</p>
                    </div>
                ) : (
                    filteredLeads.map((lead) => (
                        <Card key={lead.id} className="group overflow-hidden rounded-[2.5rem] bg-card/40 border border-border hover:bg-card/60 transition-all">
                            <CardContent className="p-0">
                                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 p-10">
                                    <div className="flex items-start gap-8">
                                        <div className="h-16 w-16 rounded-[1.25rem] bg-primary/10 flex items-center justify-center text-primary shrink-0 relative transition-transform group-hover:scale-105">
                                            {lead.status === "NEW" && (
                                                <span className="absolute -top-1 -right-1 h-4 w-4 bg-blue-500 rounded-full border-4 border-background" />
                                            )}
                                            <User className="h-8 w-8" />
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <h3 className="text-2xl font-black text-foreground tracking-tighter leading-none">{lead.name}</h3>
                                                <Badge className={cn("rounded-lg text-[10px] font-black tracking-widest uppercase h-6 px-2.5", getStatusColor(lead.status))}>
                                                    {lead.status}
                                                </Badge>
                                            </div>

                                            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground font-medium">
                                                <div className="flex items-center gap-2">
                                                    <Mail className="h-4 w-4" />
                                                    {lead.email}
                                                </div>
                                                {lead.metadata?.company && (
                                                    <div className="flex items-center gap-2 text-primary">
                                                        <Building2 className="h-4 w-4" />
                                                        {lead.metadata.company}
                                                    </div>
                                                )}
                                                <div className="flex items-center gap-2 opacity-50">
                                                    <Clock className="h-4 w-4" />
                                                    {format(new Date(lead.createdAt), "MMM d, h:mm a")}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="hidden lg:block h-12 w-px bg-border" />

                                        <div className="flex flex-col items-end text-right">
                                            <p className="text-[10px] text-muted-foreground uppercase tracking-[0.2em] font-black opacity-30 mb-1">Subject</p>
                                            <p className="text-sm font-bold text-foreground max-w-[240px] truncate">
                                                {lead.subject || "Direct Inquiry"}
                                            </p>
                                        </div>

                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl hover:bg-accent">
                                                    <MoreVertical className="h-5 w-5" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-64 p-2 rounded-2xl bg-card border border-border backdrop-blur-3xl shadow-2xl">
                                                <DropdownMenuItem
                                                    className="rounded-xl flex items-center gap-3 font-bold cursor-pointer py-3"
                                                    onClick={() => handleStatusUpdate(lead.id, "READ")}
                                                >
                                                    <AlertCircle className="h-4 w-4 text-blue-500" />
                                                    Mark as Read
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-xl flex items-center gap-3 font-bold cursor-pointer py-3"
                                                    onClick={() => handleStatusUpdate(lead.id, "REPLIED")}
                                                >
                                                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                                                    Mark as Replied
                                                </DropdownMenuItem>
                                                <DropdownMenuItem
                                                    className="rounded-xl flex items-center gap-3 font-bold text-destructive cursor-pointer py-3"
                                                    onClick={() => handleStatusUpdate(lead.id, "ARCHIVED")}
                                                >
                                                    <Archive className="h-4 w-4" />
                                                    Archive Discovery
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>

                                        <Button
                                            className="h-14 rounded-2xl px-8 font-black flex items-center gap-3 shadow-xl transition-all active:scale-95 hover:bg-primary group-hover:translate-x-1"
                                            asChild
                                        >
                                            <Link href={`/platform/leads/${lead.id}`}>
                                                Process Lead
                                                <ChevronRight className="h-5 w-5" />
                                            </Link>
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

        </div>
    );
}

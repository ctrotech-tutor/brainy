// app/(platform)/platform/institutions/review/[id]/_components/details-card.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { InstitutionReviewData } from "@/app/(platform)/_types";
import { cn } from "@/lib/utils";
import { Globe, ShieldCheck, Calendar, Mail, Fingerprint, Database, Landmark } from "lucide-react";

interface DetailsCardProps {
  institution: InstitutionReviewData;
}

// A helper component to render status badges with appropriate colors
const StatusBadge = ({ status }: { status: string }) => {
  const statusStyles: Record<string, string> = {
    PENDING: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    UNDER_REVIEW: "bg-blue-500/10 text-blue-500 border-blue-500/20",
    REQUEST_CHANGES: "bg-orange-500/10 text-orange-500 border-orange-500/20",
    APPROVED: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    ACTIVE: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20",
    REJECTED: "bg-rose-500/10 text-rose-500 border-rose-500/20",
    SUSPENDED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
    ARCHIVED: "bg-zinc-500/10 text-zinc-500 border-zinc-500/20",
  };

  return (
    <Badge variant="outline" className={cn("capitalize px-2 py-0.5 text-[10px] font-black tracking-widest rounded-full border shadow-sm", statusStyles[status] || statusStyles.PENDING)}>
      {status.replace("_", " ").toLowerCase()}
    </Badge>
  );
};

const DetailItem = ({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value?: React.ReactNode;
  icon?: React.ElementType;
}) => {
  if (value === null || value === undefined || value === "") return null;

  return (
    <div className="group flex flex-col gap-1.5 p-4 rounded-2xl border border-border bg-card transition-colors hover:bg-accent">
      <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 group-hover:text-primary transition-colors">
        {Icon && <Icon className="h-3 w-3" />}
        {label}
      </div>
      <div className="text-sm font-bold text-foreground pl-5">
        {value}
      </div>
    </div>
  );
};


export function InstitutionDetailsCard({ institution }: DetailsCardProps) {
  return (
    <Card className="relative overflow-hidden rounded-[2.5rem] border-border bg-card/50 backdrop-blur-xl shadow-2xl">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <CardHeader className="pb-8 space-y-1">
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl font-black tracking-tighter uppercase">Institutional Manifest</CardTitle>
          <StatusBadge status={institution.status} />
        </div>
        <p className="text-[10px] font-bold text-muted-foreground/40 uppercase tracking-widest">
          Cryptographically signed Registry Entry Details
        </p>
      </CardHeader>
      <CardContent className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DetailItem label="Legal Designation" value={institution.name} icon={Landmark} />
          <DetailItem label="Entity Classification" value={institution.type?.replace(/_/g, ' ')} icon={Database} />
          <DetailItem label="Jurisdiction (Country)" value={institution.country} icon={Globe} />
          <DetailItem label="Administrative Region" value={institution.state} icon={Globe} />
          <DetailItem label="Operational Status" value={institution.ownership} icon={ShieldCheck} />
          <DetailItem label="Temporal Anchor (EST.)" value={institution.yearEstablished} icon={Calendar} />
          <DetailItem label="Primary Gateway" value={<a href={institution.website || '#'} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-color underline underline-offset-4 decoration-primary/20">{institution.website}</a>} icon={Globe} />
          <DetailItem label="Network Domain" value={institution.domain} icon={Fingerprint} />
          <DetailItem label="Identity Liaison" value={institution.contactEmail} icon={Mail} />
        </div>

        <div className="p-6 rounded-2xl bg-accent text-primary border border-border space-y-3">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-primary">
            <ShieldCheck className="h-4 w-4" />
            Security Validation Active
          </div>
          <p className="text-xs font-bold text-muted-foreground/60 tracking-tight leading-relaxed">
            All parameters have been verified against institutional governance protocols. Ensure manual audit matches the uploaded cryptographic credentials.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

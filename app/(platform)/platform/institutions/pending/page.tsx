import { Suspense } from "react";
import { Metadata } from "next";
import { columns } from "./_components/columns";
import { DataTable } from "../../../_components/data-table";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck } from "lucide-react";

export const metadata: Metadata = {
  title: "Pending Approvals",
  description: "Review pending institution applications",
};

export default function PendingInstitutionsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-3">
        <div className="inline-flex items-center gap-2 text-primary font-black uppercase tracking-[0.2em] text-[10px]">
          <ShieldCheck className="h-3 w-3" />
          Protocol Audit
        </div>
        <h1 className="text-4xl font-black tracking-tighter text-foreground leading-none">
          Pending <span className="text-primary italic">Approvals.</span>
        </h1>
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em] leading-relaxed max-w-sm">
          Review and authorize institutional nodes awaiting registry synchronization.
        </p>
      </div>

      <Suspense fallback={<Skeleton className="h-[500px] w-full rounded-[2rem] bg-white/5" />}>
        <DataTable
          columns={columns}
          apiEndpoint="/api/platform/institutions"
          queryKey="pending-institutions"
          initialParams={{ status: "PENDING" }}
          filterColumn="name"
          filterPlaceholder="Search Registry Name..."
        />
      </Suspense>
    </div>
  );
}

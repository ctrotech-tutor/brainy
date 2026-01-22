import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function DataTableSkeleton({
  columnCount,
  rowCount = 10,
}: {
  columnCount: number;
  rowCount?: number;
}) {
  return (
    <div className="w-full space-y-6">
      {/* Toolbar Skeleton */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Skeleton className="h-10 w-full sm:max-w-sm rounded-xl bg-muted/10" />
        <Skeleton className="h-10 w-full sm:w-32 rounded-xl bg-muted/10" />
      </div>

      {/* Table Container Skeleton */}
      <div className="rounded-[2rem] border border-border bg-card/50 backdrop-blur-xl shadow-2xl overflow-hidden">
        <div className="p-0 overflow-x-auto">
          <Table>
            {/* Table Header Skeleton */}
            <TableHeader className="bg-white/5 border-b-white/5">
              <TableRow className="hover:bg-transparent border-b-white/5 h-14">
                {Array.from({ length: columnCount }).map((_, i) => (
                  <TableHead key={i} className="px-6">
                    <Skeleton className="h-4 w-24 bg-muted/20" />
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            {/* Table Body Skeleton */}
            <TableBody>
              {Array.from({ length: rowCount }).map((_, i) => (
                <TableRow key={i} className="border-b-white/5 h-16">
                  {Array.from({ length: columnCount }).map((_, j) => (
                    <TableCell key={j} className="px-6">
                      <Skeleton className="h-5 w-full bg-muted/10" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Pagination Skeleton */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <Skeleton className="h-4 w-48 rounded-lg bg-muted/10" />
        <div className="flex items-center gap-2">
          <Skeleton className="h-9 w-24 rounded-xl bg-muted/10" />
          <Skeleton className="h-9 w-16 rounded-xl bg-muted/10" />
          <Skeleton className="h-9 w-24 rounded-xl bg-muted/10" />
        </div>
      </div>
    </div>
  );
}

// app/(platform)/institutions/pending/_components/data-table.tsx
"use client";
/* @__REACT_COMPILER_DISABLE__ */

import * as React from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import axios from "axios";
import {
  ColumnDef,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "use-debounce";

// UI Imports
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown, Loader2, Search, SlidersHorizontal, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

import { ApiResponse } from "@/app/(platform)/_types";

const fetchPaginatedData = async <TData,>(url: string): Promise<ApiResponse<TData>> => {
  const { data } = await axios.get(url);
  return data;
};

interface DataTableProps<TData, TValue> {
  columns: ((props: {
    setModalOpen: (open: boolean) => void;
    setSelectedRowData: (data: TData | null) => void;
  }) => ColumnDef<TData, TValue>[]) | ColumnDef<TData, TValue>[];
  modalComponent?: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: TData | null;
    selectedRoles: string[];
    onRolesChange: (newRoles: string[]) => void;
  }>;
  apiEndpoint: string;
  queryKey: string;
  filterColumn: string;
  filterPlaceholder: string;
  initialParams?: Record<string, string>;
}

export function DataTable<TData, TValue>({
  columns,
  modalComponent: ModalComponent,
  apiEndpoint,
  queryKey,
  filterColumn,
  filterPlaceholder,
  initialParams = {},
}: DataTableProps<TData, TValue>) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const filterValueFromUrl = searchParams.get(filterColumn) ?? "";

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState<TData | null>(null);
  const [draftRoles, setDraftRoles] = React.useState<string[]>([]);
  const [filterInput, setFilterInput] = React.useState(filterValueFromUrl);
  const [debouncedFilterValue] = useDebounce(filterInput, 300);

  React.useEffect(() => {
    if (
      isModalOpen &&
      selectedRowData &&
      typeof selectedRowData === 'object' &&
      'roles' in selectedRowData &&
      Array.isArray((selectedRowData as any).roles)
    ) {
      setDraftRoles((selectedRowData as any).roles || []);
    } else if (isModalOpen) {
      setDraftRoles([]);
    }
  }, [isModalOpen, selectedRowData]);

  const updateSearchParam = React.useCallback(
    (key: string, value: string | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
      if (key === filterColumn) {
        current.set("page", "1");
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      router.replace(`${pathname}${query}`);
    },
    [searchParams, pathname, router, filterColumn]
  );

  React.useEffect(() => {
    if (debouncedFilterValue !== filterValueFromUrl) {
      updateSearchParam(filterColumn, debouncedFilterValue);
    }
  }, [debouncedFilterValue, filterValueFromUrl, updateSearchParam, filterColumn]);

  const constructApiUrl = React.useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(initialParams).forEach(([key, value]) => params.set(key, value));
    params.set("page", String(page));
    params.set("limit", String(limit));
    if (filterValueFromUrl) {
      params.set(filterColumn, filterValueFromUrl);
    }
    return `${apiEndpoint}?${params.toString()}`;
  }, [initialParams, page, limit, filterValueFromUrl, apiEndpoint, filterColumn]);

  const apiUrl = constructApiUrl();

  const { data, isPending: isLoading, isError, error, isFetching, refetch, isPlaceholderData } = useQuery<ApiResponse<TData>>({
    queryKey: [queryKey, apiUrl],
    queryFn: () => fetchPaginatedData(apiUrl),
    placeholderData: keepPreviousData,
  });

  const tableData = React.useMemo(() => data?.data ?? [], [data]);
  const pageCount = data?.pagination.totalPages ?? 0;

  const resolvedColumns = React.useMemo(() =>
    typeof columns === 'function'
      ? columns({ setModalOpen, setSelectedRowData })
      : columns,
    [columns, setModalOpen, setSelectedRowData]
  );

  const table = useReactTable({
    data: tableData,
    columns: resolvedColumns,
    pageCount,
    manualPagination: true,
    manualFiltering: true,
    manualSorting: true,
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      columnFilters: [{ id: filterColumn, value: filterValueFromUrl }],
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-full max-w-sm rounded-xl bg-white/5" />
          <Skeleton className="ml-auto h-10 w-28 rounded-xl bg-white/5" />
        </div>
        <div className="rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-xl overflow-hidden">
          <div className="p-4 sm:p-6">
            <Table>
              <TableHeader className="border-b-white/5 bg-white/5">
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-white/5">
                    {headerGroup.headers.map((header) => (
                      <TableHead key={header.id}>
                        <Skeleton className="h-4 w-20 bg-white/10" />
                      </TableHead>
                    ))}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {[...Array(limit)].map((_, i) => (
                  <TableRow key={i} className="hover:bg-white/5 transition-colors border-b-white/5">
                    {resolvedColumns.map((_, j) => (
                      <TableCell key={j}>
                        <Skeleton className="h-4 w-full bg-white/5" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-[3rem] border border-dashed border-white/10 bg-white/5 py-12 text-center">
        <div className="h-16 w-16 rounded-2xl bg-destructive/10 flex items-center justify-center mb-4">
          <Loader2 className="h-8 w-8 text-destructive animate-spin" />
        </div>
        <h3 className="text-sm font-black tracking-widest text-destructive uppercase">Audit Interrupted</h3>
        <p className="mt-2 text-[10px] font-bold text-muted-foreground/60 uppercase tracking-[0.2em]">
          {error instanceof Error ? error.message : "An unknown error occurred"}
        </p>
        <Button variant="outline" size="sm" className="mt-6 rounded-xl border-white/10 bg-white/5" onClick={() => refetch()}>
          Retry Sequence
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="relative group w-full sm:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/40 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder={filterPlaceholder}
            value={filterInput}
            onChange={(event) => setFilterInput(event.target.value)}
            disabled={isFetching}
            className="pl-10 pr-10 rounded-xl border-white/5 bg-white/5 backdrop-blur-md text-xs font-bold uppercase tracking-tight placeholder:text-muted-foreground/20 focus-visible:ring-primary/20 h-10 transition-all"
          />
          {isFetching && (
            <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-primary" />
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="rounded-xl border-white/10 bg-white/5 backdrop-blur-md text-[10px] font-black uppercase tracking-widest h-10 px-4">
              <SlidersHorizontal className="mr-2 h-3.5 w-3.5 opacity-60" />
              Columns <ChevronDown className="ml-2 h-3.5 w-3.5 opacity-40" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="border-white/10 bg-black/60 backdrop-blur-2xl rounded-2xl p-2 min-w-[200px]">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize rounded-xl text-[10px] font-bold uppercase tracking-widest focus:bg-white/5 focus:text-foreground"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-[2rem] border border-white/5 bg-white/5 backdrop-blur-xl shadow-2xl overflow-hidden relative">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-40" />
        <div className="p-0 overflow-x-auto">
          <Table>
            <TableHeader className="bg-white/5 border-b-white/5">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent border-b-white/5 h-14">
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id} className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40 px-6">
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                    className="group border-b-white/5 hover:bg-white/5 transition-colors h-16"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="px-6 text-sm font-medium tracking-tight">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={resolvedColumns.length} className="h-32 text-center">
                    <div className="flex flex-col items-center gap-2 text-muted-foreground/20">
                      <Sparkles className="h-8 w-8" />
                      <span className="text-[10px] font-black uppercase tracking-[0.3em]">No registry entries found.</span>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-6 px-4">
        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground/40">
          <span className="text-primary">{table.getFilteredSelectedRowModel().rows.length}</span> of {data?.pagination.totalResults} Nodes Encrypted
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSearchParam("page", String(page - 1))}
            disabled={page <= 1 || isFetching}
            className="rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest px-4 h-9 hover:bg-white/10 disabled:opacity-20 transition-all"
          >
            Prev Session
          </Button>
          <div className="flex items-center gap-1.5 px-3 h-9 rounded-xl bg-white/5 border border-white/5">
            <span className="text-[10px] font-black text-primary">{page}</span>
            <span className="text-[10px] font-bold text-muted-foreground/20">/</span>
            <span className="text-[10px] font-bold text-muted-foreground/40">{pageCount}</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => updateSearchParam("page", String(page + 1))}
            disabled={isPlaceholderData || page >= pageCount || isFetching}
            className="rounded-xl border-white/5 bg-white/5 text-[10px] font-black uppercase tracking-widest px-4 h-9 hover:bg-white/10 disabled:opacity-20 transition-all"
          >
            Next Buffer
          </Button>
        </div>
      </div>

      {ModalComponent && (
        <ModalComponent
          open={isModalOpen}
          onOpenChange={setModalOpen}
          data={selectedRowData}
          selectedRoles={draftRoles}
          onRolesChange={setDraftRoles}
        />
      )}
    </div>
  );
}

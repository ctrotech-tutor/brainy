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
import { useDebounce } from "use-debounce"; // **FIX: Import useDebounce**

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
import { ChevronDown, Loader2 } from "lucide-react"; // **IMPROVEMENT: Import an icon for loading**

import { ApiResponse } from "@/app/(platform)/_types";

// The generic API fetching function
const fetchPaginatedData = async <TData,>(url: string): Promise<ApiResponse<TData>> => {
  const { data } = await axios.get(url);
  return data;
};

// The props for our powerful, reusable DataTable
interface DataTableProps<TData, TValue> {
  columns: ((props: {
    setModalOpen: (open: boolean) => void;
    setSelectedRowData: (data: TData | null) => void;
  }) => ColumnDef<TData, TValue>[]) | ColumnDef<TData, TValue>[];
  modalComponent?: React.ComponentType<{
    open: boolean;
    onOpenChange: (open: boolean) => void;
    data: TData | null; // <-- generic data prop
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

  // --- STATE DERIVED FROM URL (Single Source of Truth) ---
  const page = Number(searchParams.get("page") ?? "1");
  const limit = Number(searchParams.get("limit") ?? "10");
  const filterValueFromUrl = searchParams.get(filterColumn) ?? "";

  // --- LOCAL COMPONENT STATE ---
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [isModalOpen, setModalOpen] = React.useState(false);
  const [selectedRowData, setSelectedRowData] = React.useState<TData | null>(null);
// This state will hold the roles for the checkboxes in the modal.
  const [draftRoles, setDraftRoles] = React.useState<string[]>([]);

  // **FIX: State for the immediate value of the filter input**
  const [filterInput, setFilterInput] = React.useState(filterValueFromUrl);
  // **FIX: Debounce the input value. The API call will use `debouncedFilterValue`**
  const [debouncedFilterValue] = useDebounce(filterInput, 300);

  React.useEffect(() => {
    // --- ADD A TYPE GUARD ---
    // Check if the selected data actually has a 'roles' property before trying to access it.
    if (
      isModalOpen &&
      selectedRowData &&
      typeof selectedRowData === 'object' &&
      'roles' in selectedRowData &&
      Array.isArray((selectedRowData as any).roles)
    ) {
      // Now TypeScript knows it's safe to access .roles
      setDraftRoles((selectedRowData as any).roles || []);
    } else if (isModalOpen) {
      // If the modal is open but the data doesn't have roles, ensure draftRoles is empty.
      setDraftRoles([]);
    }
  }, [isModalOpen, selectedRowData]);
  
  // --- URL MANAGEMENT ---
  // Function to update URL search params, which drives the whole component
  const updateSearchParam = React.useCallback(
    (key: string, value: string | null) => {
      const current = new URLSearchParams(Array.from(searchParams.entries()));
      if (value) {
        current.set(key, value);
      } else {
        current.delete(key);
      }
      // When filtering, always go back to the first page for a better UX
      if (key === filterColumn) {
        current.set("page", "1");
      }
      const search = current.toString();
      const query = search ? `?${search}` : "";
      // Use replace instead of push to avoid polluting browser history with every filter change
      router.replace(`${pathname}${query}`);
    },
    [searchParams, pathname, router, filterColumn]
  );

  // **FIX: Effect to trigger URL update when the debounced value changes**
  React.useEffect(() => {
    // Only update the URL if the debounced value is different from the one in the URL
    if (debouncedFilterValue !== filterValueFromUrl) {
      updateSearchParam(filterColumn, debouncedFilterValue);
    }
  }, [debouncedFilterValue, filterValueFromUrl, updateSearchParam, filterColumn]);

  // --- DATA FETCHING ---
  const constructApiUrl = React.useCallback(() => {
    const params = new URLSearchParams();
    Object.entries(initialParams).forEach(([key, value]) => params.set(key, value));
    params.set("page", String(page));
    params.set("limit", String(limit));
    // The filter value from the URL is the source of truth for the API call
    if (filterValueFromUrl) {
      params.set(filterColumn, filterValueFromUrl);
    }
    return `${apiEndpoint}?${params.toString()}`;
  }, [initialParams, page, limit, filterValueFromUrl, apiEndpoint, filterColumn]);

  const apiUrl = constructApiUrl();

  // **IMPROVEMENT: Get `isFetching` and `refetch` from useQuery**
  const { data, isPending: isLoading, isError, error, isFetching, refetch, isPlaceholderData } = useQuery<ApiResponse<TData>>({
    queryKey: [queryKey, apiUrl], // Query re-runs when apiUrl changes
    queryFn: () => fetchPaginatedData(apiUrl),
    placeholderData: keepPreviousData,
  });

  const tableData = React.useMemo(() => data?.data ?? [], [data]);
  const pageCount = data?.pagination.totalPages ?? 0;

  // --- TABLE INSTANCE ---
   // Resolve columns whether it's a function or an array
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
    manualFiltering: true, // We handle filtering via the URL and API
    manualSorting: true, // Assuming sorting is also handled by the API
    onSortingChange: setSorting,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    state: {
      sorting,
      // **FIX: `columnFilters` is now directly controlled by the URL state**
      columnFilters: [{ id: filterColumn, value: filterValueFromUrl }],
      columnVisibility,
      rowSelection,
      pagination: {
        pageIndex: page - 1,
        pageSize: limit,
      },
    },
  });

  // --- RENDER LOGIC ---

  if (isLoading) {
    // Initial loading skeleton remains the same
    return (
      <div className="space-y-4">
        <div className="flex items-center py-4">
          <Skeleton className="h-10 w-full max-w-sm" />
          <Skeleton className="ml-auto h-10 w-28" />
        </div>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      <Skeleton className="h-5 w-24" />
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {[...Array(limit)].map((_, i) => (
                <TableRow key={i}>
                  {resolvedColumns.map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-5 w-full" />
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center rounded-md border border-dashed py-12 text-center">
        <h3 className="text-lg font-semibold text-destructive">Failed to Load Data</h3>
        <p className="mt-2 text-sm text-muted-foreground">{error instanceof Error ? error.message : "An unknown error occurred"}</p>
        {/* **IMPROVEMENT: Use `refetch` instead of window.location.reload()** */}
        <Button variant="outline" size="sm" className="mt-4" onClick={() => refetch()}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <div className="relative max-w-sm">
          <Input
            placeholder={filterPlaceholder}
            // **FIX: Value is the immediate local state**
            value={filterInput}
            // **FIX: onChange updates the local state, not the URL directly**
            onChange={(event) => setFilterInput(event.target.value)}
            // **IMPROVEMENT: Disable input while data is being fetched**
            disabled={isFetching}
            className="max-w-sm pr-8" // Add padding for the spinner
          />
          {/* **IMPROVEMENT: Show a loading spinner during refetches** */}
          {isFetching && (
            <Loader2 className="absolute right-2 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
          )}
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              Columns <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  className="capitalize"
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
        <Table>
          {/* Table Header and Body remain the same */}
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={resolvedColumns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} of {data?.pagination.totalResults} row(s) selected.
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSearchParam("page", String(page - 1))}
          // **IMPROVEMENT: Disable while fetching**
          disabled={page <= 1 || isFetching}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          size="sm"
          onClick={() => updateSearchParam("page", String(page + 1))}
          // **IMPROVEMENT: Disable while fetching**
          disabled={isPlaceholderData || page >= pageCount || isFetching}
        >
          Next
        </Button>
      </div>

      {/* Modal Rendering */}
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

"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface InstitutionFiltersProps {
  currentStatus: string;
  currentSearch: string;
}

export function InstitutionFilters({
  currentStatus,
  currentSearch,
}: InstitutionFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [search, setSearch] = useState(currentSearch);

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status === "ALL") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page"); // Reset to page 1
    startTransition(() => {
      router.push(`/platform/institutions?${params.toString()}`);
    });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams);
    if (search) {
      params.set("search", search);
    } else {
      params.delete("search");
    }
    params.delete("page"); // Reset to page 1
    startTransition(() => {
      router.push(`/platform/institutions?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    setSearch("");
    startTransition(() => {
      router.push("/platform/institutions");
    });
  };

  const statuses = [
    { value: "ALL", label: "All", color: "gray" },
    { value: "PENDING", label: "Pending", color: "orange" },
    { value: "APPROVED", label: "Approved", color: "blue" },
    { value: "ACTIVE", label: "Active", color: "green" },
    { value: "REJECTED", label: "Rejected", color: "red" },
    { value: "SUSPENDED", label: "Suspended", color: "gray" },
  ];

  return (
    <div className="space-y-4">
      {/* Status Filters */}
      <div className="flex flex-wrap gap-2">
        {statuses.map((status) => (
          <button
            key={status.value}
            onClick={() => handleStatusChange(status.value)}
            disabled={isPending}
            className={`rounded-full px-4 py-2 text-sm font-medium transition-all ${
              currentStatus === status.value
                ? status.color === "orange"
                  ? "bg-orange-100 text-orange-700 ring-2 ring-orange-500"
                  : status.color === "blue"
                  ? "bg-blue-100 text-blue-700 ring-2 ring-blue-500"
                  : status.color === "green"
                  ? "bg-green-100 text-green-700 ring-2 ring-green-500"
                  : status.color === "red"
                  ? "bg-red-100 text-red-700 ring-2 ring-red-500"
                  : "bg-gray-100 text-gray-700 ring-2 ring-gray-500"
                : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
            } disabled:opacity-50`}
          >
            {status.label}
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <div className="flex gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-3">
          <div className="relative flex-1">
            <svg
              className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or domain..."
              disabled={isPending}
              className="w-full rounded-lg border border-gray-300 pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent disabled:opacity-50 disabled:cursor-not-allowed"
            />
          </div>

          <button
            type="submit"
            disabled={isPending}
            className="rounded-lg bg-purple-600 px-6 py-2 text-sm font-medium text-white hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isPending ? "Searching..." : "Search"}
          </button>
        </form>

        {(currentSearch || currentStatus !== "ALL") && (
          <button
            onClick={clearFilters}
            disabled={isPending}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        )}
      </div>
    </div>
  );
}
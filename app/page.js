"use client";

import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { DataListingTable } from "@/components/tables/data-listing-table";
import { fetchUsers } from "@/lib/mockUsers";

const columns = [
  {
    header: "Name",
    accessorKey: "name",
    enableSorting: true,
    align: "left",
  },
  {
    header: "Email",
    accessorKey: "email",
    enableSorting: false,
    align: "left",
  },
  {
    header: "Role",
    accessorKey: "role",
    enableSorting: true,
    type: "role",
    align: "right",
  },
  {
    header: "Status",
    accessorKey: "status",
    enableSorting: true,
    type: "status",
    align: "right",
  },
  {
    header: "Department",
    accessorKey: "department",
    enableSorting: true,
    type: "department",
    align: "left",
  },
  {
    header: "Age",
    accessorKey: "age",
    enableSorting: true,
    align: "right",
  },
  {
    header: "Created At",
    accessorKey: "createdAt",
    enableSorting: true,
    align: "right",
  },
];

export default function UsersPage() {
  const [sortBy, setSortBy] = useState({ column: "name", order: "asc" });
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const query = useQuery({
    queryKey: ["users", page, pageSize, sortBy],
    queryFn: () =>
      fetchUsers({
        page,
        pageSize,
        sort: sortBy.column,
        order: sortBy.order,
      }),
  });

  return (
    <div className="p-4 bg-slate-100 min-h-screen">
      <DataListingTable
        columns={columns}
        query={query}
        onSortChange={setSortBy}
        page={page}
        pageSize={pageSize}
        total={query.data?.total || 0}
        setPage={setPage}
        setPageSize={setPageSize}
        selectable={true}
        header={<PremiumUsersHeader />}
      />
    </div>
  );
}

export function PremiumUsersHeader() {
  return (
    <div className="flex items-center justify-between px-6 py-4 border-b bg-gradient-to-r from-blue-50 to-white rounded-t-xl">
      <div>
        <h2 className="text-xl font-semibold text-blue-700 tracking-tight">
          Premium Users
        </h2>
        <p className="text-xs text-gray-500 mt-1">
          Manage your premium user accounts and permissions.
        </p>
      </div>
      <span className="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs font-medium px-3 py-1 rounded-full">
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <path
            d="M16 7a4 4 0 01-8 0M12 14v7m0 0H9m3 0h3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx="12" cy="7" r="4" />
        </svg>
        Premium
      </span>
    </div>
  );
}

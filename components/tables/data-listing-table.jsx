import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useState } from "react";
import {
  ArrowUp,
  ArrowDown,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  AlertTriangle,
  Inbox,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import PropTypes from "prop-types";

// --- Shimmer Skeleton ---
function ShimmerTable({ columnsCount = 5, rowsCount = 6 }) {
  return (
    <Table className="min-w-full text-xs">
      <TableHeader>
        <TableRow>
          {Array.from({ length: columnsCount }).map((_, i) => (
            <TableHead key={i}>
              <div className="h-3 w-16 bg-gray-100 rounded animate-pulse" />
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {Array.from({ length: rowsCount }).map((_, r) => (
          <TableRow key={r}>
            {Array.from({ length: columnsCount }).map((_, c) => (
              <TableCell key={c}>
                <div className="h-3 w-full bg-gray-100 rounded animate-pulse" />
              </TableCell>
            ))}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

function getCellBgClass(type, value) {
  if (!type) return "";
  switch (type) {
    case "status":
      if (value === "Active") return "bg-green-50 text-green-600";
      if (value === "Inactive") return "bg-red-50 text-red-600";
      if (value === "Pending") return "bg-yellow-50 text-yellow-700";
      return "bg-gray-50 text-gray-500";
    case "role":
      if (value === "Admin") return "bg-blue-50 text-blue-600";
      if (value === "Editor") return "bg-purple-50 text-purple-600";
      if (value === "Viewer") return "bg-gray-50 text-gray-600";
      return "";
    case "department":
      return "bg-slate-50 text-slate-600";
    default:
      return "";
  }
}

function Pagination({ page, totalPages, setPage, className = "" }) {
  return (
    <nav
      className={`flex items-center gap-2 ${className}`}
      aria-label="Pagination"
    >
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setPage((p) => Math.max(1, p - 1))}
        disabled={page === 1}
        aria-label="Previous page"
        className="rounded-full"
      >
        <ChevronLeft className="w-4 h-4" />
      </Button>
      <span className="text-xs text-gray-500" aria-live="polite">
        {page} / {totalPages}
      </span>
      <Button
        variant="ghost"
        size="icon"
        onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
        disabled={page === totalPages}
        aria-label="Next page"
        className="rounded-full"
      >
        <ChevronRight className="w-4 h-4" />
      </Button>
    </nav>
  );
}

Pagination.propTypes = {
  page: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  className: PropTypes.string,
};

function PageSizeSelector({
  pageSize,
  setPageSize,
  options = [5, 10, 20, 50, 100, 150, 200, 300],
  className = "",
  total = 0,
}) {
  // Only show options up to total.
  let filteredOptions = options.filter((size) => size <= total || total === 0);
  if (total > 0 && !filteredOptions.includes(pageSize)) {
    filteredOptions.push(pageSize);
    filteredOptions = filteredOptions.sort((a, b) => a - b);
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <select
        id="page-size"
        className="border border-gray-200 rounded px-2 py-1 text-xs bg-white focus:outline-none"
        value={pageSize}
        onChange={(e) => setPageSize(Number(e.target.value))}
        aria-label="Rows per page"
      >
        {filteredOptions.map((size) => (
          <option key={size} value={size}>
            {size} / {total || "total"}
          </option>
        ))}
      </select>
    </div>
  );
}

PageSizeSelector.propTypes = {
  pageSize: PropTypes.number.isRequired,
  setPageSize: PropTypes.func.isRequired,
  options: PropTypes.array,
  className: PropTypes.string,
  total: PropTypes.number,
};

export function DataListingTable({
  columns,
  query,
  onSortChange,
  page,
  pageSize,
  total,
  setPage,
  setPageSize,
  selectable = false,
  selectionLabel = "Select row",
  className = "",
  style = {},
  emptyMessage = "No data available.",
  errorMessage = "Error loading data.",
  header = null,
}) {
  const [sorting, setSorting] = useState([]);
  const [selectedRows, setSelectedRows] = useState({});

  // If pageSize > total, set pageSize to total
  if (total > 0 && pageSize > total) {
    setPageSize(total);
    return null;
  }

  const enhancedColumns = selectable
    ? [
        {
          id: "select",
          header: ({ table }) => (
            <input
              type="checkbox"
              aria-label="Select all rows"
              checked={
                table.getRowModel().rows.length > 0 &&
                table.getRowModel().rows.every((row) => selectedRows[row.id])
              }
              onChange={(e) => {
                const checked = e.target.checked;
                const newSelected = {};
                table.getRowModel().rows.forEach((row) => {
                  newSelected[row.id] = checked;
                });
                setSelectedRows(newSelected);
              }}
            />
          ),
          cell: ({ row }) => (
            <input
              type="checkbox"
              aria-label={selectionLabel}
              checked={!!selectedRows[row.id]}
              onChange={(e) => {
                setSelectedRows((prev) => ({
                  ...prev,
                  [row.id]: e.target.checked,
                }));
              }}
            />
          ),
          enableSorting: false,
          size: 32,
        },
        ...columns,
      ]
    : columns;

  const table = useReactTable({
    data: query.data?.data || [],
    columns: enhancedColumns,
    state: { sorting },
    onSortingChange: (updater) => {
      const next = typeof updater === "function" ? updater(sorting) : updater;
      setSorting(next);
      const sort = next[0];
      if (sort) {
        onSortChange({ column: sort.id, order: sort.desc ? "desc" : "asc" });
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    manualPagination: true,
  });

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  if (query.isLoading)
    return (
      <section
        className={`rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto ${className}`}
        style={style}
        aria-label="Data table"
      >
        {header}
        <ShimmerTable columnsCount={enhancedColumns.length} rowsCount={16} />
      </section>
    );
  if (query.isError)
    return (
      <div className="flex flex-col items-center justify-center py-16 text-red-400 gap-2">
        <AlertTriangle className="w-6 h-6" />
        <span className="text-sm">{errorMessage}</span>
      </div>
    );

  return (
    <section
      className={`rounded-xl border border-gray-100 bg-white shadow-sm overflow-x-auto ${className}`}
      style={style}
      aria-label="Data table"
    >
      {header}
      <Table className="min-w-full text-xs">
        <TableHeader className="sticky top-0 z-10 bg-white">
          {table.getHeaderGroups().map((group) => (
            <TableRow key={group.id}>
              {group.headers.map((header) => {
                const align = header.column.columnDef.align || "left";
                return (
                  <TableHead
                    key={header.id}
                    style={
                      header.column.columnDef.size
                        ? {
                            width: header.column.columnDef.size,
                            minWidth: header.column.columnDef.size,
                          }
                        : undefined
                    }
                    className={`whitespace-nowrap text-${align} font-medium px-3 py-2 bg-white`}
                    scope="col"
                  >
                    {header.isPlaceholder ? null : header.column.columnDef
                        .enableSorting ? (
                      <button
                        className="flex items-center gap-1 select-none focus:outline-none focus:ring-1 focus:ring-blue-400 rounded px-1"
                        onClick={header.column.getToggleSortingHandler()}
                        aria-label={`Sort by ${header.column.columnDef.header}`}
                        tabIndex={0}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                        {header.column.getIsSorted() === "asc" ? (
                          <ArrowUp className="h-3 w-3 text-blue-500" />
                        ) : header.column.getIsSorted() === "desc" ? (
                          <ArrowDown className="h-3 w-3 text-blue-500" />
                        ) : (
                          <ArrowUpDown className="h-3 w-3 text-gray-300" />
                        )}
                      </button>
                    ) : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.length === 0 ? (
            <TableRow>
              <TableCell
                colSpan={enhancedColumns.length}
                className="text-center py-12 text-gray-300"
              >
                <div className="flex flex-col items-center gap-2">
                  <Inbox className="w-7 h-7" />
                  <span className="text-xs">{emptyMessage}</span>
                </div>
              </TableCell>
            </TableRow>
          ) : (
            table.getRowModel().rows.map((row, idx) => (
              <TableRow
                key={row.id}
                className={`transition-colors duration-100 ${
                  selectedRows[row.id]
                    ? "bg-blue-50"
                    : idx % 2 === 0
                    ? "bg-white"
                    : "bg-gray-50"
                } hover:bg-blue-50/40 focus-within:bg-blue-100`}
                tabIndex={0}
                aria-selected={!!selectedRows[row.id]}
              >
                {row.getVisibleCells().map((cell) => {
                  const type = cell.column.columnDef.type;
                  const value = cell.getValue();
                  const bgClass = getCellBgClass(type, value);
                  const align = cell.column.columnDef.align || "left";
                  return (
                    <TableCell
                      key={cell.id}
                      style={
                        cell.column.columnDef.size
                          ? {
                              width: cell.column.columnDef.size,
                              minWidth: cell.column.columnDef.size,
                            }
                          : undefined
                      }
                      className={`whitespace-nowrap text-${align} px-3 py-2`}
                    >
                      {bgClass ? (
                        <span
                          className={bgClass + " rounded-full px-2 py-0.5"}
                          style={{
                            fontSize: "0.75rem",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </span>
                      ) : (
                        flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )
                      )}
                    </TableCell>
                  );
                })}
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
      <footer className="flex items-center justify-between gap-2 px-4 py-3 border-t bg-white">
        <div className="flex items-center gap-4">
          <PageSizeSelector
            pageSize={pageSize}
            setPageSize={setPageSize}
            total={total}
          />
          {selectable ? (
            <span className="text-xs text-gray-400" aria-live="polite">
              {Object.values(selectedRows).filter(Boolean).length} selected
            </span>
          ) : null}
        </div>
        <Pagination page={page} totalPages={totalPages} setPage={setPage} />
      </footer>
    </section>
  );
}

DataListingTable.propTypes = {
  columns: PropTypes.array.isRequired,
  query: PropTypes.object.isRequired,
  onSortChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  pageSize: PropTypes.number.isRequired,
  total: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  setPageSize: PropTypes.func.isRequired,
  selectable: PropTypes.bool,
  selectionLabel: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  emptyMessage: PropTypes.string,
  errorMessage: PropTypes.string,
  header: PropTypes.node,
};

export default DataListingTable;

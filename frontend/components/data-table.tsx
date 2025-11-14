"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient, Product, User, Order, Transaction } from "@/lib/api";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowUpDown,
  Loader2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";

type DataType = Product | User | Order | Transaction;

interface DataTableProps<T extends DataType> {
  type: "products" | "users" | "orders" | "transactions";
  title: string;
  columns: { key: keyof T; label: string; sortable?: boolean }[];
  filters?: React.ReactNode;
}

export function DataTable<T extends DataType>({
  type,
  title,
  columns,
  filters,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(50);
  const [totalPages, setTotalPages] = useState(0);
  const [total, setTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState<string>("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [responseTime, setResponseTime] = useState<number>(0);
  const [isRetrying, setIsRetrying] = useState(false);

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("");
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500);
    return () => clearTimeout(timer);
  }, [search]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch, sortBy, sortOrder]);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        let response;
        switch (type) {
          case "products":
            response = await apiClient.getProducts(
              page,
              pageSize,
              debouncedSearch,
              sortBy || "created_at",
              sortOrder
            );
            break;
          case "users":
            response = await apiClient.getUsers(
              page,
              pageSize,
              debouncedSearch,
              undefined,
              sortBy || "signup_date",
              sortOrder
            );
            break;
          case "orders":
            response = await apiClient.getOrders(
              page,
              pageSize,
              undefined,
              sortBy || "order_date",
              sortOrder
            );
            break;
          case "transactions":
            response = await apiClient.getTransactions(
              page,
              pageSize,
              undefined,
              undefined,
              sortBy || "transaction_date",
              sortOrder
            );
            break;
        }

        setData(response.data as T[]);
        setTotalPages(response.total_pages);
        setTotal(response.total);
        setResponseTime(response.response_time_ms);
      } catch (err) {
        const errorMsg =
          err instanceof Error
            ? err.message
            : "Failed to load data. Please check your backend connection.";
        setError(errorMsg);
        console.error("❌ Data fetch error:", errorMsg);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [page, pageSize, debouncedSearch, sortBy, sortOrder, type]);

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(key);
      setSortOrder("desc");
    }
  };

  const handleRetry = () => {
    setIsRetrying(true);
    // Page will refetch due to isRetrying in dependencies or manual page reset
    setPage(1);
  };

  const formatValue = (value: unknown): string => {
    if (value === null || value === undefined) return "-";
    if (typeof value === "number") {
      if (Number.isInteger(value)) return value.toString();
      return value.toFixed(2);
    }
    if (typeof value === "string") {
      if (value.includes("T")) {
        return new Date(value).toLocaleDateString();
      }
      return value;
    }
    return String(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold gradient-text">{title}</h1>
          <p className="text-slate-400">
            Browsing{" "}
            <span className="font-semibold text-cyan-400">
              {total.toLocaleString()}
            </span>{" "}
            records
          </p>
        </div>
        <div className="glass px-4 py-3 rounded-lg text-sm">
          <div className="text-slate-400">Response Time</div>
          <div className="text-xl font-bold text-cyan-400">
            {responseTime.toFixed(2)}ms
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="glass p-6 rounded-2xl space-y-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 glass-light"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40 glass-light">
                <SelectValue placeholder="Select field" />
              </SelectTrigger>
              <SelectContent>
                {columns.map((col) => (
                  <SelectItem key={String(col.key)} value={String(col.key)}>
                    {col.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Order</label>
            <Select
              value={sortOrder}
              onValueChange={(v: "asc" | "desc") => setSortOrder(v)}
            >
              <SelectTrigger className="w-32 glass-light">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">↑ Ascending</SelectItem>
                <SelectItem value="desc">↓ Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters}

          <Button
            onClick={() => handleRetry()}
            disabled={loading}
            className="glass hover-glow"
            size="sm"
          >
            {loading || isRetrying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              <>
                <RefreshCw className="h-4 w-4" />
                Refresh
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="glass border-l-4 border-red-500 p-4 rounded-xl flex gap-4 items-start">
          <AlertCircle className="h-5 w-5 text-red-500 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-semibold text-red-400 mb-1">
              Error Loading Data
            </h3>
            <p className="text-red-300/80 text-sm">{error}</p>
          </div>
          <Button
            onClick={handleRetry}
            disabled={loading}
            size="sm"
            className="glass hover-glow shrink-0"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="glass p-12 rounded-2xl flex items-center justify-center min-h-96">
          <div className="flex flex-col items-center gap-4">
            <div className="relative w-12 h-12">
              <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 border-t-cyan-500 animate-spin" />
              <Loader2 className="absolute inset-0 m-auto h-5 w-5 text-cyan-400" />
            </div>
            <div className="text-center space-y-1">
              <p className="font-semibold text-gray-800">Loading data...</p>
              <p className="text-sm text-gray-500">
                Fetching {title.toLowerCase()} from server
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && data.length === 0 && (
        <div className="glass p-12 rounded-2xl text-center space-y-4">
          <div className="inline-flex glass p-4 rounded-full mb-4">
            <Search className="h-6 w-6 text-gray-400" />
          </div>
          <h3 className="text-xl font-semibold text-gray-800">
            No records found
          </h3>
          <p className="text-gray-600">Try adjusting your search or filters</p>
          <Button
            onClick={() => handleRetry()}
            className="glass hover-glow mt-4"
          >
            Try Again
          </Button>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && data.length > 0 && (
        <>
          <div className="glass rounded-2xl overflow-hidden border border-white/10">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/10 hover:bg-transparent">
                    {columns.map((col) => (
                      <TableHead key={String(col.key)} className="h-12">
                        <button
                          onClick={() =>
                            col.sortable && handleSort(String(col.key))
                          }
                          className="flex items-center gap-2 font-semibold text-gray-800 hover:text-blue-600 transition-colors"
                        >
                          {col.label}
                          {col.sortable && (
                            <ArrowUpDown
                              className={`h-4 w-4 transition-all ${
                                sortBy === String(col.key)
                                  ? "text-blue-600"
                                  : "text-gray-400"
                              }`}
                            />
                          )}
                        </button>
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {data.map((row, idx) => (
                    <TableRow
                      key={idx}
                      className="border-b border-white/10 hover:bg-white/5 transition-colors"
                    >
                      {columns.map((col) => (
                        <TableCell
                          key={`${idx}-${String(col.key)}`}
                          className="text-gray-800 py-4"
                        >
                          {formatValue(row[col.key])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>

          {/* Pagination */}
          <div className="glass p-4 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-600">
              Showing{" "}
              <span className="font-semibold text-blue-600">
                {(page - 1) * pageSize + 1}
              </span>{" "}
              to{" "}
              <span className="font-semibold text-blue-600">
                {Math.min(page * pageSize, total)}
              </span>{" "}
              of{" "}
              <span className="font-semibold text-blue-600">
                {total.toLocaleString()}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                variant="outline"
                size="sm"
                className="glass"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>

              <div className="flex items-center gap-1 flex-wrap justify-center">
                {totalPages <= 7 ? (
                  // Show all pages if 7 or fewer
                  Array.from({ length: totalPages }).map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        onClick={() => setPage(pageNum)}
                        variant={page === pageNum ? "default" : "outline"}
                        size="sm"
                        className={`h-8 w-8 p-0 font-semibold ${
                          page === pageNum
                            ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                            : "glass hover:bg-white/10"
                        }`}
                      >
                        {pageNum}
                      </Button>
                    );
                  })
                ) : (
                  // Smart pagination for many pages
                  <>
                    {/* First page */}
                    <Button
                      onClick={() => setPage(1)}
                      variant={page === 1 ? "default" : "outline"}
                      size="sm"
                      className={`h-8 w-8 p-0 font-semibold ${
                        page === 1
                          ? "bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          : "glass hover:bg-white/10"
                      }`}
                    >
                      1
                    </Button>

                    {/* Ellipsis if needed */}
                    {page > 3 && (
                      <span className="text-gray-600 px-2">...</span>
                    )}

                    {/* Pages around current page */}
                    {Array.from({ length: 5 }).map((_, i) => {
                      const pageNum = page - 2 + i;
                      if (
                        pageNum > 1 &&
                        pageNum < totalPages &&
                        pageNum !== page &&
                        pageNum !== 1
                      ) {
                        return (
                          <Button
                            key={pageNum}
                            onClick={() => setPage(pageNum)}
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0 font-semibold glass hover:bg-white/10"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      if (pageNum === page && pageNum !== 1) {
                        return (
                          <Button
                            key={pageNum}
                            variant="default"
                            size="sm"
                            className="h-8 w-8 p-0 font-semibold bg-blue-600 hover:bg-blue-700 text-white border-blue-600"
                          >
                            {pageNum}
                          </Button>
                        );
                      }
                      return null;
                    })}

                    {/* Ellipsis if needed */}
                    {page < totalPages - 2 && (
                      <span className="text-gray-600 px-2">...</span>
                    )}

                    {/* Last page - only show if not already displayed */}
                    {totalPages > page + 2 && (
                      <Button
                        onClick={() => setPage(totalPages)}
                        variant="outline"
                        size="sm"
                        className="h-8 w-8 p-0 font-semibold glass hover:bg-white/10"
                      >
                        {totalPages}
                      </Button>
                    )}
                  </>
                )}
              </div>

              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                variant="outline"
                size="sm"
                className="glass"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Select
              value={pageSize.toString()}
              onValueChange={(v) => setPageSize(parseInt(v))}
            >
              <SelectTrigger className="w-20 glass">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </>
      )}
    </div>
  );
}

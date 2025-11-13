"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { apiClient, Product, User, Order, Transaction } from "@/lib/api"
import { ChevronLeft, ChevronRight, Search, ArrowUpDown, Loader2 } from "lucide-react"

type DataType = Product | User | Order | Transaction

interface DataTableProps<T extends DataType> {
  type: "products" | "users" | "orders" | "transactions"
  title: string
  columns: { key: keyof T; label: string; sortable?: boolean }[]
  filters?: React.ReactNode
}

export function DataTable<T extends DataType>({
  type,
  title,
  columns,
  filters,
}: DataTableProps<T>) {
  const [data, setData] = useState<T[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(50)
  const [totalPages, setTotalPages] = useState(0)
  const [search, setSearch] = useState("")
  const [sortBy, setSortBy] = useState<string>("")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc")
  const [responseTime, setResponseTime] = useState<number>(0)

  // Debounce search
  const [debouncedSearch, setDebouncedSearch] = useState("")
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), 500)
    return () => clearTimeout(timer)
  }, [search])

  // Fetch data
  const fetchData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      let response
      switch (type) {
        case "products":
          response = await apiClient.getProducts(
            page,
            pageSize,
            debouncedSearch,
            sortBy || "created_at",
            sortOrder
          )
          break
        case "users":
          response = await apiClient.getUsers(
            page,
            pageSize,
            debouncedSearch,
            undefined,
            sortBy || "signup_date",
            sortOrder
          )
          break
        case "orders":
          response = await apiClient.getOrders(
            page,
            pageSize,
            undefined,
            sortBy || "order_date",
            sortOrder
          )
          break
        case "transactions":
          response = await apiClient.getTransactions(
            page,
            pageSize,
            undefined,
            undefined,
            sortBy || "transaction_date",
            sortOrder
          )
          break
      }

      setData(response.data)
      setTotalPages(response.total_pages)
      setResponseTime(response.response_time_ms)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
    } finally {
      setLoading(false)
    }
  }, [type, page, pageSize, debouncedSearch, sortBy, sortOrder])

  useEffect(() => {
    setPage(1) // Reset to page 1 when filters change
    fetchData()
  }, [debouncedSearch, sortBy, sortOrder])

  useEffect(() => {
    fetchData()
  }, [page, pageSize])

  const handleSort = (key: string) => {
    if (sortBy === key) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
    } else {
      setSortBy(key)
      setSortOrder("desc")
    }
  }

  const formatValue = (value: any): string => {
    if (value === null || value === undefined) return "-"
    if (typeof value === "number") {
      if (Number.isInteger(value)) return value.toString()
      return value.toFixed(2)
    }
    if (typeof value === "string") {
      if (value.includes("T")) {
        // ISO date string
        return new Date(value).toLocaleDateString()
      }
      return value
    }
    return String(value)
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <h2 className="text-2xl font-bold">{title}</h2>
        <div className="text-sm text-gray-500">
          Response time: {responseTime.toFixed(2)}ms
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-4 rounded-lg border border-gray-200 bg-gray-50 p-4">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:gap-4">
          <div className="flex-1 space-y-2">
            <label className="text-sm font-medium">Search</label>
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sort By</label>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
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
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">Ascending</SelectItem>
                <SelectItem value="desc">Descending</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {filters && <div className="md:flex-1">{filters}</div>}

          <Button onClick={() => fetchData()} variant="outline" size="sm">
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Loading...
              </>
            ) : (
              "Refresh"
            )}
          </Button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {/* Loading State */}
      {loading && !error && (
        <div className="flex items-center justify-center rounded-lg border border-gray-200 bg-white py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
            <p className="text-sm text-gray-600">Loading data...</p>
          </div>
        </div>
      )}

      {/* Data Table */}
      {!loading && !error && (
        <>
          <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
            <Table>
              <TableHeader>
                <TableRow>
                  {columns.map((col) => (
                    <TableHead key={String(col.key)}>
                      <button
                        onClick={() => col.sortable && handleSort(String(col.key))}
                        className="flex items-center gap-2 font-semibold hover:text-gray-900"
                      >
                        {col.label}
                        {col.sortable && (
                          <ArrowUpDown
                            className={`h-4 w-4 transition-colors ${
                              sortBy === String(col.key)
                                ? "text-blue-600"
                                : "text-gray-300"
                            }`}
                          />
                        )}
                      </button>
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-32 text-center text-gray-500"
                    >
                      No data found
                    </TableCell>
                  </TableRow>
                ) : (
                  data.map((row, idx) => (
                    <TableRow key={idx}>
                      {columns.map((col) => (
                        <TableCell key={`${idx}-${String(col.key)}`}>
                          {formatValue(row[col.key])}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="text-sm text-gray-600">
              Page {page} of {totalPages} ({data.length} items)
            </div>

            <div className="flex items-center gap-2">
              <Button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1 || loading}
                variant="outline"
                size="sm"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>

              <div className="flex items-center gap-2">
                {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                  const pageNum = i + 1
                  return (
                    <Button
                      key={pageNum}
                      onClick={() => setPage(pageNum)}
                      variant={page === pageNum ? "default" : "outline"}
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>

              <Button
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages || loading}
                variant="outline"
                size="sm"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            <Select value={pageSize.toString()} onValueChange={(v) => setPageSize(parseInt(v))}>
              <SelectTrigger className="w-20">
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
  )
}

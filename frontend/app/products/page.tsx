"use client"

import { DataTable } from "@/components/data-table"
import { Product } from "@/lib/api"

export default function ProductsPage() {
  const columns: { key: keyof Product; label: string; sortable?: boolean }[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "sku", label: "SKU" },
    { key: "name", label: "Name", sortable: true },
    { key: "category", label: "Category", sortable: true },
    { key: "price", label: "Price", sortable: true },
    { key: "stock", label: "Stock", sortable: true },
    { key: "created_at", label: "Created", sortable: true },
  ]

  return (
    <DataTable
      type="products"
      title="Products"
      columns={columns}
    />
  )
}

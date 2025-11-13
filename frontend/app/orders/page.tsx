"use client"

import { DataTable } from "@/components/data-table"
import { Order } from "@/lib/api"

export default function OrdersPage() {
  const columns: { key: keyof Order; label: string; sortable?: boolean }[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "user_id", label: "User ID", sortable: true },
    { key: "product_id", label: "Product ID", sortable: true },
    { key: "quantity", label: "Quantity", sortable: true },
    { key: "total_price", label: "Total Price", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "order_date", label: "Order Date", sortable: true },
  ]

  return (
    <DataTable
      type="orders"
      title="Orders"
      columns={columns}
    />
  )
}

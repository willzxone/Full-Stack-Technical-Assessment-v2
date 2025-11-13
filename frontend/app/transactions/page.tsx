"use client"

import { DataTable } from "@/components/data-table"
import { Transaction } from "@/lib/api"

export default function TransactionsPage() {
  const columns: { key: keyof Transaction; label: string; sortable?: boolean }[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "order_id", label: "Order ID", sortable: true },
    { key: "amount", label: "Amount", sortable: true },
    { key: "currency", label: "Currency" },
    { key: "payment_method", label: "Payment Method", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "transaction_date", label: "Date", sortable: true },
  ]

  return (
    <DataTable
      type="transactions"
      title="Transactions"
      columns={columns}
    />
  )
}

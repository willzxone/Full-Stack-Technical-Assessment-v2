"use client"

import { DataTable } from "@/components/data-table"
import { User } from "@/lib/api"

export default function UsersPage() {
  const columns: { key: keyof User; label: string; sortable?: boolean }[] = [
    { key: "id", label: "ID", sortable: true },
    { key: "email", label: "Email", sortable: true },
    { key: "name", label: "Name" },
    { key: "country", label: "Country", sortable: true },
    { key: "signup_date", label: "Signup Date", sortable: true },
    { key: "total_orders", label: "Orders", sortable: true },
    { key: "lifetime_value", label: "Lifetime Value", sortable: true },
  ]

  return (
    <DataTable
      type="users"
      title="Users"
      columns={columns}
    />
  )
}

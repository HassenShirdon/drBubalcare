"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type LabReview = {
  id: string
  name: string
  date: string
  status: string
  patient: { name: string | null; email: string }
  metrics: { id: string; name: string; value: number; status: string }[]
}

export const columns: ColumnDef<LabReview>[] = [
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => {
      const patient = row.original.patient
      return (
        <div>
          <p className="font-medium text-text-medical-black">{patient.name ?? "Unknown"}</p>
          <p className="text-xs text-on-surface-variant">{patient.email}</p>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const patient = row.original.patient
      const search = (value as string).toLowerCase()
      return (
        (patient.name?.toLowerCase().includes(search) ?? false) ||
        patient.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lab Test" />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "abnormalCount",
    id: "abnormal",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Abnormal" />,
    cell: ({ row }) => {
      const count = row.original.metrics.filter((m) => m.status !== "NORMAL").length
      return count > 0 ? (
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-error/10 text-error text-xs font-bold">
          {count}
        </span>
      ) : (
        <span className="text-xs text-on-surface-variant">—</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        row.original.status === "REVIEW_NEEDED" ? "bg-error/10 text-error" : "bg-healing-teal/10 text-healing-teal"
      }`}>
        {row.original.status === "REVIEW_NEEDED" ? "Review Needed" : "Normal"}
      </span>
    ),
  },
]

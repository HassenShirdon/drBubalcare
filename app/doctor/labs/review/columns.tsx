"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type LabReview = {
  id: string
  name: string
  date: string
  status: string
  patient: { name: string | null; age: number | null; gender: string | null }
  metrics: { id: string; name: string; value: number; status: string }[]
}

export const columns: ColumnDef<LabReview>[] = [
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => {
      const patient = row.original.patient
      return (
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pulse-info-light text-xs font-semibold text-pulse-info">
            {patient.name?.charAt(0) ?? "P"}
          </div>
          <div>
            <p className="text-sm font-medium text-pulse-text-primary">{patient.name ?? "Unknown"}</p>
            <p className="text-xs text-pulse-text-muted">
              {patient.age ?? "—"} yrs &middot; {patient.gender ?? "—"}
            </p>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const patient = row.original.patient
      const search = (value as string).toLowerCase()
      return (patient.name?.toLowerCase().includes(search) ?? false)
    },
  },
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Test" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium text-pulse-text-primary">{row.original.name}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-pulse-text-secondary">
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
        <span className="inline-flex size-7 items-center justify-center rounded-lg bg-pulse-red-light text-xs font-medium tabular-nums text-pulse-red">
          {count}
        </span>
      ) : (
        <span className="text-xs text-pulse-text-muted">—</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span
        className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${
          row.original.status === "REVIEW_NEEDED"
            ? "bg-pulse-red-light text-pulse-red"
            : "bg-pulse-success-light text-pulse-success"
        }`}
      >
        {row.original.status === "REVIEW_NEEDED" ? "Review needed" : "Reviewed"}
      </span>
    ),
  },
]

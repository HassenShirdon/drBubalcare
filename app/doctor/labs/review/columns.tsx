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
          <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0" style={{ background: "#DBEAFE", color: "#3B82F6" }}>
            {patient.name?.charAt(0) ?? "P"}
          </div>
          <div>
            <p className="font-medium text-sm" style={{ color: "#0F172A" }}>{patient.name ?? "Unknown"}</p>
            <p className="text-xs" style={{ color: "#64748B" }}>
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
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lab Test" />,
    cell: ({ row }) => (
      <span className="text-sm font-medium" style={{ color: "#0F172A" }}>{row.original.name}</span>
    ),
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-sm" style={{ color: "#64748B" }}>
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
        <span className="inline-flex items-center justify-center size-7 rounded-full text-xs font-medium" style={{ background: "#FEF2F2", color: "#E63946" }}>
          {count}
        </span>
      ) : (
        <span className="text-xs" style={{ color: "#64748B" }}>—</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span
        className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
        style={
          row.original.status === "REVIEW_NEEDED"
            ? { background: "#FEF2F2", color: "#E63946" }
            : { background: "#DCFCE7", color: "#22C55E" }
        }
      >
        {row.original.status === "REVIEW_NEEDED" ? "Review Needed" : "Reviewed"}
      </span>
    ),
  },
]

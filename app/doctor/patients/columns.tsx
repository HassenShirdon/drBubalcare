"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DoctorPatient = {
  id: string
  name: string
  age: number | null
  gender: string | null
  appointmentCount: number
  lastVisit: string
}

export const columns: ColumnDef<DoctorPatient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-pulse-info-light text-xs font-semibold text-pulse-info">
          {row.original.name.charAt(0)}
        </div>
        <div>
          <p className="text-sm font-medium text-pulse-text-primary">{row.original.name}</p>
          <p className="text-xs text-pulse-text-muted">
            {row.original.age ?? "—"} yrs &middot; {row.original.gender ?? "—"}
          </p>
        </div>
      </div>
    ),
    filterFn: (row, id, value) => {
      const search = (value as string).toLowerCase()
      return row.original.name.toLowerCase().includes(search)
    },
  },
  {
    accessorKey: "appointmentCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Appointments" />,
    cell: ({ row }) => (
      <span className="inline-flex size-7 items-center justify-center rounded-lg bg-pulse-info-light text-xs font-medium tabular-nums text-pulse-info">
        {row.original.appointmentCount}
      </span>
    ),
  },
  {
    accessorKey: "lastVisit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last visit" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-pulse-text-secondary">
        {new Date(row.original.lastVisit).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
]

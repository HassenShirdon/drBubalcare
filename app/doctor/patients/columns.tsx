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
        <div className="w-9 h-9 rounded-full flex items-center justify-center font-semibold text-xs shrink-0" style={{ background: "#DBEAFE", color: "#3B82F6" }}>
          {row.original.name.charAt(0)}
        </div>
        <div>
          <p className="font-medium text-sm" style={{ color: "#0F172A" }}>{row.original.name}</p>
          <p className="text-xs" style={{ color: "#64748B" }}>
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
      <span className="inline-flex items-center justify-center size-7 rounded-full text-xs font-medium" style={{ background: "#DBEAFE", color: "#3B82F6" }}>
        {row.original.appointmentCount}
      </span>
    ),
  },
  {
    accessorKey: "lastVisit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Visit" />,
    cell: ({ row }) => (
      <span className="text-sm" style={{ color: "#64748B" }}>
        {new Date(row.original.lastVisit).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
]

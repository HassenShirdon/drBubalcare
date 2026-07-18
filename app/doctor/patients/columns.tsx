"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DoctorPatient = {
  id: string
  name: string
  email: string
  image: string | null
  appointmentCount: number
  lastVisit: string
}

export const columns: ColumnDef<DoctorPatient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.image && (
          <img src={row.original.image} alt="" className="size-8 rounded-full" />
        )}
        <div>
          <p className="font-medium text-text-medical-black">{row.original.name}</p>
          <p className="text-xs text-on-surface-variant">{row.original.email}</p>
        </div>
      </div>
    ),
    filterFn: (row, id, value) => {
      const search = (value as string).toLowerCase()
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "appointmentCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Appointments" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-clinical-navy/10 text-clinical-navy text-xs font-bold">
        {row.original.appointmentCount}
      </span>
    ),
  },
  {
    accessorKey: "lastVisit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Visit" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.lastVisit).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
]

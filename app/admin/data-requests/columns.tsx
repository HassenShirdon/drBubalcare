"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DataRequestEntry = {
  id: string
  patientId: string
  status: string
  requestedAt: string
  executeAt: string
  completedAt: string | null
  patient: { name: string | null; email: string }
}

const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Pending (30-day grace)', color: 'bg-[#FEF3C7] text-[#B45309] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-[#DBEAFE] text-[#1E40AF] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  COMPLETED: { label: 'Completed', color: 'bg-[#DCFCE7] text-[#15803D] px-2.5 py-0.5 rounded-full text-xs font-medium' },
  CANCELLED: { label: 'Cancelled', color: 'bg-[#F1F5F9] text-[#64748B] px-2.5 py-0.5 rounded-full text-xs font-medium' },
}

export const columns: ColumnDef<DataRequestEntry>[] = [
  {
    accessorKey: "requestedAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Requested" />,
    cell: ({ row }) => (
      <span className="text-sm text-[#64748B]">
        {new Date(row.original.requestedAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "patient",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div>
        <p className="font-medium text-[#0F172A]">{row.original.patient.name ?? "Unknown"}</p>
        <p className="text-xs text-[#64748B]">{row.original.patient.email}</p>
      </div>
    ),
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
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = STATUS_CONFIG[row.original.status] ?? { label: row.original.status, color: "" }
      return (
        <span className={`inline-flex items-center ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    accessorKey: "executeAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Execute After" />,
    cell: ({ row }) => (
      <span className="text-sm text-[#64748B]">
        {new Date(row.original.executeAt).toLocaleDateString("en-US", {
          month: "short", day: "numeric", year: "numeric",
        })}
      </span>
    ),
  },
]

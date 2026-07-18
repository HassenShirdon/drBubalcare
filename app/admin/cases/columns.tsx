"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { CASE_STATUS_CONFIG, SERVICE_TYPE_LABELS } from "@/lib/constants"

export type AdminCase = {
  id: string
  serviceType: string
  status: string
  createdAt: string
  patient: { name: string | null; email: string }
  specialist: { name: string | null; email: string } | null
}

export const columns: ColumnDef<AdminCase>[] = [
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
    accessorKey: "serviceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service Type" />,
    cell: ({ row }) => (
      <span className="text-sm text-text-medical-black">
        {SERVICE_TYPE_LABELS[row.original.serviceType] ?? row.original.serviceType}
      </span>
    ),
    filterFn: (row, id, value) => {
      const label = SERVICE_TYPE_LABELS[row.original.serviceType] ?? row.original.serviceType
      return label.toLowerCase().includes((value as string).toLowerCase())
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = CASE_STATUS_CONFIG[row.original.status] ?? { label: row.original.status, color: "" }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
          {config.label}
        </span>
      )
    },
  },
  {
    accessorKey: "specialist",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Specialist" />,
    cell: ({ row }) => {
      const specialist = row.original.specialist
      return specialist ? (
        <div>
          <p className="text-sm text-text-medical-black">{specialist.name ?? "Unknown"}</p>
          <p className="text-xs text-on-surface-variant">{specialist.email}</p>
        </div>
      ) : (
        <span className="text-xs text-on-surface-variant italic">Unassigned</span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    id: "actions",
    header: "Action",
    cell: ({ row }) => (
      <Link
        href={`/admin/cases/${row.original.id}`}
        className="text-clinical-navy hover:text-healing-teal"
      >
        <ArrowRight className="size-4" />
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
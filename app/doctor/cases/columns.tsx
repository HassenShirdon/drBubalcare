"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { CASE_STATUS_CONFIG, SERVICE_TYPE_LABELS, OPINION_STATUS_CONFIG } from "@/lib/constants"

export type DoctorCase = {
  id: string
  serviceType: string
  status: string
  createdAt: string
  patient: { name: string | null; email: string }
  opinions: { status: string }[]
}

export const columns: ColumnDef<DoctorCase>[] = [
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
    accessorKey: "opinionStatus",
    id: "opinion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Opinion" />,
    cell: ({ row }) => {
      const opinion = row.original.opinions?.[0]
      const status = opinion?.status ?? "NONE"
      const config = OPINION_STATUS_CONFIG[status] ?? { label: "Not Started", color: "bg-gray-100 text-gray-500" }
      return (
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${config.color}`}>
          {config.label}
        </span>
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
        href={`/doctor/cases/${row.original.id}`}
        className="text-clinical-navy hover:text-healing-teal"
      >
        <ArrowRight className="size-4" />
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

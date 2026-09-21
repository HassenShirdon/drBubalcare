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
  patient: { name: string | null; age: number | null; gender: string | null }
  opinions: { status: string }[]
}

const FALLBACK_BADGE = 'bg-pulse-surface-elevated text-pulse-text-muted px-2.5 py-0.5 rounded-md text-xs font-medium'

export const columns: ColumnDef<DoctorCase>[] = [
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
    accessorKey: "serviceType",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Service" />,
    cell: ({ row }) => (
      <span className="text-sm text-pulse-text-primary">
        {SERVICE_TYPE_LABELS[row.original.serviceType] ?? row.original.serviceType}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const config = CASE_STATUS_CONFIG[row.original.status]
      return (
        <span className={`inline-flex items-center ${config?.color ?? FALLBACK_BADGE}`}>
          {config?.label ?? row.original.status}
        </span>
      )
    },
  },
  {
    accessorKey: "opinionStatus",
    id: "opinion",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Opinion" />,
    cell: ({ row }) => {
      const status = row.original.opinions?.[0]?.status ?? "NONE"
      const config = OPINION_STATUS_CONFIG[status]
      return (
        <span className={`inline-flex items-center ${config?.color ?? FALLBACK_BADGE}`}>
          {config?.label ?? "Not started"}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-pulse-text-secondary">
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
        aria-label="Open case"
        className="inline-flex rounded-md p-1 text-pulse-info transition-colors hover:bg-pulse-info-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-pulse-info/40"
      >
        <ArrowRight className="size-4" aria-hidden="true" />
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

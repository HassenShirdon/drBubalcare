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

const STATUS_COLORS: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: "#DBEAFE", color: "#1E40AF" },
  AI_PRE_SCREENED: { bg: "#DBEAFE", color: "#1E40AF" },
  UNDER_REVIEW: { bg: "#FEF3C7", color: "#B45309" },
  OPINION_READY: { bg: "#DCFCE7", color: "#15803D" },
  CLOSED: { bg: "#F1F5F9", color: "#64748B" },
  DISPUTED: { bg: "#FEF2F2", color: "#B91C1C" },
}

const OPINION_COLORS: Record<string, { bg: string; color: string }> = {
  DRAFT: { bg: "#FEF3C7", color: "#B45309" },
  SIGNED: { bg: "#DCFCE7", color: "#15803D" },
  DELIVERED: { bg: "#DBEAFE", color: "#1E40AF" },
  NONE: { bg: "#F1F5F9", color: "#64748B" },
}

export const columns: ColumnDef<DoctorCase>[] = [
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
            <p className="text-xs" style={{ color: "#64748B" }}>{patient.email}</p>
          </div>
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
      <span className="text-sm" style={{ color: "#0F172A" }}>
        {SERVICE_TYPE_LABELS[row.original.serviceType] ?? row.original.serviceType}
      </span>
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => {
      const colors = STATUS_COLORS[row.original.status] ?? { bg: "#F1F5F9", color: "#64748B" }
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ background: colors.bg, color: colors.color }}
        >
          {row.original.status}
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
      const colors = OPINION_COLORS[status] ?? OPINION_COLORS.NONE
      return (
        <span
          className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
          style={{ background: colors.bg, color: colors.color }}
        >
          {status === "NONE" ? "Not Started" : status}
        </span>
      )
    },
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Created" />,
    cell: ({ row }) => (
      <span className="text-sm" style={{ color: "#64748B" }}>
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
        style={{ color: "#3B82F6" }}
      >
        <ArrowRight className="size-4" />
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]

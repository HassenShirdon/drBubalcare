"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { ArrowRight, UserPlus, MoreHorizontal, Eye, CheckCircle, Stethoscope } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { CASE_STATUS_CONFIG, SERVICE_TYPE_LABELS } from "@/lib/constants"

export type AdminCase = {
  id: string
  serviceType: string
  status: string
  createdAt: string
  patient: { name: string | null; email: string }
  specialist: { name: string | null; email: string } | null
}

type Specialist = { id: string; name: string | null; email: string; specialty: string }

function CaseActions({ caseItem }: { caseItem: AdminCase }) {
  const [open, setOpen] = useState(false)
  const [specialists, setSpecialists] = useState<Specialist[]>([])
  const [loading, setLoading] = useState(false)
  const [assigning, setAssigning] = useState<string | null>(null)

  async function loadSpecialists() {
    if (specialists.length > 0) return
    const res = await fetch("/api/admin/specialists")
    if (res.ok) {
      const data = await res.json()
      setSpecialists(
        data
          .filter((d: { verified: boolean }) => d.verified)
          .map((d: { user: Specialist; specialty: string }) => ({
            id: d.user.id,
            name: d.user.name,
            email: d.user.email,
            specialty: d.specialty,
          }))
      )
    }
  }

  async function assign(specialistId: string) {
    setAssigning(specialistId)
    try {
      const res = await fetch(`/api/admin/cases/${caseItem.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialistId }),
      })
      if (res.ok) {
        window.location.reload()
      }
    } finally {
      setAssigning(null)
    }
  }

  return (
    <DropdownMenu
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (isOpen) loadSpecialists()
      }}
    >
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <span className="inline-flex items-center justify-center size-8 rounded-md text-on-surface-variant hover:bg-surface hover:text-text-medical-black transition-colors cursor-pointer" />
        }
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem className="text-xs">
          <Eye className="size-3.5 mr-2" />
          View Details
        </DropdownMenuItem>

        {!caseItem.specialist && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-semibold text-on-surface-variant uppercase tracking-wider mb-1.5">
                Assign Specialist
              </p>
              {specialists.length === 0 ? (
                <p className="text-[11px] text-on-surface-variant italic">Loading specialists...</p>
              ) : (
                <div className="max-h-48 overflow-y-auto space-y-0.5">
                  {specialists.map((s) => {
                    const initials = (s.name ?? "U")
                      .split(" ")
                      .map((w) => w[0])
                      .slice(0, 2)
                      .join("")
                      .toUpperCase()
                    return (
                      <button
                        key={s.id}
                        onClick={() => assign(s.id)}
                        disabled={assigning === s.id}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-surface transition-colors text-left disabled:opacity-50"
                      >
                        <div className="w-6 h-6 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy text-[9px] font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-text-medical-black truncate">
                            {s.name ?? "Unknown"}
                          </p>
                          <p className="text-[10px] text-on-surface-variant truncate flex items-center gap-1">
                            <Stethoscope className="size-2.5" />
                            {s.specialty}
                          </p>
                        </div>
                        {assigning === s.id && (
                          <CheckCircle className="size-3 text-healing-teal shrink-0 animate-pulse" />
                        )}
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
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
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy text-[9px] font-bold shrink-0">
            {(specialist.name ?? "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-text-medical-black truncate">{specialist.name ?? "Unknown"}</p>
            <p className="text-[11px] text-on-surface-variant truncate">{specialist.email}</p>
          </div>
        </div>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          <UserPlus className="size-3" />
          Unassigned
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
    header: "",
    cell: ({ row }) => <CaseActions caseItem={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]

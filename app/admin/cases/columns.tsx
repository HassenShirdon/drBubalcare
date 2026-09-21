"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { MoreHorizontal, Eye, UserPlus, CheckCircle, Stethoscope } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { queryKeys } from "@/lib/query-keys"
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

type SpecialistRow = { user: Specialist; specialty: string; verified: boolean }

function CaseActions({ caseItem }: { caseItem: AdminCase }) {
  const [open, setOpen] = useState(false)
  const queryClient = useQueryClient()

  // Lazy: only fetched the first time the dropdown is opened. Shares the
  // ['admin-specialists'] cache with the specialists page and the raw
  // endpoint shape { data, total } (the old code filtered the envelope
  // directly, so the dropdown never populated after pagination was added).
  const { data: res } = useQuery<{ data: SpecialistRow[]; total: number }>({
    queryKey: queryKeys.admin.specialists,
    queryFn: async () => {
      const res = await fetch("/api/admin/specialists")
      if (!res.ok) throw new Error("Failed to fetch specialists")
      return res.json()
    },
    enabled: open,
    staleTime: 60 * 1000,
  })

  const specialists = (res?.data ?? [])
    .filter((d) => d.verified)
    .map(({ user, specialty }) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      specialty,
    }))

  const assignMutation = useMutation({
    mutationFn: async ({ specialistId }: { specialistId: string; name: string | null; email: string }) => {
      const res = await fetch(`/api/admin/cases/${caseItem.id}/assign`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ specialistId }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error || "Failed to assign specialist")
      }
      return res.json()
    },
    // Optimistic update: show the specialist + UNDER_REVIEW immediately,
    // roll back if the assignment fails (e.g. case just closed or disputed)
    onMutate: async ({ name, email }) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.cases.list })
      const previous = queryClient.getQueryData<{
        data: AdminCase[]
        total: number
      }>(queryKeys.admin.cases.list)
      queryClient.setQueryData<{
        data: AdminCase[]
        total: number
      }>(queryKeys.admin.cases.list, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((c) =>
                c.id === caseItem.id
                  ? { ...c, specialist: { name, email }, status: "UNDER_REVIEW" }
                  : c
              ),
            }
          : old
      )
      return { previous }
    },
    onError: (_err, _vars, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.admin.cases.list, context.previous)
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.cases.list })
    },
  })

  const assigning = assignMutation.variables?.specialistId ?? null
  const isAssigning = assignMutation.isPending && assigning !== null

  return (
    <DropdownMenu
      onOpenChange={(isOpen) => setOpen(isOpen)}
    >
      <DropdownMenuTrigger className="inline-flex items-center justify-center size-8 rounded-md text-admin-text-faint hover:bg-admin-surface-elevated hover:text-admin-text transition-colors cursor-pointer">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem>
          <Eye className="size-3.5 mr-2" />
          View Details
        </DropdownMenuItem>

        {!caseItem.specialist && (
          <>
            <DropdownMenuSeparator />
            <div className="px-2 py-1.5">
              <p className="text-[10px] font-semibold text-admin-text-faint uppercase tracking-wider mb-1.5">
                Assign Specialist
              </p>
              {specialists.length === 0 ? (
                <p className="text-[11px] text-admin-text-faint italic">Loading specialists...</p>
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
                        onClick={() => {
                          const specialist = specialists.find((sp) => sp.id === s.id)
                          assignMutation.mutate({
                            specialistId: s.id,
                            name: specialist?.name ?? "Unknown",
                            email: specialist?.email ?? "",
                          })
                        }}
                        disabled={isAssigning && assigning === s.id}
                        className="w-full flex items-center gap-2 px-2 py-1.5 rounded-md hover:bg-admin-surface-elevated transition-colors text-left disabled:opacity-50"
                      >
                        <div className="w-6 h-6 rounded-full bg-admin-brand-light flex items-center justify-center text-admin-accent-blue text-[9px] font-bold shrink-0">
                          {initials}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-medium text-admin-text truncate">
                            {s.name ?? "Unknown"}
                          </p>
                          <p className="text-[10px] text-admin-text-faint truncate flex items-center gap-1">
                            <Stethoscope className="size-2.5" />
                            {s.specialty}
                          </p>
                        </div>
                        {isAssigning && assigning === s.id && (
                          <CheckCircle className="size-3 text-admin-success shrink-0 animate-pulse" />
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
          <p className="font-medium text-admin-text">{patient.name ?? "Unknown"}</p>
          <p className="text-xs text-admin-text-faint">{patient.email}</p>
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
      <span className="text-sm text-admin-text">
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
        <span className={`inline-flex items-center ${config.color}`}>
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
          <div className="w-6 h-6 rounded-full bg-admin-brand-light flex items-center justify-center text-admin-accent-blue text-[9px] font-bold shrink-0">
            {(specialist.name ?? "U").split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-sm text-admin-text truncate">{specialist.name ?? "Unknown"}</p>
            <p className="text-[11px] text-admin-text-faint truncate">{specialist.email}</p>
          </div>
        </div>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-admin-warning bg-admin-warning-light px-2 py-0.5 rounded-full">
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
      <span className="text-sm text-admin-text-faint">
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

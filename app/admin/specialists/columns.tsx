"use client"

import { ColumnDef } from "@tanstack/react-table"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { BadgeCheck, BadgeX, MoreHorizontal, Eye, CheckCircle, XCircle, Stethoscope } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { queryKeys } from "@/lib/query-keys"

export type AdminSpecialist = {
  id: string
  specialty: string
  experience: number
  verified: boolean
  user: { id: string; name: string | null; email: string; createdAt: string }
}

function SpecialistActions({ specialist }: { specialist: AdminSpecialist }) {
  const queryClient = useQueryClient()

  const verifyMutation = useMutation({
    mutationFn: async (verified: boolean) => {
      const res = await fetch(`/api/admin/specialists/${specialist.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified }),
      })
      if (!res.ok) throw new Error("Failed to update")
      return res.json()
    },
    // Optimistic update: flip the verified flag immediately, roll back on error
    onMutate: async (verified: boolean) => {
      await queryClient.cancelQueries({ queryKey: queryKeys.admin.specialists })
      const previous = queryClient.getQueryData<{
        data: AdminSpecialist[]
        total: number
      }>(queryKeys.admin.specialists)
      queryClient.setQueryData<{
        data: AdminSpecialist[]
        total: number
      }>(queryKeys.admin.specialists, (old) =>
        old
          ? {
              ...old,
              data: old.data.map((s) =>
                s.id === specialist.id ? { ...s, verified } : s
              ),
            }
          : old
      )
      return { previous }
    },
    onError: (_err, _verified, context) => {
      if (context?.previous) {
        queryClient.setQueryData(queryKeys.admin.specialists, context.previous)
      }
    },
    onSettled: () =>
      queryClient.invalidateQueries({ queryKey: queryKeys.admin.specialists }),
  })

  const loading = verifyMutation.isPending

  function toggleVerify() {
    verifyMutation.mutate(!specialist.verified)
  }

  return (
      <DropdownMenu>
      <DropdownMenuTrigger className="inline-flex items-center justify-center size-8 rounded-md text-admin-text-faint hover:bg-admin-surface-elevated hover:text-admin-text transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40">
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="size-4" aria-hidden="true" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem>
          <Eye className="size-3.5 mr-2" aria-hidden="true" />
          View profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {specialist.verified ? (
          <DropdownMenuItem
            onClick={toggleVerify}
            disabled={loading}
            className="text-admin-warning focus:text-admin-warning"
          >
            <XCircle className="size-3.5 mr-2" aria-hidden="true" />
            {loading ? "Revoking..." : "Revoke verification"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={toggleVerify}
            disabled={loading}
            className="text-admin-success focus:text-admin-success"
          >
            <CheckCircle className="size-3.5 mr-2" aria-hidden="true" />
            {loading ? "Verifying..." : "Verify specialist"}
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const columns: ColumnDef<AdminSpecialist>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Specialist" />,
    cell: ({ row }) => {
      const user = row.original.user
      const initials = (user.name ?? "U")
        .split(" ")
        .map((w) => w[0])
        .slice(0, 2)
        .join("")
        .toUpperCase()
      return (
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-admin-brand-light flex items-center justify-center text-admin-accent-blue text-xs font-semibold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-admin-text text-sm truncate">{user.name ?? "Unknown"}</p>
            <p className="text-[11px] text-admin-text-faint truncate">{user.email}</p>
          </div>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      const user = row.original.user
      const search = (value as string).toLowerCase()
      return (
        (user.name?.toLowerCase().includes(search) ?? false) ||
        user.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "specialty",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Specialty" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-1.5">
        <Stethoscope className="size-3.5 text-admin-text-faint" />
        <span className="text-sm text-admin-text">{row.original.specialty}</span>
      </div>
    ),
  },
  {
    accessorKey: "experience",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Experience" />,
    cell: ({ row }) => (
      <span className="text-sm tabular-nums text-admin-text-faint">{row.original.experience} yrs</span>
    ),
  },
  {
    accessorKey: "verified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      row.original.verified ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-admin-success bg-admin-success-light px-2 py-0.5 rounded-md">
          <BadgeCheck className="size-3" aria-hidden="true" /> Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-admin-warning bg-admin-warning-light px-2 py-0.5 rounded-md">
          <BadgeX className="size-3" aria-hidden="true" /> Pending
        </span>
      )
    ),
    filterFn: (row, id, value) => {
      if (value === "all") return true
      if (value === "verified") return row.original.verified === true
      if (value === "unverified") return row.original.verified === false
      return true
    },
  },
  {
    accessorKey: "user.createdAt",
    id: "joined",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Joined" />,
    cell: ({ row }) => (
      <span className="text-sm text-admin-text-faint">
        {new Date(row.original.user.createdAt).toLocaleDateString("en-US", {
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
    cell: ({ row }) => <SpecialistActions specialist={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]

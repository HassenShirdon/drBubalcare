"use client"

import { ColumnDef } from "@tanstack/react-table"
import { BadgeCheck, BadgeX } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type AdminSpecialist = {
  id: string
  specialty: string
  experience: number
  verified: boolean
  user: { id: string; name: string | null; email: string; createdAt: string }
}

export const columns: ColumnDef<AdminSpecialist>[] = [
  {
    accessorKey: "user",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Name" />,
    cell: ({ row }) => {
      const user = row.original.user
      return (
        <div>
          <p className="font-medium text-text-medical-black">{user.name ?? "Unknown"}</p>
          <p className="text-xs text-on-surface-variant">{user.email}</p>
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
  },
  {
    accessorKey: "verified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      row.original.verified ? (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-healing-teal">
          <BadgeCheck className="size-3.5" /> Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-xs font-bold text-amber-600">
          <BadgeX className="size-3.5" /> Pending
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
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.user.createdAt).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
]

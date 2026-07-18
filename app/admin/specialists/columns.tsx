"use client"

import { useState } from "react"
import { ColumnDef } from "@tanstack/react-table"
import { BadgeCheck, BadgeX, MoreHorizontal, Eye, CheckCircle, XCircle, Stethoscope } from "lucide-react"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export type AdminSpecialist = {
  id: string
  specialty: string
  experience: number
  verified: boolean
  user: { id: string; name: string | null; email: string; createdAt: string }
}

function SpecialistActions({ specialist }: { specialist: AdminSpecialist }) {
  const [loading, setLoading] = useState(false)

  async function toggleVerify() {
    setLoading(true)
    try {
      await fetch(`/api/admin/specialists/${specialist.id}/verify`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ verified: !specialist.verified }),
      })
      window.location.reload()
    } finally {
      setLoading(false)
    }
  }

  return (
      <DropdownMenu>
      <DropdownMenuTrigger
        nativeButton={false}
        render={
          <span className="inline-flex items-center justify-center size-8 rounded-md text-on-surface-variant hover:bg-surface hover:text-text-medical-black transition-colors cursor-pointer" />
        }
      >
        <span className="sr-only">Open menu</span>
        <MoreHorizontal className="size-4" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem className="text-xs">
          <Eye className="size-3.5 mr-2" />
          View Profile
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        {specialist.verified ? (
          <DropdownMenuItem
            onClick={toggleVerify}
            disabled={loading}
            className="text-xs text-amber-600 focus:text-amber-600"
          >
            <XCircle className="size-3.5 mr-2" />
            {loading ? "Revoking..." : "Revoke Verification"}
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={toggleVerify}
            disabled={loading}
            className="text-xs text-healing-teal focus:text-healing-teal"
          >
            <CheckCircle className="size-3.5 mr-2" />
            {loading ? "Verifying..." : "Verify Specialist"}
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
          <div className="w-9 h-9 rounded-full bg-clinical-navy/10 flex items-center justify-center text-clinical-navy text-xs font-bold shrink-0">
            {initials}
          </div>
          <div className="min-w-0">
            <p className="font-medium text-text-medical-black text-sm truncate">{user.name ?? "Unknown"}</p>
            <p className="text-[11px] text-on-surface-variant truncate">{user.email}</p>
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
        <Stethoscope className="size-3.5 text-on-surface-variant" />
        <span className="text-sm text-text-medical-black">{row.original.specialty}</span>
      </div>
    ),
  },
  {
    accessorKey: "experience",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Experience" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">{row.original.experience} yrs</span>
    ),
  },
  {
    accessorKey: "verified",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      row.original.verified ? (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-healing-teal bg-healing-teal/10 px-2 py-0.5 rounded-full">
          <BadgeCheck className="size-3" /> Verified
        </span>
      ) : (
        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
          <BadgeX className="size-3" /> Pending
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
  {
    id: "actions",
    header: "",
    cell: ({ row }) => <SpecialistActions specialist={row.original} />,
    enableSorting: false,
    enableHiding: false,
  },
]

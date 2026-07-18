# Data Table Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace all manual tables and card lists with shadcn Data Tables powered by TanStack Table — adding sorting, filtering, column visibility, and pagination across admin and doctor portals.

**Architecture:** Build a reusable `<DataTable>` component with sortable column headers, text search filtering, column visibility toggle, and pagination. Extract shared status/type constants to eliminate duplication. Migrate 6 pages from raw HTML / card layouts to data tables.

**Tech Stack:** Next.js 15.5.20, @tanstack/react-table v8.21.3, shadcn/ui Table component, Lucide React, Tailwind CSS v4

## Global Constraints

- Next.js 15.5.20 with App Router + Turbopack
- @tanstack/react-table v8.21.3 (already installed)
- shadcn/ui Table component (already installed at `components/ui/table.tsx`)
- All table pages are client components (`"use client"`)
- Design tokens: clinical-navy, healing-teal, surface-gray, text-medical-black, on-surface-variant
- Existing card layouts in patient portals may be kept as-is (patient UX preference)

---

## File Structure

| File | Purpose |
|------|---------|
| `components/ui/data-table.tsx` | Reusable DataTable with sorting, filtering, pagination, column visibility |
| `components/ui/data-table-column-header.tsx` | Sortable column header with sort direction + hide option |
| `components/ui/data-table-pagination.tsx` | Pagination controls with page size selector |
| `components/ui/data-table-view-options.tsx` | Column visibility toggle dropdown |
| `lib/constants.ts` | Shared status configs, service type labels, role labels |
| `app/admin/cases/columns.tsx` | Admin cases column definitions |
| `app/admin/cases/page.tsx` | Modified — uses DataTable |
| `app/admin/specialists/columns.tsx` | Admin specialists column definitions |
| `app/admin/specialists/page.tsx` | Modified — uses DataTable |
| `app/admin/news/columns.tsx` | Admin news column definitions |
| `app/admin/news/page.tsx` | Modified — uses DataTable |
| `app/doctor/cases/columns.tsx` | Doctor cases column definitions |
| `app/doctor/cases/page.tsx` | Modified — uses DataTable |
| `app/doctor/patients/columns.tsx` | Doctor patients column definitions |
| `app/doctor/patients/page.tsx` | Modified — uses DataTable |
| `app/doctor/labs/review/columns.tsx` | Doctor lab reviews column definitions |
| `app/doctor/labs/review/page.tsx` | Modified — uses DataTable |

---

### Task 1: Build Reusable DataTable Components

**Files:**
- Create: `components/ui/data-table.tsx`
- Create: `components/ui/data-table-column-header.tsx`
- Create: `components/ui/data-table-pagination.tsx`
- Create: `components/ui/data-table-view-options.tsx`

**Interfaces:**
- Produces: `<DataTable columns={columns} data={data} />` — generic component with sorting, filtering, pagination, column visibility

- [ ] **Step 1: Create DataTableColumnHeader component**

Create `components/ui/data-table-column-header.tsx`:

```tsx
"use client"

import { type Column } from "@tanstack/react-table"
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface DataTableColumnHeaderProps<TData, TValue>
  extends React.HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  title: string
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  title,
  className,
}: DataTableColumnHeaderProps<TData, TValue>) {
  if (!column.getCanSort()) {
    return <div className={cn(className)}>{title}</div>
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-8 data-[state=open]:bg-accent"
          >
            <span>{title}</span>
            {column.getIsSorted() === "desc" ? (
              <ArrowDown />
            ) : column.getIsSorted() === "asc" ? (
              <ArrowUp />
            ) : (
              <ChevronsUpDown />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
            <ArrowUp />
            Asc
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
            <ArrowDown />
            Desc
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
            <EyeOff />
            Hide
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  )
}
```

- [ ] **Step 2: Create DataTablePagination component**

Create `components/ui/data-table-pagination.tsx`:

```tsx
"use client"

import { type Table } from "@tanstack/react-table"
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DataTablePaginationProps<TData> {
  table: Table<TData>
}

export function DataTablePagination<TData>({
  table,
}: DataTablePaginationProps<TData>) {
  return (
    <div className="flex items-center justify-between px-2">
      <div className="flex-1 text-sm text-on-surface-variant">
        {table.getFilteredSelectedRowModel().rows.length} of{" "}
        {table.getFilteredRowModel().rows.length} row(s) selected.
      </div>
      <div className="flex items-center space-x-6 lg:space-x-8">
        <div className="flex items-center space-x-2">
          <p className="text-sm font-medium text-on-surface-variant">Rows per page</p>
          <Select
            value={`${table.getState().pagination.pageSize}`}
            onValueChange={(value) => {
              table.setPageSize(Number(value))
            }}
          >
            <SelectTrigger className="h-8 w-[70px]">
              <SelectValue placeholder={table.getState().pagination.pageSize} />
            </SelectTrigger>
            <SelectContent side="top">
              {[10, 20, 25, 50].map((pageSize) => (
                <SelectItem key={pageSize} value={`${pageSize}`}>
                  {pageSize}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex w-[100px] items-center justify-center text-sm font-medium text-on-surface-variant">
          Page {table.getState().pagination.pageIndex + 1} of{" "}
          {table.getPageCount()}
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to first page</span>
            <ChevronsLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            <span className="sr-only">Go to previous page</span>
            <ChevronLeft />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="size-8"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to next page</span>
            <ChevronRight />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="hidden size-8 lg:flex"
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            <span className="sr-only">Go to last page</span>
            <ChevronsRight />
          </Button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Create DataTableViewOptions component**

Create `components/ui/data-table-view-options.tsx`:

```tsx
"use client"

import { type Table } from "@tanstack/react-table"
import { Settings2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export function DataTableViewOptions<TData>({
  table,
}: {
  table: Table<TData>
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto hidden h-8 lg:flex">
          <Settings2 />
          View
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {table
          .getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(!!value)}
              >
                {column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
```

- [ ] **Step 4: Create reusable DataTable component**

Create `components/ui/data-table.tsx`:

```tsx
"use client"

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"

import { Input } from "@/components/ui/input"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "@/components/ui/data-table-pagination"
import { DataTableViewOptions } from "@/components/ui/data-table-view-options"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  searchKey?: string
  searchPlaceholder?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
  searchPlaceholder = "Search...",
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
  const [rowSelection, setRowSelection] = React.useState({})

  const table = useReactTable({
    data,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {searchKey && (
            <Input
              placeholder={searchPlaceholder}
              value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn(searchKey)?.setFilterValue(event.target.value)
              }
              className="h-8 max-w-sm"
            />
          )}
        </div>
        <DataTableViewOptions table={table} />
      </div>
      <div className="rounded-md border border-surface-gray">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}
```

- [ ] **Step 5: Verify build**

Run: `npx tsc --noEmit` from `C:\Users\Shirdon Hassen T\Desktop\DrBubalCare`

- [ ] **Step 6: Commit**

```bash
git add components/ui/data-table.tsx components/ui/data-table-column-header.tsx components/ui/data-table-pagination.tsx components/ui/data-table-view-options.tsx
git commit -m "feat: add reusable DataTable components with sorting, filtering, pagination, column visibility"
```

---

### Task 2: Extract Shared Constants

**Files:**
- Create: `lib/constants.ts`

**Interfaces:**
- Produces: `CASE_STATUS_CONFIG`, `SERVICE_TYPE_LABELS`, `LAB_STATUS_CONFIG`, `OPINION_STATUS_CONFIG`

- [ ] **Step 1: Create shared constants file**

Create `lib/constants.ts`:

```typescript
export const CASE_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  OPEN: { label: 'Open', color: 'bg-blue-50 text-blue-600' },
  AI_PRE_SCREENED: { label: 'Pre-screened', color: 'bg-purple-50 text-purple-600' },
  UNDER_REVIEW: { label: 'Under Review', color: 'bg-amber-50 text-amber-600' },
  OPINION_READY: { label: 'Opinion Ready', color: 'bg-healing-teal/10 text-healing-teal' },
  CLOSED: { label: 'Closed', color: 'bg-gray-100 text-gray-500' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
}

export const SERVICE_TYPE_LABELS: Record<string, string> = {
  SPECIALIST_OPINION: 'Specialist Opinion',
  RESULT_INTERPRETATION: 'Result Interpretation',
  FOLLOW_UP: 'Follow-up Consultation',
  TREND_ANALYSIS: 'Lab Trend Analysis',
}

export const LAB_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'bg-healing-teal/10 text-healing-teal' },
  REVIEW_NEEDED: { label: 'Review Needed', color: 'bg-error/10 text-error' },
}

export const OPINION_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Draft', color: 'bg-amber-50 text-amber-600' },
  SIGNED: { label: 'Signed', color: 'bg-healing-teal/10 text-healing-teal' },
  DELIVERED: { label: 'Delivered', color: 'bg-blue-50 text-blue-600' },
  DISPUTED: { label: 'Disputed', color: 'bg-red-50 text-red-600' },
}

export const METRIC_STATUS_CONFIG: Record<string, { label: string; color: string }> = {
  NORMAL: { label: 'Normal', color: 'text-clinical-navy' },
  HIGH: { label: 'High', color: 'text-error' },
  LOW: { label: 'Low', color: 'text-error' },
}
```

- [ ] **Step 2: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 3: Commit**

```bash
git add lib/constants.ts
git commit -m "feat: extract shared status and type constants to lib/constants.ts"
```

---

### Task 3: Migrate Admin Cases to DataTable

**Files:**
- Create: `app/admin/cases/columns.tsx`
- Modify: `app/admin/cases/page.tsx`

**Interfaces:**
- Consumes: `DataTable` (Task 1), `CASE_STATUS_CONFIG`, `SERVICE_TYPE_LABELS` (Task 2)
- Produces: Admin cases page with sortable/filterable data table

- [ ] **Step 1: Read current page**

Read: `app/admin/cases/page.tsx` — understand the current data shape, inline queries, and manual filtering logic.

- [ ] **Step 2: Create column definitions**

Create `app/admin/cases/columns.tsx`:

```tsx
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
```

- [ ] **Step 3: Rewrite admin cases page**

Replace `app/admin/cases/page.tsx` — remove manual search/filter logic, use DataTable:

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, type AdminCase } from "./columns"

export default function AdminCasesPage() {
  const { data: cases, isLoading } = useQuery<AdminCase[]>({
    queryKey: ["admin-cases"],
    queryFn: async () => {
      const res = await fetch("/api/admin/cases")
      if (!res.ok) throw new Error("Failed to fetch cases")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Case Management</h1>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={cases ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add app/admin/cases/
git commit -m "feat: migrate admin cases to DataTable with sorting, filtering, column visibility"
```

---

### Task 4: Migrate Admin Specialists to DataTable

**Files:**
- Create: `app/admin/specialists/columns.tsx`
- Modify: `app/admin/specialists/page.tsx`

**Interfaces:**
- Consumes: `DataTable` (Task 1)
- Produces: Admin specialists page with sortable/filterable data table

- [ ] **Step 1: Read current page**

Read: `app/admin/specialists/page.tsx`

- [ ] **Step 2: Create column definitions**

Create `app/admin/specialists/columns.tsx`:

```tsx
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
```

- [ ] **Step 3: Rewrite admin specialists page**

Replace `app/admin/specialists/page.tsx` — use DataTable with tab filter for verification status:

```tsx
"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, type AdminSpecialist } from "./columns"

type TabFilter = "all" | "verified" | "unverified"

export default function AdminSpecialistsPage() {
  const [tabFilter, setTabFilter] = useState<TabFilter>("all")
  const { data: specialists, isLoading } = useQuery<AdminSpecialist[]>({
    queryKey: ["admin-specialists"],
    queryFn: async () => {
      const res = await fetch("/api/admin/specialists")
      if (!res.ok) throw new Error("Failed to fetch specialists")
      return res.json()
    },
    staleTime: 60 * 1000,
  })

  const filtered = specialists?.filter((s) => {
    if (tabFilter === "verified") return s.verified
    if (tabFilter === "unverified") return !s.verified
    return true
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Specialist Management</h1>
      </motion.div>

      {/* Tab filter */}
      <div className="flex gap-2">
        {(["all", "verified", "unverified"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tabFilter === tab
                ? "bg-clinical-navy text-white"
                : "bg-surface text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered ?? []}
          searchKey="user"
          searchPlaceholder="Search by name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add app/admin/specialists/
git commit -m "feat: migrate admin specialists to DataTable with sorting, filtering, column visibility"
```

---

### Task 5: Migrate Doctor Cases to DataTable

**Files:**
- Create: `app/doctor/cases/columns.tsx`
- Modify: `app/doctor/cases/page.tsx`

**Interfaces:**
- Consumes: `DataTable` (Task 1), `CASE_STATUS_CONFIG`, `SERVICE_TYPE_LABELS`, `OPINION_STATUS_CONFIG` (Task 2)
- Produces: Doctor cases page with sortable/filterable data table

- [ ] **Step 1: Read current page**

Read: `app/doctor/cases/page.tsx`

- [ ] **Step 2: Create column definitions**

Create `app/doctor/cases/columns.tsx`:

```tsx
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
```

- [ ] **Step 3: Rewrite doctor cases page**

Replace `app/doctor/cases/page.tsx` — remove card layout, use DataTable:

```tsx
"use client"

import { useState } from "react"
import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { useDoctorCases } from "@/lib/hooks/use-doctor-cases"
import { columns, type DoctorCase } from "./columns"

type TabFilter = "all" | "pending" | "opinion_written"

export default function DoctorCasesPage() {
  const { data: cases, isLoading } = useDoctorCases()
  const [tabFilter, setTabFilter] = useState<TabFilter>("all")

  const filtered = (cases as DoctorCase[] | undefined)?.filter((c) => {
    if (tabFilter === "pending") return !c.opinions?.length || c.opinions.every((o) => o.status === "DRAFT")
    if (tabFilter === "opinion_written") return c.opinions?.some((o) => o.status !== "DRAFT")
    return true
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Doctor Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">My Cases</h1>
      </motion.div>

      <div className="flex gap-2">
        {(["all", "pending", "opinion_written"] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setTabFilter(tab)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              tabFilter === tab
                ? "bg-clinical-navy text-white"
                : "bg-surface text-on-surface-variant hover:bg-surface-container-low"
            }`}
          >
            {tab === "all" ? "All" : tab === "pending" ? "Pending" : "Opinion Written"}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={filtered ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add app/doctor/cases/
git commit -m "feat: migrate doctor cases to DataTable with sorting, filtering, column visibility"
```

---

### Task 6: Migrate Doctor Patients to DataTable

**Files:**
- Create: `app/doctor/patients/columns.tsx`
- Modify: `app/doctor/patients/page.tsx`

**Interfaces:**
- Consumes: `DataTable` (Task 1)
- Produces: Doctor patients page with sortable data table

- [ ] **Step 1: Read current page**

Read: `app/doctor/patients/page.tsx`

- [ ] **Step 2: Create column definitions**

Create `app/doctor/patients/columns.tsx`:

```tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type DoctorPatient = {
  id: string
  name: string
  email: string
  image: string | null
  appointmentCount: number
  lastVisit: string
}

export const columns: ColumnDef<DoctorPatient>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Patient" />,
    cell: ({ row }) => (
      <div className="flex items-center gap-3">
        {row.original.image && (
          <img src={row.original.image} alt="" className="size-8 rounded-full" />
        )}
        <div>
          <p className="font-medium text-text-medical-black">{row.original.name}</p>
          <p className="text-xs text-on-surface-variant">{row.original.email}</p>
        </div>
      </div>
    ),
    filterFn: (row, id, value) => {
      const search = (value as string).toLowerCase()
      return (
        row.original.name.toLowerCase().includes(search) ||
        row.original.email.toLowerCase().includes(search)
      )
    },
  },
  {
    accessorKey: "appointmentCount",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Appointments" />,
    cell: ({ row }) => (
      <span className="inline-flex items-center justify-center size-6 rounded-full bg-clinical-navy/10 text-clinical-navy text-xs font-bold">
        {row.original.appointmentCount}
      </span>
    ),
  },
  {
    accessorKey: "lastVisit",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Last Visit" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.lastVisit).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
]
```

- [ ] **Step 3: Rewrite doctor patients page**

Replace `app/doctor/patients/page.tsx` — use DataTable:

```tsx
"use client"

import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { useQuery } from "@tanstack/react-query"
import { columns, type DoctorPatient } from "./columns"

export default function DoctorPatientsPage() {
  const { data: patients, isLoading } = useQuery<DoctorPatient[]>({
    queryKey: ["doctor-patients"],
    queryFn: async () => {
      const res = await fetch("/api/doctor/patients")
      if (!res.ok) throw new Error("Failed to fetch patients")
      return res.json()
    },
    staleTime: 5 * 60 * 1000,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Doctor Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">My Patients</h1>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={patients ?? []}
          searchKey="name"
          searchPlaceholder="Search by name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add app/doctor/patients/
git commit -m "feat: migrate doctor patients to DataTable with sorting, filtering, column visibility"
```

---

### Task 7: Migrate Admin News to DataTable

**Files:**
- Create: `app/admin/news/columns.tsx`
- Modify: `app/admin/news/page.tsx`

**Interfaces:**
- Consumes: `DataTable` (Task 1)
- Produces: Admin news page with sortable data table

- [ ] **Step 1: Read current page**

Read: `app/admin/news/page.tsx` — note it's a server component with `"use client"` for the table section.

- [ ] **Step 2: Create column definitions**

Create `app/admin/news/columns.tsx`:

```tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import Link from "next/link"
import { Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type AdminPost = {
  id: string
  title: string
  category: string | null
  published: boolean
  publishedAt: string | null
  createdAt: string
  author: { name: string | null }
}

export const columns: ColumnDef<AdminPost>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Title" />,
  },
  {
    accessorKey: "author",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Author" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">{row.original.author.name ?? "Unknown"}</span>
    ),
    filterFn: (row, id, value) => {
      return (row.original.author.name?.toLowerCase().includes((value as string).toLowerCase()) ?? false)
    },
  },
  {
    accessorKey: "category",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Category" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">{row.original.category ?? "—"}</span>
    ),
  },
  {
    accessorKey: "published",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        row.original.published ? "bg-healing-teal/10 text-healing-teal" : "bg-amber-50 text-amber-600"
      }`}>
        {row.original.published ? "Published" : "Draft"}
      </span>
    ),
  },
  {
    accessorKey: "createdAt",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
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
    header: "Actions",
    cell: ({ row }) => (
      <Link href={`/admin/news/${row.original.id}/edit`}>
        <Button variant="ghost" size="sm">
          <Pencil className="size-4" />
        </Button>
      </Link>
    ),
    enableSorting: false,
    enableHiding: false,
  },
]
```

- [ ] **Step 3: Rewrite admin news page**

The news page fetches data server-side. Keep the server data fetch but render via a client DataTable wrapper:

Replace `app/admin/news/page.tsx`:

```tsx
import { prisma } from "@/lib/db"
import { AdminNewsClient } from "./admin-news-client"

export default async function AdminNewsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  })

  const serialized = posts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
    publishedAt: p.publishedAt?.toISOString() ?? null,
  }))

  return <AdminNewsClient posts={serialized} />
}
```

Create `app/admin/news/admin-news-client.tsx`:

```tsx
"use client"

import { motion } from "motion/react"
import { DataTable } from "@/components/ui/data-table"
import { columns, type AdminPost } from "./columns"

interface AdminNewsClientProps {
  posts: AdminPost[]
}

export function AdminNewsClient({ posts }: AdminNewsClientProps) {
  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Admin Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">News Management</h1>
      </motion.div>

      <DataTable
        columns={columns}
        data={posts}
        searchKey="title"
        searchPlaceholder="Search by title..."
      />
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add app/admin/news/
git commit -m "feat: migrate admin news to DataTable with sorting, filtering, column visibility"
```

---

### Task 8: Migrate Doctor Lab Reviews to DataTable

**Files:**
- Create: `app/doctor/labs/review/columns.tsx`
- Modify: `app/doctor/labs/review/page.tsx`

**Interfaces:**
- Consumes: `DataTable` (Task 1), `LAB_STATUS_CONFIG` (Task 2)
- Produces: Doctor lab reviews page with sortable data table

- [ ] **Step 1: Read current page**

Read: `app/doctor/labs/review/page.tsx`

- [ ] **Step 2: Create column definitions**

Create `app/doctor/labs/review/columns.tsx`:

```tsx
"use client"

import { ColumnDef } from "@tanstack/react-table"
import { DataTableColumnHeader } from "@/components/ui/data-table-column-header"

export type LabReview = {
  id: string
  name: string
  date: string
  status: string
  patient: { name: string | null; email: string }
  metrics: { id: string; name: string; value: number; status: string }[]
}

export const columns: ColumnDef<LabReview>[] = [
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
    accessorKey: "name",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Lab Test" />,
  },
  {
    accessorKey: "date",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Date" />,
    cell: ({ row }) => (
      <span className="text-sm text-on-surface-variant">
        {new Date(row.original.date).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })}
      </span>
    ),
  },
  {
    accessorKey: "abnormalCount",
    id: "abnormal",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Abnormal" />,
    cell: ({ row }) => {
      const count = row.original.metrics.filter((m) => m.status !== "NORMAL").length
      return count > 0 ? (
        <span className="inline-flex items-center justify-center size-6 rounded-full bg-error/10 text-error text-xs font-bold">
          {count}
        </span>
      ) : (
        <span className="text-xs text-on-surface-variant">—</span>
      )
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => <DataTableColumnHeader column={column} title="Status" />,
    cell: ({ row }) => (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold ${
        row.original.status === "REVIEW_NEEDED" ? "bg-error/10 text-error" : "bg-healing-teal/10 text-healing-teal"
      }`}>
        {row.original.status === "REVIEW_NEEDED" ? "Review Needed" : "Normal"}
      </span>
    ),
  },
]
```

- [ ] **Step 3: Rewrite doctor lab reviews page**

Replace `app/doctor/labs/review/page.tsx` — use DataTable:

```tsx
"use client"

import { useQuery } from "@tanstack/react-query"
import { motion } from "motion/react"
import { Loader2 } from "lucide-react"
import { DataTable } from "@/components/ui/data-table"
import { columns, type LabReview } from "./columns"

export default function DoctorLabReviewPage() {
  const { data: labs, isLoading } = useQuery<LabReview[]>({
    queryKey: ["doctor-lab-reviews"],
    queryFn: async () => {
      const res = await fetch("/api/lab-results/pending-review")
      if (!res.ok) throw new Error("Failed to fetch lab reviews")
      return res.json()
    },
    staleTime: 2 * 60 * 1000,
  })

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-5">
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
        <p className="text-on-surface-variant text-sm mb-1">Doctor Portal</p>
        <h1 className="text-clinical-navy font-bold text-2xl md:text-3xl">Pending Lab Reviews</h1>
      </motion.div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="animate-spin text-healing-teal" size={32} />
        </div>
      ) : (
        <DataTable
          columns={columns}
          data={labs ?? []}
          searchKey="patient"
          searchPlaceholder="Search by patient name or email..."
        />
      )}
    </div>
  )
}
```

- [ ] **Step 4: Verify build**

Run: `npx tsc --noEmit`

- [ ] **Step 5: Commit**

```bash
git add app/doctor/labs/review/
git commit -m "feat: migrate doctor lab reviews to DataTable with sorting, filtering, column visibility"
```

---

### Task 9: Final Build & Verification

**Files:**
- No new files — verification only

- [ ] **Step 1: Full build**

Run: `pnpm build`

- [ ] **Step 2: Manual verification checklist**

Run: `pnpm dev` and verify each page:
- `/admin/cases` — sortable by patient/status/created, searchable, columns toggleable
- `/admin/specialists` — sortable by name/specialty/joined, searchable, tab filter works
- `/admin/news` — sortable by title/date/author, searchable
- `/doctor/cases` — sortable by patient/status/opinion/created, searchable, tab filter works
- `/doctor/patients` — sortable by name/appointments/last visit, searchable
- `/doctor/labs/review` — sortable by patient/lab/date/status, searchable

- [ ] **Step 3: Final commit (if any fixes needed)**

```bash
git add -A
git commit -m "fix: data table adjustments from final verification"
```

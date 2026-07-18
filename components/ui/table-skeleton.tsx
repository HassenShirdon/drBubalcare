"use client"

import { motion } from "motion/react"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  search?: boolean
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded bg-surface-gray/60 ${className ?? ""}`}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent"
        animate={{ translateX: ["0%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4, search = true }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {/* Search + view options bar */}
      {search && (
        <div className="flex items-center justify-between">
          <Shimmer className="h-8 w-64" />
          <Shimmer className="h-8 w-20" />
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border border-surface-gray">
        <div className="w-full">
          {/* Header */}
          <div className="flex items-center border-b border-surface-gray bg-surface/50 px-4 py-3">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="flex-1 px-2">
                <Shimmer className="h-3.5 w-20" />
              </div>
            ))}
          </div>

          {/* Rows */}
          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex items-center border-b border-surface-gray/50 px-4 py-3 last:border-b-0"
            >
              {Array.from({ length: columns }).map((_, colIdx) => {
                const widths = ["w-3/5", "w-4/5", "w-2/3", "w-3/4", "w-1/2"]
                return (
                  <div key={colIdx} className="flex-1 px-2">
                    <Shimmer className={`h-3.5 ${widths[colIdx % widths.length]}`} />
                  </div>
                )
              })}
            </div>
          ))}
        </div>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2">
        <Shimmer className="h-4 w-40" />
        <div className="flex items-center gap-2">
          <Shimmer className="h-8 w-20" />
          <Shimmer className="h-4 w-24" />
          <div className="flex gap-1">
            <Shimmer className="size-8" />
            <Shimmer className="size-8" />
            <Shimmer className="size-8" />
            <Shimmer className="size-8" />
          </div>
        </div>
      </div>
    </div>
  )
}

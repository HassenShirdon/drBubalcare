"use client"

import { motion } from "motion/react"

interface TableSkeletonProps {
  rows?: number
  columns?: number
  search?: boolean
}

function Shimmer({ className }: { className?: string }) {
  return (
    <div className={`relative overflow-hidden rounded ${className ?? ""}`} style={{ background: 'var(--admin-border)' }}>
      <motion.div
        className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent dark:via-white/5"
        animate={{ translateX: ["0%", "100%"] }}
        transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
      />
    </div>
  )
}

export function TableSkeleton({ rows = 5, columns = 4, search = true }: TableSkeletonProps) {
  return (
    <div className="space-y-4">
      {search && (
        <div className="flex items-center justify-between">
          <Shimmer className="h-8 w-64" />
          <Shimmer className="h-8 w-20" />
        </div>
      )}

      <div className="rounded-xl border border-admin-border overflow-hidden">
        <div className="w-full">
          <div className="flex items-center border-b border-admin-border px-4 py-3 bg-admin-bg/50">
            {Array.from({ length: columns }).map((_, i) => (
              <div key={i} className="flex-1 px-2">
                <Shimmer className="h-3.5 w-20" />
              </div>
            ))}
          </div>

          {Array.from({ length: rows }).map((_, rowIdx) => (
            <div
              key={rowIdx}
              className="flex items-center border-b border-admin-border/50 px-4 py-3 last:border-b-0"
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

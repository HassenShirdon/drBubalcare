"use client"

import { signOut } from "next-auth/react"
import { useRouter } from "next/navigation"
import { LogOut, User, ChevronDown } from "lucide-react"
import { useState, useRef, useEffect } from "react"

interface AdminUserButtonProps {
  name: string | null
  email: string | null
}

export function AdminUserButton({ name, email }: AdminUserButtonProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const initials = (name ?? email ?? "A")
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase()

  return (
    <div ref={ref} className="relative">
      <button
        data-slot="admin-user-btn"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-admin-text-faint transition-colors hover:text-admin-text focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-admin-accent-blue/40"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-admin-brand text-[11px] font-semibold text-white">
          {initials}
        </div>
        <span className="hidden max-w-[120px] truncate text-admin-text-faint sm:inline">{name ?? email}</span>
        <ChevronDown className={`size-3.5 text-admin-text-faint transition-transform ${open ? "rotate-180" : ""}`} aria-hidden="true" />
      </button>

      {open && (
        <div
          data-slot="admin-user-dropdown"
          className="absolute right-0 top-full z-50 mt-2 w-64 overflow-hidden rounded-xl border border-admin-border bg-admin-surface shadow-lift"
        >
          <div className="border-b border-admin-border px-4 py-3">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-admin-brand-light text-sm font-semibold text-admin-accent-blue">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-admin-text">{name ?? "Admin"}</p>
                <p className="truncate text-[11px] text-admin-text-faint">{email}</p>
              </div>
            </div>
          </div>

          <div className="py-1.5">
            <button
              onClick={() => {
                setOpen(false)
                router.push("/admin")
              }}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-admin-text transition-colors hover:bg-admin-surface-hover focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-accent-blue/40"
            >
              <User className="size-4 text-admin-text-faint" aria-hidden="true" />
              Profile
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="flex w-full items-center gap-2.5 px-4 py-2 text-sm text-admin-danger transition-colors hover:bg-admin-danger-light focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-admin-danger/40"
            >
              <LogOut className="size-4" aria-hidden="true" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

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
        className="flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-sm text-admin-text-faint hover:text-admin-text transition-colors"
      >
        <div className="w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-bold text-white" style={{ background: 'var(--admin-brand)' }}>
          {initials}
        </div>
        <span className="hidden sm:inline max-w-[120px] truncate text-admin-text-faint">{name ?? email}</span>
        <ChevronDown className={`size-3.5 text-admin-text-faint transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div
          data-slot="admin-user-dropdown"
          className="absolute right-0 top-full mt-2 w-64 rounded-xl border border-admin-border shadow-lg z-50 overflow-hidden bg-admin-surface"
        >
          <div className="px-4 py-3 border-b border-admin-border">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold bg-admin-brand-light text-admin-accent-blue">
                {initials}
              </div>
              <div className="min-w-0">
                <p className="text-sm font-medium truncate text-admin-text">{name ?? "Admin"}</p>
                <p className="text-[11px] truncate text-admin-text-faint">{email}</p>
              </div>
            </div>
          </div>

          <div className="py-1.5">
            <button
              onClick={() => {
                setOpen(false)
                router.push("/admin")
              }}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-admin-text hover:bg-admin-surface-hover transition-colors"
            >
              <User className="size-4 text-admin-text-faint" />
              Profile
            </button>
            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-admin-danger hover:bg-admin-danger-light transition-colors"
            >
              <LogOut className="size-4" />
              Sign out
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
